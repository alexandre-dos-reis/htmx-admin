export interface HxValidation {
  hxValidation?: {
    method?: "put" | "post" | "get" | "delete";
    url?: string;
    triggerOn?: "keyup" | "blur";
  };
}

export interface BaseFormComponent {
  name: string;
  label?: string;
  errors?: Array<string>;
  wrapperClass?: string;
}
