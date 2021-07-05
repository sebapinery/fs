const Folder = require("./models/folder");
const File = require("./models/file");
const { User, user_roles } = require("./models/user");
const Group = require("./models/userGroup");

const { hash, comparePassword } = require("./security");

const fs = require("fs");
const path = require("path");

const superAdmin = new User("admin", "admin", { roleId: 3 });
const ghestUser = new User("ghest", "1234", { roleId: 1 });
const normalUser = new User("normal", "1234", { roleId: 2 });

const allUsers = new Group("allUsers", [superAdmin, ghestUser, normalUser]);
var currentUser = superAdmin;

const initialPath = "~/";
const initialMetaData = {
  path: initialPath,
};

var mainFolder = new Folder("root", [], initialMetaData);
var currentFolder = mainFolder;
var parentFolder;
var currentPath = currentFolder.metadata.path;

const getAllUsers = () => {
  const usersFound = allUsers.composite;
  // /////////////////////////////////////////////////////
  // /////////////////////////////////////////////////////
  usersFound.forEach(u => console.log("hola",u))
  // console.log(usersFound);

};

const getCurrentUser = () => {
  return console.log(currentUser);
};

const checkMyRole = () => {
  const roleId = currentUser.metadata.roleId;
  return roleId;
};

const userExists = (userName) => {
  const userFound = allUsers
    .composite
    .filter((user) => user.name === userName)[0];
  if (!userFound) {
    return false;
  } else {
    return userFound;
  }
};

const createUser = (argvs) => {
  const [_, username, password, roleFlag] = argvs;
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
    console.log(`El rol seleccionado no es existe.`);
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
    allUsers.addToComposite(newUser);
    console.log(`Se ha creado un nuevo usuaario`);
    console.log(newUser);
  }
};

const login = (argvs) => {
  const [_, username, password] = argvs;

  const userFound = userExists(username);
  if (!userFound) return console.log(`El nombre ${username} no existe`);

  // const validPassword = userFound.comparePassword(password);
  const validPassword = comparePassword(userFound.password, password)
  if (!validPassword) {
    return console.log(`La contraseña ingresada no es valida`);
  } else {
    console.log("Login correcto!");
    currentUser = userFound;
  }
};

const deleteUser = (argvs) => {
  const [_, username] = argvs;

  if (checkMyRole() < 2)
    return console.log(`No posee los permisos para realizar esta accion`);

  const existUser = userExists(username);
  if (!existUser) return console.log(`El nombre ${username} no existe`);

  const userIndex = indexFinder(existUser, "users");

  console.log(`Eliminado el usuario: "${username}"`);
  allUsers.removeInComposite(userIndex);
  return true;
};

const updatePassword = (argvs) => {
  const [_, newPassword] = argvs;

  if (checkMyRole() < 2)
    return console.log(`No tiene permisos para realizar esta accion`);

  // const updateSuccess = currentUser.editPassword(newPassword);
  const encryptedNewPassword = hash(newPassword);
  currentUser.password = encryptedNewPassword;
  // if (!updateSuccess)
  //   return console.log(
  //     `Ocurrio un error actualizando la contraseña, por favor intente nuevamente`
  //   );


  console.log("Contraseña actualziada con exito");
};

const logout = () => {
  console.log("Usted se ha deslogueado con exito.");
  currentUser = ghestUser;
};

const existElement = (name, type) => {
  let existFile;
  if (!type) {
    existFile = currentFolder
      .composite
      .filter((content) => content.name === name)[0];
  } else {
    existFile = currentFolder
      .composite
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
  const qtyOfFilesSameName = currentFolder
    .composite
    .filter((content) => content.name === name);

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
      elementFound = currentFolder
      .composite
      .filter((content) => content.name === name)[0];
    } else {
    elementFound = currentFolder
      .composite
      .filter((content) => content.metadata.type === type)
      .filter((content) => content.name === name)[0];
    }
  if (!elementFound) {
    return false;
  } else {
    return elementFound;
  }
};

const indexFinder = (element, where) => {
  const folderContent = currentFolder.composite;

  if (!where) {
    const index = folderContent.indexOf(element);
    if (index === -1) return false;
    return index;
  }
  if (where === "users") {
    const index = allUsers.composite.indexOf(element);
    if (index === -1) return false;
    return index;
  }
  return false;
};

