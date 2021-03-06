const Folder = require("./models/folder");
const File = require("./models/file");
const { User, user_roles } = require("./models/user");
const Group = require("./models/userGroup");

const { hash, comparePassword } = require("./security");

const fs = require("fs");

const superAdmin = new User("admin", "admin", { roleId: 3 });
const guestUser = new User("guest", "1234", { roleId: 1 });
const normalUser = new User("normal", "1234", { roleId: 2 });

const allUsers = new Group("allUsers", [superAdmin, guestUser, normalUser]);
var currentUser = guestUser;

const initialPath = "~/";
const initialMetaData = {
  path: initialPath,
};

var mainFolder = new Folder("root", [], initialMetaData);
var currentFolder = mainFolder;
var parentFolder;
var currentPath = currentFolder.metadata.path;

const getCurrentUser = () => {
  console.log("-------------------------------------------");
  console.log(`Usted esta logeado con el usuario >>> ${currentUser.name}`);
  console.log("-------------------------------------------");
  return;
};

const checkMyRole = () => {
  const roleId = currentUser.metadata.roleId;
  return roleId;
};

const userExists = (userName) => {
  const userFound = allUsers.composite.filter(
    (user) => user.name === userName
  )[0];
  if (!userFound) {
    return false;
  } else {
    return userFound;
  }
};

const createUser = (argvs) => {
  const [_, username, password, roleFlag] = argvs;
  if (argvs.length < 4)
    return console.log(
      "Por favor ingrese un nombre de usuario, contrasña y rol de usuario. Por ejemplo: create_user newUserName password1234 -role=read_only"
    );
  if (checkMyRole() < 2)
    return console.log(`No posee los permisos para realizar esta accion`);

  const flag = roleFlag.slice(0, 5).trim();
  const roleSelected = roleFlag.slice(6).trim();
  const metadata = {
    roleId: user_roles[roleSelected],
  };

  if (flag !== "-role") {
    console.log(
      `La opcion "${flag}" no es valida. Utilice "-role=" para asignar un tipo de rol`
    );
    return;
  }
  if (metadata.roleId === undefined) {
    console.log(`El rol seleccionado no existe. Debe ingresarlo como '-role='`);
    console.log("");
    console.log(`Roles validos son: 'super', 'regular' y 'read_only'`);
    console.log("");
    return;
  }
  const userFound = userExists(username);
  if (userFound) {
    return console.log(
      `El nombre ${username} ya esta en uso. Por favor utilice otro nombre de usuario.`
    );
  } else {
    const newUser = new User(username, password, metadata);
    addToComposite(newUser, "user");
    console.log(`Se ha creado un nuevo usuario con el nombre ${newUser.name}`);
  }
};

const login = (argvs) => {
  const [_, username, password] = argvs;

  const userFound = userExists(username);
  if (!userFound) return console.log(`El nombre ${username} no existe`);

  const validPassword = comparePassword(userFound.password, password);
  if (!validPassword) {
    return console.log(`La contraseña ingresada no es valida`);
  } else {
    currentUser = userFound;
    console.log("-------------------------------------------");
    console.log("Login correcto!");
    console.log(`Usted esta logeado con el usuario >>> ${currentUser.name}`);
    console.log("-------------------------------------------");
  }
};
const addToComposite = (element, type) => {
  if (type === "file" || type === "folder")
    return currentFolder.composite.push(element);
  if (type === "user") return allUsers.composite.push(element);
  return console.log(`Ocurrio un error!`);
};

const removeFromComposite = (element, type) => {
  if (!type) {
    return currentFolder.composite.filter((e) => e !== element);
  }
  if (type === "user") {
    return allUsers.composite.filter((e) => e !== element);
  }

  return console.log(`Ocurrio un error!`);
};

