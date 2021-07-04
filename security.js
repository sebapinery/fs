const encode = (password) => {
  return password.replace(/./g, (p) => {
    return ("00" + p.charCodeAt(0)).slice(-3);
  });
};

const decode = (excryptedPassword) => {
  return excryptedPassword.replace(/.{3}/g, (p) => {
      return String.fromCharCode(p);
  });
};

module.exports = { encode, decode };
