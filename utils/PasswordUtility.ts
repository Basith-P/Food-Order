import bcrypt from "bcrypt";

export const generateSalt = async () => {
  return await bcrypt.genSalt();
};

export const encryptPassword = async (passwd: string, salt: string) => {
  return await bcrypt.hash(passwd, salt);
};
