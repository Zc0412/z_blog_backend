import * as bcrypt from 'bcrypt';

/**
 * hash密码
 * @param password
 */
export const hashPassword = async (password: string) => {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
};

/**
 * 比较检查密码
 * @param password
 * @param storedPasswordHash
 */
export const comparePasswords = async (
  password: string,
  storedPasswordHash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, storedPasswordHash);
};