const deleteUser = (argvs) => {
  const [_, username] = argvs;

  if (checkMyRole() < 2)
    return console.log(`No posee los permisos para realizar esta accion`);

  const existUser = userExists(username);
  if (!existUser) return console.log(`El nombre ${username} no existe`);

  console.log("-------------------------------------------");
  console.log(`Eliminado el usuario: "${username}"`);
  console.log("-------------------------------------------");
  allUsers.composite = removeFromComposite(existUser, "user");
  return true;
};

const updatePassword = (argvs) => {
  const [_, newPassword] = argvs;

  if (checkMyRole() < 2)
    return console.log(`No tiene permisos para realizar esta accion`);

  const encryptedNewPassword = hash(newPassword);
  if (!encryptedNewPassword)
    return console.log(
      `Hubo un error actualizando la contraseña. Intente nuevamente`
    );
  currentUser.password = encryptedNewPassword;
  console.log("-------------------------------------------");
  console.log("Contraseña actualziada con exito");
  console.log("-------------------------------------------");
};

const logout = () => {
  currentUser = guestUser;
  console.log("-------------------------------------------");
  console.log("Usted se ha deslogueado con exito.");
  console.log("-------------------------------------------");
};

const existElement = (name, type) => {
  let existFile;
  if (!type) {
    existFile = currentFolder.composite.filter(
      (content) => content.name === name
    )[0];
  } else {
    existFile = currentFolder.composite
      .filter((content) => content.metadata.type === type)
      .filter((content) => content.name === name)[0];
  }
  if (!existFile) {
    return false;
  } else {
    return true;
  }
};

const isUnique = (name) => {
  const qtyOfFilesSameName = currentFolder.composite.filter(
    (content) => content.name === name
  );

  if (qtyOfFilesSameName.length !== 1) {
    return false;
  } else {
    return true;
  }
};

const finder = (argvs) => {
  const [_, name, type] = argvs;

  const exist = existElement(name, type);
  const unique = isUnique(name);
  if (!exist) return false;
  if (!unique && !type)
    return console.log(
      `El nombre "${name}" pertenecea a un archivo y a una carpeta. Utilice como tercer argumento el tipo de archivo que quiere ver `
    );
  let elementFound;
  if (!type) {
    elementFound = currentFolder.composite.filter(
      (content) => content.name === name
    )[0];
  } else {
    elementFound = currentFolder.composite
      .filter((content) => content.metadata.type === type)
      .filter((content) => content.name === name)[0];
  }
  if (!elementFound) {
    return false;
  } else {
    return elementFound;
  }
};

const deleteElement = (argvs) => {
  const [_, name, type] = argvs;

  if (checkMyRole() < 2) {
    console.log("-------------------------------------------");
    console.log(`No tiene los permisos necesarios para realizar esta accion.`);
    console.log("-------------------------------------------");
    return;
  }

  if (argvs.length === 1)
    return console.log("Ingrese un nombre luego de destroy");
  let elementFound = finder(argvs);
  if (!elementFound) return console.log(`Intente nuevamente`);
  if (!type) {
    console.log(
      `Eliminado el elemento: "${elementFound.name}" de tipo "${elementFound.metadata.type}"`
    );
    currentFolder.composite = removeFromComposite(elementFound);
  } else {
    elementFound = finder(argvs);
    currentFolder.composite = removeFromComposite(elementFound);
    console.log("-------------------------------------------");
    console.log(
      `Eliminado el elemento: "${elementFound.name}" de tipo "${elementFound.metadata.type}"`
    );
    console.log("-------------------------------------------");
    return;
  }
};

