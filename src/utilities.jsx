/**
 * The function `makeid` generates a random alphanumeric string of a specified length.
 * @returns A randomly generated string of the specified length containing a mix of uppercase letters,
 * lowercase letters, and numbers.
 */
export const makeid = (length) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
