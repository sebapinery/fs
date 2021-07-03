class User{
    constructor(name, password, metadata){
        this.name = name;
        this.password = password;
        this.metadata = {
            type: "user",
            roleId: metadata.role,
            createdAt: `${new Date().toLocaleDateString(
              "es-AR"
            )} - ${new Date().toLocaleTimeString("es-AR")}`,
          };
    }

    showName(){
        return this.name;
    }
    showPassword(){
        return this.password;
    }
    editPassword(newPassword){
        return this.password = newPassword;
    }
    showMetadata(){
        return this.metadata;
    }
    showRoleId(){
        return this.metadata.roleId;
    }
    showCreatedAt(){
        return this.metadata.createdAt;
    }
}

module.exports = User;