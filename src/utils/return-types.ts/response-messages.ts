export const ApiResponseMessages = {
  success: {
    SIGNUP: 'Signup was successful',
    LOGIN: 'Login successful',
    LOGOUT: 'Logout successful',
    AUTHCHECK: 'Authenticated and login tracked',
  },
  error: {
    USERNAME_TAKEN: 'Username already taken. Please try another username.',
    EMAIL_TAKEN: 'E-Mail already exists. Please try another E-Mail.',
    INVALID_PASSWORD:
      'The password you entered is incorrect. Please try again.',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match. Please try again.',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token. Please login again.',
    GENERAL_EXCEPTION: 'Oops! Something went wrong. Please try again.',
    USER_NOT_FOUND: 'User not found. Please check your username and try again.',
    TOKEN_NOT_FOUND: 'Token not found. Please try again.',
  },
};