const createFile = (argvs) => {
  if (checkMyRole() < 2)
    return console.log(
      `No tiene los permisos necesarios para realizar esta accion.`
    );
  const [_, name] = argvs;
  const content = argvs.slice(2).join(" ");
  const metadata = {
    path: currentPath,
  };
  const nameUsed = existElement(name, "file");
  if (nameUsed) {
    return console.log(`El nombre "${name}" ya esta en uso, seleccione otro.`);
  } else {
    const newFileCreated = new File(name, metadata, content);
    addToComposite(newFileCreated, "file");

    console.log("-------------------------------------------");
    console.log("------------ Archivo creado ---------------");
    console.log("-------------------------------------------");
    console.log(`Nombre del nuevo archivo: "${newFileCreated.name}"`);
    console.log(`Crado en la ruta: ${currentPath}`);
    console.log(`El contenido del nuevo archivo es:`);
    console.log("");
    console.log(newFileCreated.content);
    console.log("");
    console.log("-------------------------------------------");
    return true;
  }
};

const createFolder = (argvs) => {
  const name = argvs[1];
  const metadata = {
    path: currentPath,
    parentFolder: !parentFolder ? mainFolder : parentFolder,
  };

  const nameUsed = existElement(name, "folder");
  if (nameUsed) {
    return console.log(`El nombre "${name}" ya esta en uso, seleccione otro.`);
  } else {
    if (checkMyRole() < 2)
      return console.log(
        `No tiene los permisos necesarios para realizar esta accion.`
      );

    const newFolder = new Folder(name, [], metadata);
    addToComposite(newFolder, "folder");
    console.log("-------------------------------------------");
    console.log("------------ Carpeta creada ---------------");
    console.log("-------------------------------------------");
    console.log("                                           ");
    console.log("                                           ");
    console.log(`Nombre de la nueva carpeta: "${newFolder.name}"`);
    console.log(`Creado en la ruta: ${currentPath}`);
    console.log("                                           ");
    return true;
  }
};

const selectFolder = (argvs) => {
  const [_, name] = argvs;
  if (argvs.length === 1) {
    currentFolder = mainFolder;
    currentPath = currentFolder.metadata.path;
    console.log("-------------------------------------------");
    console.log(`Usted esta ahora la ruta >>> ${currentPath}`);
    console.log("-------------------------------------------");
    return;
  } else if (name === "..") {
    return moveToParentFolder();
  } else {
    const folderFound = finder([_, name, "folder"]);

    if (!folderFound) {
      console.log(`La carpeta con nombre "${name}" no existe`);
      return;
    } else {
      if (folderFound.metadata.type !== "folder") {
        console.log(`La carpeta con nombre "${name}" no existe`);
        return;
      }

      parentFolder = currentFolder;
      currentFolder = folderFound;

      if (currentPath === "~/") {
        currentPath = `${currentPath + currentFolder.name}`;
      } else {
        currentPath = `${currentPath + "/" + currentFolder.name}`;
      }
      console.log("-------------------------------------------");
      console.log(`Usted esta ahora la ruta >>> ${currentPath}`);
      console.log("-------------------------------------------");
    }
  }
};

const moveToParentFolder = () => {
  if (currentFolder === mainFolder) {
    currentPath = currentFolder.metadata.path;
    console.log("-------------------------------------------");
    console.log(`Usted esta ahora la ruta >>> ${currentPath}`);
    console.log("-------------------------------------------");
  } else if (parentFolder === undefined) {
    currentFolder = mainFolder;
    currentPath = currentFolder.metadata.path;
    console.log("-------------------------------------------");
    console.log(`Usted esta ahora la ruta >>> ${currentPath}`);
    console.log("-------------------------------------------");
  } else {
    currentPath = currentFolder.metadata.path;
    currentFolder = parentFolder;
    parentFolder = currentFolder.metadata.parentFolder;
    console.log("-------------------------------------------");
    console.log(`Usted esta ahora la ruta >>> ${currentPath}`);
    console.log("-------------------------------------------");
  }
};

const showCurrentPath = () => {
  console.log("-------------------------------------------");
  console.log(`Usted esta ahora la ruta >>> ${currentPath}`);
  console.log("-------------------------------------------");
};

