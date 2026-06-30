const ERROR_MESSAGE_TEXT = {
    common: {
        requiredFields: 'Todos los campos son obligatorios',
        invalidIdentifiers: 'Los identificadores deben ser números válidos',
        invalidProfileId: 'El identificador del perfil no es válido',
        invalidUserId: 'El identificador del usuario debe ser un número válido'
    },
    article: {
        loadError: 'Server error al recuperar artículos',
        notFound: 'Artículo no encontrado',
        detailError: 'Error al encontrar artículo',
        imageUrlInvalid: 'La foto debe ser una URL válida de máximo 200 caracteres',
        relatedEntityNotFound: 'El perfil o la categoría indicada no existe',
        fieldTooLong: 'Algún campo supera el tamaño máximo permitido',
        createError: 'Server error al subir el artículo',
        buyUnavailable: 'Artículo no disponible para la compra',
        buyError: 'Server error al comprar el artículo',
        reserveUnavailable: 'Artículo no disponible para la reserva',
        reserveError: 'Server error al reservar el artículo',
        userArticlesError: 'Error del servidor al obtener los artículos del usuario'
    },
    category: {
        loadError: 'Error del servidor al obtener las categorías',
        nameRequired: 'El nombre de la categoría es obligatorio',
        duplicatedName: 'Ya existe una categoría con ese nombre',
        createError: 'Error del servidor al crear la categoría',
        notFound: 'Categoría no encontrada',
        updateError: 'Error del servidor al actualizar la categoría',
        deleteInUse: 'No se puede eliminar porque la categoría está siendo utilizada',
        deleteError: 'Error del servidor al eliminar la categoría'
    },
    auth: {
        credentialsRequired: 'Email y contraseña son obligatorios',
        invalidCredentials: 'Error email y/o contraseña'
    },
    user: {
        passwordMismatch: 'Las contraseñas no coinciden',
        duplicatedEmail: 'Ese email ya está registrado',
        duplicatedUsername: 'Ese nombre de usuario ya está registrado',
        resetUserNotFound: 'No existe ningún usuario con ese email y nombre de usuario'
    },
    profile: {
        notFound: 'Perfil no encontrado',
        currentPasswordRequired: 'Introduce la contraseña actual',
        invalidCurrentPassword: 'La contraseña actual no es correcta'
    },
    favorite: {
        duplicated: 'Este artículo ya se encuentra en tu lista de favoritos',
        saveError: 'Server error al guardar a favoritos',
        loadError: 'Error del servidor al obtener los favoritos'
    },
    review: {
        createError: 'Server error al crear la valoración'
    },
    report: {
        pendingLoadError: 'Error al cargar los Reportes pendientes',
        userReportsLoadError: 'Error al cargar los reportes del usuario',
        notFound: 'Reporte no encontrado',
        loadError: 'Error al cargar el reporte',
        statsLoadError: 'Error al cargar las estadísticas de estado',
        updateError: 'Error al actualizar el estado del reporte',
        requiredFields: 'Todos los campos obligatorios son necesarios para procesar la denuncia',
        createError: 'Server error while creating report'
    },
    message: {
        articleNotFound: 'Artículo no encontrado',
        sameSenderReceiver: 'El emisor y receptor no pueden ser el mismo usuario',
        sellerRequired: 'La conversación debe incluir al vendedor del artículo',
        sendError: 'Error al enviar el mensaje',
        conversationNotFound: 'Conversación no encontrada',
        conversationsLoadError: 'Error al cargar conversaciones',
        invalidReportId: 'El identificador del reporte debe ser un número válido',
        reportConversationNotFound: 'Conversación no encontrada para este reporte',
        reportConversationForbidden: 'No tienes permiso para ver esta conversación de reporte',
        reportConversationLoadError: 'Error al cargar la conversación del reporte',
        reportMessageRequiredFields: 'Texto, emisor y reporte son obligatorios',
        moderatorOnly: 'Solo el moderador puede responder a este reporte',
        adminNotFound: 'Administrador no encontrado',
        adminReadOnly: 'El administrador solo puede visualizar la conversación',
        sendReportMessageError: 'Error al enviar mensaje al denunciante',
        invalidStatus: 'Status inválido',
        invalidConversationId: 'ID de conversación inválido',
        statusUpdateError: 'Error al cambiar el status'
    }
};

module.exports = {
    ERROR_MESSAGE_TEXT
};
