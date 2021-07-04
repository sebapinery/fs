// const encode = (password) => {
//   return password.replace(/./g, (p) => {
//     return ("00" + p.charCodeAt(0)).slice(-3);
//   });
// };

const hash = (passwordEntered, n) => {
  const password = passwordEntered.trim().split("");

  return password.reduce(
    (h, c) => (h = c.charCodeAt(0) + (h << 6) + (h << 16) - h),
    0
  ) * n;
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
