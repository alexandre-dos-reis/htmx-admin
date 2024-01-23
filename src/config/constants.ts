export const HEADERS_CONSTANTS = {
  formValidation: "App-Form-Validation",
  formSaveAndContinue: "App-Form-Save-And-Continue",
  renderFormUpdate: "App-Render-Form-Update",
  renderNavbar: "App-Render-Navbar",
  renderFragment: "App-Fragment",
} as const;

export const ATTRIBUTES_CONSTANTS = {
  form: {
    inputWrapperId: `-input-wrapper`,
    inputErrorId: `-input-error`,
    inputId: `-input-field`,
  },
} as const;
