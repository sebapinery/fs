const { encode, hash } = require("../security");

const user_roles = {
  read_only: 1,
  regular: 2,
  super: 3,
};

class User {
  #password;
  #randomNum;
  #numDate;
  constructor(name, password, metadata) {
    const date = new Date();
    this.name = name;
    this.#randomNum = Math.random();
    this.#numDate = date.getTime(),
    this.#password = hash(password, this.#randomNum) * this.#numDate;
    this.metadata = {
      roleId: metadata.roleId,
      createdAt: `${date.toLocaleDateString(
        "es-AR"
      )} - ${date.toLocaleTimeString("es-AR")}`,
    };
  }

  showName() {
    return this.name;
  }

  comparePassword(passwordEntered) {
    const encodedPassword =
      hash(passwordEntered, this.#randomNum) * this.#numDate;
    if (this.#password === encodedPassword) {
      return true;
    } else {
      return false;
    }
  }

  editPassword(newPassword) {
    this.password = hash(newPassword, this.#randomNum) * this.#numDate;
    return true;
  }

  showRoleId() {
    return this.metadata.roleId;
  }

  print() {
    const roleId = Object.keys(user_roles);
    const finded = Object.values(user_roles).indexOf(this.metadata.roleId);

    return {
      username: this.name,
      roleId: roleId[finded],
      createdAt: this.metadata.createdAt,
    };
  }
}

module.exports = { User, user_roles };