const listContent = () => {
  const content = currentFolder.composite;
  if (content.length === 0) return console.log("El directorio esta vacio");
  console.log(`Mostrando el contenido de la carpeta "${currentFolder.name}"`);
  content.forEach((element) => {
    console.log("----------------------------------------");
    console.log(`Nombre: ${element.name}`);
    console.log(`Ruta: ${element.metadata.path}`);
    console.log(`Tipo: ${element.metadata.type}`);
    console.log(`Fecha de creacion: ${element.metadata.createdAt}`);
    console.log("----------------------------------------");
    return;
  });
};

const showFile = (argvs) => {
  const [_, name] = argvs;
  if (!name) return console.log("Ingrese el nombre del archivo que quiere ver");
  const fileExist = existElement(name, "file");

  if (!fileExist) {
    console.log(`El archivo con nombre "${name}" no existe`);
  } else {
    const fileFound = finder([_, name, "file"]);
    if (!fileFound) {
      console.log(`El archivo con nombre "${name}" no existe`);
    } else {
      console.log("----------------------------------------");
      console.log(`Usted esta viendo el contenido de: `);
      console.log(`Nombre del archivo: "${fileFound.name}"`);
      console.log(`En la ruta: "${fileFound.metadata.path}"`);
      console.log("----------------------------------------");
      console.log("");
      console.log(fileFound.content);
      console.log("");
      console.log("----------------------------------------");
      return;
    }
  }
};

const showMetadata = (argvs) => {
  const [_, name] = argvs;
  if (!name) return console.log("Ingrese el nombre del archivo que quiere ver");
  const fileExist = existElement(name, "file");

  if (!fileExist) {
    console.log(`El archivo con nombre "${name}" no existe`);
  } else {
    const fileFound = finder([_, name, "file"]);
    if (!fileFound) {
      console.log(`El archivo con nombre "${name}" no existe`);
    } else {
      console.log("----------------------------------------");
      console.log(`Usted esta viendo la metadata de: `);
      console.log(`Nombre del archivo: "${fileFound.name}"`);
      console.log(`En la ruta: "${fileFound.metadata.path}"`);
      console.log("----------------------------------------");
      console.log("");
      console.log(fileFound.metadata);
      console.log("");
      console.log("----------------------------------------");
      return;
    }
  }
};

const backUpData = () => {
  const contentFilesAndFolders = mainFolder.composite;
  const contentUsers = allUsers.composite;

  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };
  const filesStringified = JSON.stringify(
    contentFilesAndFolders,
    getCircularReplacer()
  );
  const usersStringified = JSON.stringify(contentUsers, getCircularReplacer());

  fs.writeFile("data.json", filesStringified, (e) => {
    if (e) {
      return console.log(`Error: ${e}`);
    }
  });

  fs.writeFile("users.json", usersStringified, (e) => {
    if (e) {
      return console.log(`Error: ${e}`);
    }
  });

  console.log("Datos guardados en data.json y users.json");
};

const persistData = (argvs) => {
  const [_, fileName, type] = argvs;

  if (!fileName)
    return console.log(
      "Por favor ingrese el nombre del archivo de donde quiere tomar los datos perstidos. Por ejemplo 'data.json' seguido del tipo de dato. Puede cargar users y data."
    );
  if (!type)
    return console.log(
      "Por favor ingrese el tipo de dato que quiere cargar. Puede cargar users y data. Por ejemplo: '-persist data.json data' o '-persist users.json users' "
    );

  if (type !== "data" && type !== "users")
    return console.log(
      `Tipo de dato no valido. Los datos validos son 'data' y 'users'`
    );

  if (type == "data") {
    fs.readFile(fileName, "utf-8", (error, data) => {
      if (!error) {
        console.log("Data cargada con exito!");
        return currentFolder.setData(JSON.parse(data));
      } else {
         console.log(`Error: ${error}`);
         return
      }
    });
  }

  if (type == "users") {
    fs.readFile(fileName, "utf-8", (error, data) => {
      if (!error) {
        console.log("Usuarios cargados con exito!");
        allUsers.composite = JSON.parse(data);
        return;
      } else {
         console.log(`Error: ${error}`);
         return
      }
    });
  }
  return;
};

