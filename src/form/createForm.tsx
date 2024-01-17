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
import { ATTRIBUTES_CONSTANTS } from "~/config/constants";
import { match } from "ts-pattern";
import { globalContext } from "~/config/globalStorages";
import { ContextDecorated } from "~/config/decorateRequest";
import { MaybePromise } from "~/utils/types";

export type FieldError = Array<string> | undefined;
export type AnonFormErrors = Record<string, FieldError> | undefined;

type OmitName<TProps extends { name: string }> = Omit<TProps, "name">;

type Params = { currentRecordId: string };

type LoadSchema<T extends Params> = (context: NonNullable<ContextDecorated>, params?: T) => z.ZodTypeAny;

type PropsPerType<T extends Params> =
  | {
      type?: "text";
      props: OmitName<TextInputProps>;
      schema: LoadSchema<T>;
    }
  | {
      type: "toggle";
      props: OmitName<ToggleInputProps>;
      schema: LoadSchema<T>;
    }
  | {
      type: "select";
      props: OmitName<SelectInputProps>;
      schema: LoadSchema<T>;
    }
  | {
      type: "dropdown";
      props: OmitName<DropdownInputProps>;
      schema: LoadSchema<T>;
    }
  | {
      type: "radio";
      props: OmitName<RadioInputProps>;
      schema: LoadSchema<T>;
    };

export type FieldsDefinition = Record<string, PropsPerType<Params>>;

export const createForm = <TFields extends FieldsDefinition>({ fields }: { fields: TFields }) => {
  type Schema = z.ZodObject<{
    [Key in keyof TFields]: ReturnType<TFields[Key]["schema"]>;
  }>;

  type Data = z.infer<Schema>;

  const getSchemaFromDefinition = (args?: { params?: Params }): Schema => {
    const ctx = globalContext.getStore();
    // @ts-ignore
    return z.object(
      Object.fromEntries(
        new Map(
          Object.keys(fields).map((k) =>
            args?.params
              ? ([k, fields[k].schema(ctx!, args?.params)] as [keyof TFields, ReturnType<TFields[typeof k]["schema"]>])
              : ([k, fields[k].schema(ctx!)] as [keyof TFields, ReturnType<TFields[typeof k]["schema"]>]),
          ),
        ),
      ),
    );
  };

  type Errors = Partial<Record<keyof Data, FieldError>>;

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

    const parsedSchema = await getSchemaFromDefinition({ params }).safeParseAsync(context?.body);

    if (parsedSchema.success) {
      return { data: parsedSchema.data, errors: undefined };
    } else {
      return {
        data: undefined,
        // @ts-ignore
        errors: parsedSchema.error.flatten().fieldErrors,
      };
    }
  };

  const getComponent = ({
    propsPerType: { schema, ...propsPerType },
    name,
  }: {
    propsPerType: PropsPerType<Params>;
    name: string;
  }) => {
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
    loadDefaultValues?: (ctx: ContextDecorated) => MaybePromise<{
      [Key in keyof TFields]: z.infer<ReturnType<TFields[Key]["schema"]>>;
    }>;
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
          const { type, props, schema } = fields[name];
          return getComponent({
            name,
            propsPerType: {
              schema,
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
    const { type, props, schema } = fields[name];
    return getComponent({
      name: name as string,
      propsPerType: {
        schema,
        props: { ...props, errors: error } as any,
        type: type as any,
      },
    });
  };

  const renderInputFromHxRequest = (opts?: { errors?: Errors }) => {
    const context = globalContext.getStore();

    let name = context?.hxTriggerName || context?.hxTargetId?.replace(ATTRIBUTES_CONSTANTS.form["inputWrapperId"], "");

    if (name && name in fields) {
      return renderFormInput({ name, error: opts?.errors?.[name] });
    }

    return <></>;
  };

  return { handleForm, renderForm };
};
