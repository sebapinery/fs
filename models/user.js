const { hash } = require("../security");

const user_roles = {
  read_only: 1,
  regular: 2,
  super: 3,
};

class User {

  password;
  constructor(name, password, metadata) {
    const date = new Date();
    this.name = name;
    this.metadata = {
      roleId: metadata.roleId,
      createdAt: `${date.toLocaleDateString(
        "es-AR"
        )} - ${date.toLocaleTimeString("es-AR")}`,
      };
      this.password = hash(password);
  }

}

module.exports = { User, user_roles };
