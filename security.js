const crypto = require("crypto");

const hash = (passwordEntered) => {
  const secret = "shipnow";
  const hash = crypto
    .createHmac("sha256", secret)
    .update(passwordEntered)
    .digest("hex");
  return hash;
};


const comparePassword = (passwordEncrypted, passwordEntered) => {
  if(passwordEncrypted !== hash(passwordEntered)) return false;
  return true;
}

module.exports = {
  hash,
  comparePassword
};
