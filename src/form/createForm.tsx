import { z } from "zod";
import { ComponentProps } from "~/utils";
import {
  SelectInput,
  SelectInputProps,
  DropdownInput,
  DropdownInputProps,
  ToggleInput,
  ToggleInputProps,
  RadioInput,
  RadioInputProps,
  TextInput,
  TextInputProps,
} from "./inputs/*";
import { Form } from "./Form";
import { match } from "ts-pattern";
import { globalContext } from "~/config/globalStorages";
import { ContextDecorated } from "~/config/decorateRequest";
import { MaybePromise } from "~/utils/types";

export type FieldError = Array<string> | undefined;
export type AnonFormErrors = Record<string, FieldError> | undefined;

type OmitName<TProps extends { name: string }> = Omit<TProps, "name">;

type Params = { currentRecordId: string };

type LoadSchema<T extends Params> = (context: NonNullable<ContextDecorated>, params?: T) => z.ZodTypeAny;

type PropsPerType =
  | {
      type?: "text";
      props: OmitName<TextInputProps>;
    }
  | {
      type: "toggle";
      props: OmitName<ToggleInputProps>;
    }
  | {
      type: "select";
      props: OmitName<SelectInputProps>;
    }
  | {
      type: "dropdown";
      props: OmitName<DropdownInputProps>;
    }
  | {
      type: "radio";
      props: OmitName<RadioInputProps>;
    };

export type FieldsDefinition<T extends Params = Params> = Record<
  string,
  PropsPerType & {
    schema: LoadSchema<T>;
  }
>;

export const createForm = <TFields extends FieldsDefinition<Params>>({ fields }: { fields: TFields }) => {
  type Schema = z.ZodObject<{
    [Key in keyof TFields]: ReturnType<TFields[Key]["schema"]>;
  }>;

  type Data = z.infer<Schema>;

  type Errors = Partial<Record<keyof Data, FieldError>>;

  const getSchemaFromDefinition = (args?: { params?: Params }): Schema => {
    return Object.keys(fields).reduce((_schema, keyOfField) => {
      return _schema.extend({
        [keyOfField]: fields[keyOfField].schema(globalContext.getStore()!, args?.params),
      });
    }, z.object({})) as Schema;
  };

  const handleForm = async (
    params?: Params,
  ): Promise<{
    data?: Data;
    errors?: Errors;
  }> => {
    const context = globalContext.getStore();

    if (!context?.isMethodPost) {
      return { data: undefined, errors: undefined };
    }

    const schema = getSchemaFromDefinition({ params });

    let parsedSchema: Awaited<ReturnType<(typeof schema)["spa"]>>;

    if (context.isFormValidationRequest) {
      const name = context.inputNameRequest;
      const body = context.body as Record<string, unknown>;

      if (name && name in body && name in fields) {
        parsedSchema = await schema.shape[name].spa(body[name]);
      } else {
        return { data: undefined, errors: undefined };
      }
    } else {
      parsedSchema = await schema.spa(context?.body);
    }

    if (parsedSchema.success) {
      return { data: parsedSchema.data, errors: undefined };
    } else {
      return {
        data: undefined,
        errors: (context.isFormValidationRequest
          ? { [context.inputNameRequest]: parsedSchema.error.flatten().formErrors }
          : parsedSchema.error.flatten().fieldErrors) as Errors,
      };
    }
  };

  const getComponent = ({ propsPerType: propsPerType, name }: { propsPerType: PropsPerType; name: string }) => {
    return match(propsPerType)
      .with({ type: "text" }, ({ props }) => <TextInput {...props} name={name} />)
      .with({ type: "toggle" }, ({ props }) => <ToggleInput {...props} name={name} />)
      .with({ type: "radio" }, ({ props }) => <RadioInput {...props} name={name} />)
      .with({ type: "select" }, ({ props }) => <SelectInput {...props} name={name} />)
      .with({ type: "dropdown" }, ({ props }) => <DropdownInput {...props} name={name} />)
      .otherwise(({ props }) => <TextInput {...props} name={name} />);
  };

  const renderForm = async ({
    formProps,
    loadDefaultValues,
    errors,
    disableHxValidation,
  }: {
    loadDefaultValues?: (ctx: ContextDecorated) => MaybePromise<Data>;
    formProps?: ComponentProps<typeof Form>;
    errors?: Errors;
    disableHxValidation?: boolean;
  }) => {
    const context = globalContext.getStore();

    if (!disableHxValidation && context?.isFormValidationRequest) {
      return renderInputFromHxRequest({ errors });
    }

    const defaultValues = context?.isMethodGet ? await loadDefaultValues?.(context) : undefined;

    return (
      <Form {...formProps}>
        {Object.keys(fields).map(async (name) => {
          const { type, props } = fields[name];
          return getComponent({
            name,
            propsPerType: {
              type: type as any,
              props: {
                ...props,
                value: context?.isMethodGet ? defaultValues?.[name] : undefined,
                errors: errors?.[name],
              },
            },
          });
        })}
      </Form>
    );
  };

  const renderFormInput = ({ name, error }: { name: keyof TFields; error: FieldError }) => {
    const { type, props } = fields[name];
    return getComponent({
      name: name as string,
      propsPerType: {
        props: { ...props, errors: error } as any,
        type: type as any,
      },
    });
  };

  const renderInputFromHxRequest = (opts?: { errors?: Errors }) => {
    const context = globalContext.getStore();
    const name = context?.inputNameRequest;

    if (name && name in fields) {
      return renderFormInput({ name, error: opts?.errors?.[name] });
    }

    return <></>;
  };

  return { handleForm, renderForm };
};
