export interface User {
  username: string;
  password: string;
}

export interface RegisterUser extends User {
  confirm_password: string;
}

export interface Profile {
  username: string;
}
