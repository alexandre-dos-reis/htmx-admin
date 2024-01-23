import { z } from "zod";
import { ComponentProps, isObjectEmpty } from "~/utils";
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
import { getContext } from "~/config/globalStorages";
import { ContextDecorated } from "~/config/decorateRequest";
import { MaybePromise, PartialExtended } from "~/utils/types";
import { appendSchemaProcess } from "./processes";

export type FieldError = Array<string> | undefined;
// export type AnonFormErrors = Record<string, FieldError> | undefined;

type OmitName<TProps extends { name: string }> = Omit<TProps, "name">;

// export type Params = { currentRecordId: string };

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

export type FieldDef = PropsPerType & {
  schema: z.ZodTypeAny;
};

export type FieldsDef = Record<string, FieldDef>;

export type RecordId = string | number | undefined;

const getSchemaFromDefinition = (args: { fields: FieldsDef }) => {
  return Object.keys(args.fields).reduce((formSchema, keyOfField) => {
    return formSchema.extend({
      [keyOfField]: appendSchemaProcess({ field: args.fields[keyOfField] }),
    });
  }, z.object({}));
};

// Main Func
export const createForm = <TFields extends FieldsDef>({
  loadFields,
}: {
  loadFields: (ctx: ContextDecorated, formArgs?: { recordId: RecordId }) => TFields;
}) => {
  // TYPE DEFINITIONS
  type Schema = z.ZodObject<
    {
      [Key in keyof TFields]: TFields[Key]["schema"];
    },
    "strip",
    z.ZodTypeAny,
    {
      [Key in keyof TFields]: z.infer<TFields[Key]["schema"]>;
    },
    {
      [Key in keyof TFields]: z.infer<TFields[Key]["schema"]>;
    }
  >;

  type Data = z.infer<Schema>;

  type Errors = Partial<Record<keyof Data, FieldError>>;

  let recordId: RecordId | undefined;

  // METHODS
  const handleForm = async (args?: {
    recordId: RecordId;
  }): Promise<
    | {
        data: undefined;
        errors: undefined;
      }
    | {
        data: Data;
        errors: undefined;
      }
    | {
        data: undefined;
        errors: Errors;
      }
  > => {
    const ctx = getContext();

    recordId = args?.recordId;

    if (!ctx?.isMethodPost) {
      return { data: undefined, errors: undefined };
    }

    const fields = loadFields(ctx!, { recordId: args?.recordId });

    const schema = getSchemaFromDefinition({ fields }) as Schema;

    let parsedSchema: Awaited<ReturnType<(typeof schema)["spa"]>>;

    if (ctx?.isFormValidationRequest) {
      const name = ctx?.inputNameRequest;
      const body = ctx?.body as Record<string, unknown>;

      if (name && name in body && name in fields) {
        parsedSchema = await schema.shape[name].spa(body[name]);
      } else {
        return { data: undefined, errors: undefined };
      }
    } else {
      parsedSchema = await schema.spa(ctx?.body);
    }

    if (parsedSchema.success) {
      return { data: parsedSchema.data, errors: undefined };
    } else {
      return {
        data: undefined,
        errors: (ctx?.isFormValidationRequest
          ? { [ctx?.inputNameRequest]: parsedSchema.error.flatten().formErrors }
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
    loadDefaultValues?: (ctx: ContextDecorated) => MaybePromise<PartialExtended<Data> | null>;
    formProps?: Omit<ComponentProps<typeof Form>, "mode">;
    errors?: Errors;
    disableHxValidation?: boolean;
  }) => {
    const ctx = getContext();

    const fields = loadFields(ctx!, { recordId });

    if (!disableHxValidation && ctx?.isFormValidationRequest) {
      return renderInputFromHxRequest({ errors, fields });
    }

    const defaultValues = await loadDefaultValues?.(ctx!);

    return (
      <Form {...formProps} mode={recordId ? "edit" : "create"}>
        {Object.keys(fields).map(async (name) => {
          const { type, props } = fields[name];
          return getComponent({
            name,
            propsPerType: {
              type: type as any,
              props: {
                ...props,
                value: defaultValues?.[name] as NonNullable<(typeof defaultValues)[keyof typeof defaultValues]>,
                errors: errors?.[name],
              },
            },
          });
        })}
      </Form>
    );
  };

  const renderInputFromHxRequest = (args: { errors?: Errors; fields: TFields }) => {
    const context = getContext();
    const name = context?.inputNameRequest;

    if (name && name in args?.fields) {
      const { props, type } = args?.fields[name];
      return getComponent({
        name,
        propsPerType: {
          props: { ...props, errors: args.errors?.[name] },
          type: type,
        } as any,
      });
    }

    return <></>;
  };

  return { handleForm, renderForm };
};
