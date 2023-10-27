import bcrypt from "bcryptjs";

export const hashPassword = async (password) => {
  try {
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(password, saltRound);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparedPassword = (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
