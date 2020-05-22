export function generateRandomString(length: number): string {
  let randomString = '';
  const stringValues = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    randomString += stringValues.charAt(Math.floor(Math.random() * stringValues.length));
  }

  return randomString;
}
