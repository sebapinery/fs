const Folder = require("./models/folder");
const File = require("./models/file");
const { User, user_roles } = require("./models/user");
const Group = require("./models/userGroup");

const superAdmin = new User("admin", "admin", { roleId: 3 });
const ghestUser = new User("ghest", "1234", { roleId: 1 });
const normalUser = new User("normal", "1234", { roleId: 2 });

const allUsers = new Group("allUsers", [superAdmin, ghestUser, normalUser]);
var currentUser = ghestUser;


const initialPath = "~/";
const initialMetaData = {
  path: initialPath,
};

var mainFolder = new Folder("root", [], initialMetaData);
var currentFolder = mainFolder;
var parentFolder;
var currentPath = currentFolder.showPath();

const getAllUsers = () => {
  const usersFound = allUsers.showComposite();
  console.log(usersFound);
};

const getCurrentUser = () => {
  return console.log(currentUser.print());
};

const checkMyRole = () => {
  const roleId = currentUser.showRoleId();
  return roleId;
};

const userExists = (userName) => {
  const userFound = allUsers
    .showComposite()
    .filter((user) => user.showName() === userName)[0];
  if (!userFound) {
    return false;
  } else {
    return userFound;
  }
};

const createUser = (argvs) => {
  const [_, username, password, roleFlag] = argvs;

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
    console.log(`Roles validos son: 'admin', 'normal' y 'read_only'`);
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

  const validPassword = userFound.comparePassword(password);
  if (!validPassword) {
    return console.log(`La contraseña ingresada no es valida`);
  } else {
    console.log("Login correcto!");
    currentUser = userFound;
  }
};

/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////

const existElement = (name, type) => {
  let existFile;
  if (!type) {
    existFile = currentFolder
      .showComposite()
      // .filter((content) => content.showType() === type)
      .filter((content) => content.showName() === name)[0];
  } else {
    existFile = currentFolder
      .showComposite()
      .filter((content) => content.showType() === type)
      .filter((content) => content.showName() === name)[0];
  }
  if (!existFile) {
    return false;
  } else {
    return true;
  }
};

const isUnique = (name) => {
  const qtyOfFilesSameName = currentFolder
    .showComposite()
    .filter((content) => content.showName() === name);

  if (qtyOfFilesSameName.length > 1) {
    return false;
  } else if (qtyOfFilesSameName.length === 0) {
    return false;
  } else {
    return true;
  }
};

const finder = (argvs) => {
  const [_, name, type] = argvs;

  const exist = existElement(name, type);
  const unique = isUnique(name);
  // console.log(unique)
  if (!exist) return false;
  if (!unique && !type)
    return console.log(
      `El nombre "${name}" pertenecea a un archivo y a una carpeta. Utilice como tercer argumento el tipo de archivo que quiere ver `
    );

  let elementFound;
  if (!type) {
    elementFound = currentFolder
      .showComposite()
      // .filter((content) => content.showType() === type)
      .filter((content) => content.showName() === name)[0];
  } else {
    elementFound = currentFolder
      .showComposite()
      .filter((content) => content.showType() === type)
      .filter((content) => content.showName() === name)[0];
  }
  if (!elementFound) {
    return false;
  } else {
    // console.log("////////// DEV /////////")
    // console.log(elementFound.print())
    return elementFound;
  }
};

const indexFinder = (element) => {
  const folderContent = currentFolder.showComposite();

  const index = folderContent.indexOf(element);
  if (index === -1) return false;
  return index;
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
      `Eliminado el elemento: "${elementFound.showName()}" de tipo "${elementFound.showType()}"`
    );
    currentFolder.removeInComposite(indexOfElement);
    return true;
  } else {
    elementFound = finder(argvs);
    indexOfElement = indexFinder(elementFound);
    console.log(
      `Eliminado el elemento: "${elementFound.showName()}" de tipo "${elementFound.showType()}"`
    );
    currentFolder.removeInComposite(indexOfElement);
    return true;
  }
};

