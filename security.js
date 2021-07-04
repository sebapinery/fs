// const encode = (password) => {
//   return password.replace(/./g, (p) => {
//     return ("00" + p.charCodeAt(0)).slice(-3);
//   });
// };

const crypto = require("crypto");

const hash = (passwordEntered) => {

  const secret = "abcdefg";
  const hash = crypto
    .createHmac("sha256", secret)
    .update(passwordEntered)
    .digest("hex");
  // console.log("hash: ", hash);
  return hash;

  const passwordEncrypt = passwordEntered.trim().split("");
  // return passwordEncrypt.reduce(
  //   (h, c) => (h = c.charCodeAt(0) + (h << 6) + (h << 16) - h),
  //   0
  // );
};

// const decode = (excryptedPassword) => {
//   return excryptedPassword.replace(/.{3}/g, (p) => {
//       return String.fromCharCode(p);
//   });
// };

module.exports = {
  // encode,
  hash
  // decode
};