const menuOptions = (argvs) => {
  const [_, menuType] = argvs;

  switch (menuType) {
    case "files":
      menuArchivos()
      break;
    case "users":
      menuUsers()
      break;
    case "data":
      menuPersist()
      break;
    default:
      console.log("Tipo de menu no valido. Puede ver menu de 'files', 'users' o 'data'.")
      break;
  }

}

const menuArchivos = () => {
  console.log("---------- MENU DE COMANDOS DE ARCHIVOS ----------");
  console.log("Crear un archivo con un contenido");
  console.log("COMANDO >>> create_file + 'nombre' + 'contenido' ");
  console.log("--------------------------------------------------");
  console.log("Ver el contenido de un archivo");
  console.log("COMANDO >>> show + 'nombre' ");
  console.log("--------------------------------------------------");
  console.log("Ver la metadata de un archivo");
  console.log("COMANDO >>> metadata + 'nombre' ");
  console.log("--------------------------------------------------");
  console.log("Crear una carpeta");
  console.log("COMANDO >>> create_folder + 'nombre' ");
  console.log("--------------------------------------------------");
  console.log("Entrar a una carpeta");
  console.log("COMANDO >>> cd + 'nombre de la carpeta' ");
  console.log("--------------------------------------------------");
  console.log("Volver una carpeta para atrás:");
  console.log("COMANDO >>> cd .. ");
  console.log("--------------------------------------------------");
  console.log("Eliminar archivo o carpeta");
  console.log("COMANDO >>> destroy 'nombre del archivo o carpeta a eliminar' ");
  console.log("--------------------------------------------------");
  console.log("Ver contenido de la carpeta actual");
  console.log("COMANDO >>> ls");
  console.log("--------------------------------------------------");
  console.log("Obtener la ruta de la carpeta actual");
  console.log("COMANDO >>> whereami"); 
  console.log("--------------------------------------------------");

};

const menuUsers = () => {
  console.log("---------- MENU DE COMANDOS DE USUARIOS ----------");
  console.log("Crear un usuario nuevo como superusuario");
  console.log("Puede utilizar los roles 'read_only', 'regular' o 'super'")
  console.log("COMANDO >>> create_user username password -role=ready_only");
  console.log("--------------------------------------------------");
  console.log("Actualizar contraseña del usuario actual")
  console.log("COMANDO >>> update_password + new_password");
  console.log("--------------------------------------------------");
  console.log("Remover usuarios como superusuario")
  console.log("COMANDO >>> destroy_user + username");
  console.log("--------------------------------------------------");
  console.log("Loguearte como usuario")
  console.log("COMANDO >>> login + username + password");
  console.log("--------------------------------------------------");
  console.log("Obtener nombre del usuario actual")
  console.log("COMANDO >>> whoami");
  console.log("--------------------------------------------------");
}

const menuPersist = () => {
  console.log("---------- MENU DE PERSISTENCIA DE DATOS ----------");
  console.log("Para cargar datos ya existentes desde un archivo:");
  console.log("Como tercer parametro indique si quiere cargar 'data' o 'users' segun corresponda");
  console.log("COMANDO >>> -persisted + 'file' + type")
  console.log("---------------------------------------------------");
  console.log("Hacer backup de los datos");
  console.log("Se realizara backup de los datos y los usuarios en los archivos 'data.json' y 'users.json'" )
  console.log("COMANDO >>> backup")
}

module.exports = {
  createFile,
  createFolder,
  selectFolder,
  showFile,
  listContent,
  showCurrentPath,
  showMetadata,
  deleteElement,
  getCurrentUser,
  createUser,
  login,
  deleteUser,
  updatePassword,
  logout,
  persistData,
  backUpData,
  menuOptions
};
