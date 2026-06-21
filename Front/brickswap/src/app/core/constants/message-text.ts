export const MESSAGE_TEXT = {
  auth: {
    loginRequiredFields: 'Email y password son campos requeridos',
    loginInvalidCredentials: 'Email y/o Password incorrecto',
    resetRequiredFields: 'Email, nueva contraseña y repetir contraseña son campos requeridos',
    resetPasswordMismatch: 'Las contraseñas no coinciden',
    resetPasswordSuccess: 'Contraseña actualizada correctamente',
    resetPasswordError: 'No se pudo actualizar contraseña',
  },
  home: {
    categoriesLoadError: 'No se han podido cargar las categorías',
    latestProductsLoadError: 'No se han podido cargar los últimos productos',
    promotionProductsLoadError: 'No se han podido cargar los productos en promoción',
  },
} as const;
