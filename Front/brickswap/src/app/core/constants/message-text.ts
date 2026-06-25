export const MESSAGE_TEXT = {
  auth: {
    loginRequiredFields: 'Email y password son campos requeridos',
    loginInvalidCredentials: 'Email y/o Password incorrecto',
    resetRequiredFields: 'Email, usuario, nueva contraseña y repetir contraseña son campos requeridos',
    resetPasswordMismatch: 'Las contraseñas no coinciden',
    resetPasswordSuccess: 'Contraseña actualizada correctamente',
    resetPasswordError: 'No se pudo actualizar contraseña',
  },
  home: {
    categoriesLoadError: 'No se han podido cargar las categorías',
    latestProductsLoadError: 'No se han podido cargar los últimos productos',
    promotionProductsLoadError: 'No se han podido cargar los productos en promoción',
  },
  messages: {
    emptyConversation:
      'Inicia la conversación enviando un mensaje, haciendo una oferta de precio o proponiendo un método de entrega.',
  },
  articleDetail: {
    buyLoginRequired: 'Necesitas haber iniciado sesión para comprar un artículo',
    reserveLoginRequired: 'Necesitas haber iniciado sesión para reservar un artículo',
    messageLoginRequired: 'Debes iniciar sesión para enviar un mensaje',
    reportLoginRequired: 'Necesitas haber iniciado sesión para denunciar un artículo',
    ownConversationError: 'No puedes iniciar una conversación contigo mismo',
    sellerMessagePrompt: 'Escribe tu mensaje para el vendedor:',
    reportReasonPrompt: 'Motivo del reporte:',
    sendMessageError: 'Error al enviar el mensaje',
    sendReportError: 'Error al enviar el reporte',
    favoriteError: 'Error al añadir a favoritos',
  },
} as const;
