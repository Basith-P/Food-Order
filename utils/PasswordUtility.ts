import bcrypt from "bcrypt";

export const generateSalt = async () => {
  return await bcrypt.genSalt();
};

export const encryptPassword = async (passwd: string, salt: string) => {
  return await bcrypt.hash(passwd, salt);
};

export const validatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  const encrypted = await encryptPassword(enteredPassword, salt);
  // console.log(encrypted === savedPassword);
  return encrypted === savedPassword;
};
