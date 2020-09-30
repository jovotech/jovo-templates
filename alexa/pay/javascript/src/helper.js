function generateRandomString(length) {
  let randomString = '';
  const stringValues = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    randomString += stringValues.charAt(Math.floor(Math.random() * stringValues.length));
  }

  return randomString;
}

module.exports = {
  generateRandomString,
};
