export interface AuthResetPasswordForm {
  email: string;
  newPassword: string;
  repeatPassword: string;
}

export interface AuthMessageResponse {
  message: string;
}