const deleteElement = (argvs) => {
  const [_, name, type] = argvs;

  if (checkMyRole() < 2)
    return console.log(
      `No tiene los permisos necesarios para realizar esta accion.`
    );

  if (argvs.length === 1)
    return console.log("Ingrese un nombre luego de destroy");
  let elementFound = finder(argvs);
  if (!elementFound)
    return console.log(`El archivo con nombre "${name}" no existe`);
  if (!isUnique(name) && !type)
    return console.log(
      `Esta intentando borrar un elemento con el nombre "${name} que pertenece a un archivo y a una carpeta. Indique como tercer paramentro el tipo de elemento que quiere eliminar."`
    );
  if (!type) {
    let indexOfElement = indexFinder(elementFound);
    console.log(
      `Eliminado el elemento: "${elementFound.name}" de tipo "${elementFound.metadata.type}"`
    );
    currentFolder.removeInComposite(indexOfElement);
    return true;
  } else {
    elementFound = finder(argvs);
    indexOfElement = indexFinder(elementFound);
    console.log(
      `Eliminado el elemento: "${elementFound.name}" de tipo "${elementFound.metadata.type}"`
    );
    currentFolder.removeInComposite(indexOfElement);
    return true;
  }
};

// COMMAND $cat //// debe ser $create_file
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
    addToComposite(newFileCreated);

    console.log("                                           ");
    console.log("-------------------------------------------");
    console.log("------------ Archivo creado ---------------");
    console.log("-------------------------------------------");
    console.log("                                           ");
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

// COMMAND $mk + newFolderName
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
    addToComposite(newFolder);
    console.log("-------------------------------------------");
    console.log("------------ Carpeta creada ---------------");
    console.log("-------------------------------------------");
    console.log("                                           ");
    console.log("                                           ");
    console.log(`Nombre de la nueva carpeta: "${newFolder.name}"`);
    console.log(`Creado en la ruta: ${currentPath}`);
    console.log("                                           ");
    console.log("                                           ");

    return true;
  }
};

const addToComposite = (element) => {
  currentFolder.composite.push(element);
}

// COMMAND $cd + nameFolderDestination
const selectFolder = (argvs) => {
  const [_, name] = argvs;
  if (argvs.length === 1) {
    currentFolder = mainFolder;
    currentPath = currentFolder.metadata.path;
    console.log("-------------------------------------------");
    console.log(`Usted esta ahora la ruta >>> ${currentPath}`);
    console.log("-------------------------------------------");
    return;
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

// COMMAND $cd..
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

// COMMAND $sf
const showCurrentFolder = () => {
  console.log(">>>>> MOSTRANDO EL CURRENT FOLDER");
  console.log("                                 ");
  console.log(currentFolder);
  console.log("                                 ");
};

// COMMAND $path
const showCurrentPath = () => {
  // console.log("                                 ");
  // console.log(">>>>> SHOWING CURRENT PATH");
  console.log("                                 ");
  console.log(currentPath);
  console.log("                                 ");
  // return currentPath;
};

// COMMAND $pf
const showParentFolder = () => {
  console.log("                                 ");
  console.log(">>>>> PARENT FOLDER IS: ");
  console.log("                                 ");
  console.log(parentFolder);
  console.log("                                 ");
};

// COMMAND $ls
const listContent = () => {
  const content = currentFolder.composite;
  if (content.length === 0) return console.log("El directorio esta vacio");
  console.log(
    `Mostrando el contenido de la carpeta "${currentFolder.name}"`
  );
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

// COMMAND $show + name
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

// COMMAND $metadata + name
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

const persistData = (argv) => {
  const content = mainFolder.composite;

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
  const stringy = JSON.stringify(content, getCircularReplacer());

  fs.writeFile("data.json", stringy, (e) => {
    if (e) {
      return console.log(`Error: ${e}`);
    }
  });

  console.log(JSON.parse(stringy));
};

const load = () => {
  fs.readFile("data.json", "utf-8", (error, data) => {
    if (!error) {
      mainFolder.setData(JSON.parse(data))
      console.log(JSON.parse(data));
      return;
    }
  });
  return;
};

module.exports = {
  createFile,
  createFolder,
  selectFolder,
  showFile,
  showCurrentFolder,
  listContent,
  showCurrentPath,
  moveToParentFolder,
  showParentFolder,
  showMetadata,
  finder,
  deleteElement,
  ////////////////////////
  //////// USERS /////////
  ////////////////////////
  getAllUsers,
  getCurrentUser,
  checkMyRole,
  createUser,
  login,
  deleteUser,
  updatePassword,
  logout,
  ////////////////////////
  //////// DATA /////////
  ////////////////////////
  persistData,
  load,
};