// COMMAND $cat //// debe ser $create_file
const createFile = (argvs) => {
  const name = argvs[1];
  const content = argvs.slice(2).join(" ");
  const metadata = {
    path: currentPath,
  };
  const nameUsed = existElement(name, "file");
  if (nameUsed) {
    return console.log(`El nombre "${name}" ya esta en uso, seleccione otro.`);
  } else {
    if (checkMyRole() < 2)
      return console.log(
        `No tiene los permisos necesarios para realizar esta accion.`
      );

    const newFileCreated = new File(name, metadata, content);
    currentFolder.addToComposite(newFileCreated);

    console.log("                                           ");
    console.log("-------------------------------------------");
    console.log("------------ Archivo creado ---------------");
    console.log("-------------------------------------------");
    console.log("                                           ");
    console.log(`Nombre del nuevo archivo: "${newFileCreated.showName()}"`);
    console.log(`Crado en la ruta: ${currentPath}`);
    console.log(`El contenido del nuevo archivo es:`);
    console.log("");
    console.log(newFileCreated.showContent());
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
    currentFolder.addToComposite(newFolder);
    console.log("-------------------------------------------");
    console.log("------------ Carpeta creada ---------------");
    console.log("-------------------------------------------");
    console.log("                                           ");
    console.log("                                           ");
    console.log(`Nombre de la nueva carpeta: "${newFolder.showName()}"`);
    console.log(`Creado en la ruta: ${currentPath}`);
    console.log("                                           ");
    console.log("                                           ");

    return true;
  }
};

// COMMAND $cd + nameFolderDestination
const selectFolder = (argvs) => {
  const [_, name] = argvs;
  if (argvs.length === 1) {
    currentFolder = mainFolder;
    currentPath = currentFolder.showPath();
    console.log("-------------------------------------------");
    console.log(`Usted esta ahora la ruta >>> ${currentPath}`);
    console.log("-------------------------------------------");
    return;
  } else {
    const folderFound = finder([_, name, "folder"]);

    if (folderFound.length === 0) {
      console.log(`La carpeta con nombre "${name}" no existe`);
      return;
    } else {
      if (folderFound.showType() !== "folder") {
        console.log(`La carpeta con nombre "${name}" no existe`);
        return;
      }

      parentFolder = currentFolder;
      currentFolder = folderFound;

      if (currentPath === "~/") {
        currentPath = `${currentPath + currentFolder.showName()}`;
      } else {
        currentPath = `${currentPath + "/" + currentFolder.showName()}`;
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
    currentPath = currentFolder.showPath();
    console.log("-------------------------------------------");
    console.log(`Usted esta ahora la ruta >>> ${currentPath}`);
    console.log("-------------------------------------------");
  } else if (parentFolder === undefined) {
    currentFolder = mainFolder;
    currentPath = currentFolder.showPath();
    console.log("-------------------------------------------");
    console.log(`Usted esta ahora la ruta >>> ${currentPath}`);
    console.log("-------------------------------------------");
  } else {
    currentPath = currentFolder.showPath();
    currentFolder = parentFolder;
    parentFolder = undefined;
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
  const content = currentFolder.showComposite();
  if (content.length === 0) return console.log("El directorio esta vacio");
  console.log(
    `Mostrando el contenido de la carpeta "${currentFolder.showName()}"`
  );
  content.forEach((element) => {
    console.log("----------------------------------------");
    console.log(`Nombre: ${element.showName()}`);
    console.log(`Ruta: ${element.showPath()}`);
    console.log(`Tipo: ${element.showType()}`);
    console.log(`Fecha de creacion: ${element.showDataCreated()}`);
    console.log("----------------------------------------");
    return;
  });
};

// COMMAND $show + name
const showFile = (argvs) => {
  const [_, name] = argvs;
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
      console.log(`Nombre del archivo: "${fileFound.showName()}"`);
      console.log(`En la ruta: "${fileFound.showPath()}"`);
      console.log("----------------------------------------");
      console.log("");
      console.log(fileFound.showContent());
      console.log("");
      console.log("----------------------------------------");
      return;
    }
  }
};

// COMMAND $metadata + name
const showMetadata = (argvs) => {
  const [_, name] = argvs;
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
      console.log(`Nombre del archivo: "${fileFound.showName()}"`);
      console.log(`En la ruta: "${fileFound.showPath()}"`);
      console.log("----------------------------------------");
      console.log("");
      console.log(fileFound.showMetadata());
      console.log("");
      console.log("----------------------------------------");
      return;
    }
  }
};

module.exports = {
  createFile,
  createFolder,
  selectFolder,
  // mainFolder,
  // currentFolder,
  // parentFolder,
  // currentPath,
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
  // user_roles,
  getAllUsers,
  getCurrentUser,
  checkMyRole,
  createUser,
  login,
};
