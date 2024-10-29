import { commonContent } from "@/content";

export const isUsernameValid = (value: string): [boolean, string] => {
  if (value.length >= 8 && value.length <= 15) return [true, ""];
  else return [false, "Username must be between 8 to 15 characters"];
};

export const isPasswordValid = (value: string): [boolean, string] => {
  const hasLowercase = /[a-z]/.test(value);
  const hasUppercase = /[A-Z]/.test(value);
  const hasDigit = /\d/.test(value);
  const hasSpecialChar = /[\W]/.test(value);

  if (!hasLowercase) {
    return [false, "Password must contain at least one lowercase letter."];
  }
  if (!hasUppercase) {
    return [false, "Password must contain at least one uppercase letter."];
  }
  if (!hasDigit) {
    return [false, "Password must contain at least one digit."];
  }
  if (!hasSpecialChar) {
    return [false, "Password must contain at least one special character."];
  }
  if (value.length < 8 || value.length > 15) {
    return [false, "Password must be between 8 to 15 characters"];
  }
  return [true, ""];
};

export const isConfirmPasswordValid = (
  password: string,
  confirmPassword: string
): [boolean, string] => {
  if (confirmPassword.length === 0) return [false, commonContent.required];
  if (password !== confirmPassword) return [false, commonContent.notmatch];
  return [true, ""];
};
