export interface AuthResetPasswordForm {
  email: string;
  username: string;
  newPassword: string;
  repeatPassword: string;
}

export interface AuthMessageResponse {
  message: string;
}
