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
  colspanClass?: (string & {}) | "col-span-12 lg:col-span-6 xl:col-span-4";
}
