export interface HxValidation {
  hxValidation?: {
    triggerOn?: "keyup" | "blur";
  };
}

export interface BaseInputComponent {
  name: string;
  label?: string;
  errors?: Array<string>;
  wrapperClass?: string;
}
