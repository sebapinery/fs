const { hash } = require("../security");

const user_roles = {
  read_only: 1,
  regular: 2,
  super: 3,
};

class User {

  #password;
  constructor(name, password, metadata) {
    const date = new Date();
    this.name = name;
    this.metadata = {
      roleId: metadata.roleId,
      createdAt: `${date.toLocaleDateString(
        "es-AR"
        )} - ${date.toLocaleTimeString("es-AR")}`,
      };
      this.#password = hash(password);
  }

  showName() {
    return this.name;
  }

  comparePassword(passwordEntered) {
    const encodedPassword =
      hash(passwordEntered);
    if (this.#password === encodedPassword) {
      return true;
    } else {
      return false;
    }
  }

  editPassword(newPassword) {
    this.#password = hash(newPassword);
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
