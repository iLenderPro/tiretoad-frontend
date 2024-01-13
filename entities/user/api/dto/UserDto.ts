export type UserDto = {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  active?: boolean;
  verificationToken?: string;
};
