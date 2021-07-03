var Folder = require("./models/folder");
var File = require("./models/file");

const initialPath = "~/";
const initialMetaData = {
  path: initialPath,
};

var mainFolder = new Folder("root", [], initialMetaData);
var currentFolder = mainFolder;
var parentFolder;
var currentPath = currentFolder.showPath();

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
    console.log(
      "<<<<<<<<<<<<<<<<<<<<<<< Nombre duplicado >>>>>>>>>>>>>>>>>>>>>>>>>>>"
    );
    return false;
  } else if (qtyOfFilesSameName.length === 0) {
    // console.log(`El archivo con nombre "${name}" no existe`)
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
  if (!exist) return console.log(`No existe elemento con el nombre "${name}"`);
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

// const indexFinder = (name) => {
//   // const name = argvs[1];

//   const fileFound = finder(name);
//   if (!fileFound) {
//     console.log("El archivo no existe");
//   } else {
//     const folderContent = currentFolder.showComposite();
//     const index = folderContent.indexOf(fileFound);
//     console.log(index);
//     return index;
//   }
// };
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// COMMAND $cat //// debe ser $create_file
const createFile = (argvs) => {
  const name = argvs[1];
  const content = argvs.slice(2).join(" ");
  const metadata = {
    path: currentPath,
  };
  const fileExist = existElement(name, "file");
  if (fileExist) {
    return console.log(`El nombre "${name}" ya esta en uso, seleccione otro.`);
  } else {
    const newFileCreated = new File(name, metadata, content);
    console.log(">>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<");
    console.log(">>>>>>>>>>>>>>>File created:<<<<<<<<<<<<<<<");
    console.log(">>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<");
    console.log("                                           ");
    console.log("                                           ");
    console.log(`Name: ${newFileCreated.showName()}`);
    console.log(`En la ruta (curentPath): ${currentPath}`);
    console.log(`En la ruta (en constructor): ${newFileCreated.showPath()}`);
    console.log("                                           ");
    console.log("                                           ");
    return currentFolder.addToComposite(newFileCreated);
  }
};

// COMMAND $mk + newFolderName
const createFolder = (argvs) => {
  const name = argvs[1];
  const metadata = {
    path: currentPath,
  };

  const folderExist = existElement(name, "folder");
  if (folderExist) {
    return console.log(`El nombre "${name}" ya esta en uso, seleccione otro.`);
  } else {
    const newFolder = new Folder(name, [], metadata);
    console.log(">>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<");
    console.log(">>>>>>>>>>>>>>Folder created:<<<<<<<<<<<<<<");
    console.log(">>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<");
    console.log("                                           ");
    console.log("                                           ");
    console.log(`Name: ${newFolder.showName()}`);
    console.log(`En la ruta (curentPath): ${currentPath}`);
    console.log(`En la ruta (en constructor): ${newFolder.showPath()}`);
    console.log("                                           ");
    console.log("                                           ");

    return currentFolder.addToComposite(newFolder);
  }
};

// COMMAND $cd + nameFolderDestination
const selectFolder = (argvs) => {
  const name = argvs[1];
  if (argvs.length === 1) {
    currentFolder = mainFolder;
  } else {
    const folderDestination = name;
    const listOfcomposite = currentFolder.showComposite();

    const folderFound = listOfcomposite.filter(
      (e) => e.name == folderDestination
    );

    if (folderFound.length === 0) {
      console.log(`La carpeta con nombre "${name}" no existe`);
    } else {
      parentFolder = currentFolder;
      currentFolder = folderFound[0];

      if (currentPath === "~/") {
        currentPath = `${currentPath + currentFolder.showName()}`;
      } else {
        currentPath = `${currentPath + "/" + currentFolder.showName()}`;
      }
      console.log(`Usted esta la ruta >>> ${currentPath}`);
    }
  }
};

// COMMAND $cd..
const moveToParentFolder = () => {
  if (currentFolder === mainFolder) {
    currentPath = currentFolder.showPath();
    console.log(" Usted esta posicionado a la ruta >>>", currentPath);
  } else if (parentFolder === undefined) {
    currentFolder = mainFolder;
    currentPath = currentFolder.showPath();
    console.log(" Usted esta posicionado a la ruta >>>", currentPath);
  } else {
    currentPath = currentFolder.showPath();
    currentFolder = parentFolder;
    parentFolder = undefined;
    console.log(" Usted esta posicionado a la ruta >>>", currentPath);
  }
};

const deleteElement = (argvs) => {
  const [_, name, type] = argvs;

  if (argvs.length === 1)
    return console.log("Ingrese un nombre luego de destroy");
  if (!isUnique(name))
    return console.log(
      `Esta intentando borrar un elemento con el nombre "${name} que pertenece a un archivo y a una carpeta. Indique como tercer paramentro el tipo de elemento que quiere eliminar."`
    );

    
  const find = existElement(name);
  console.log(!find ? "no se encontro" : find);
  if (argvs.length === 2) {
    console.log(" entra al if - igual a 2");
  } else {
    console.log(" entra al else - diferente a 2");
  }
};

// COMMAND $sf
const showCurrentFolder = () => {
  console.log(">>>>> MOSTRANDO EL CURRENT FOLDER");
  console.log("                                 ");
  console.log("                                 ");
  console.log(currentFolder);
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
};

// COMMAND $path
const showCurrentPath = () => {
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log(">>>>> SHOWING CURRENT PATH");
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log(currentPath);
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
};

// COMMAND $pf
const showParentFolder = () => {
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log(">>>>> SHOWING PARENT FOLDER");
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log(parentFolder);
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
};

// COMMAND $ls
const listContent = () => {
  const content = currentFolder.showComposite();
  if (content.length === 0) return console.log("El directorio esta vacio");
  content.forEach((element) => {
    console.log("");
    console.log(`Nombre: ${element.showName()}`);
    console.log(`Ruta: ${element.showPath()}`);
    console.log(`Tipo: ${element.showType()}`);
    console.log(`Fecha de creacion: ${element.showDataCreated()}`);
    console.log("");
    console.log("----------------------------------------");
  });
};

// COMMAND $env
const showEnvPath = () => {
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log(">>>>> SHOWING PATH IN ENV VARIABLE");
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log(process.env.path);
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
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
      console.log("");
      return console.log(fileFound.showContent());
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
      console.log("");
      return console.log(fileFound.showMetadata());
    }
  }
};

module.exports = {
  // showPath,
  // indexFinder,
  createFile,
  createFolder,
  selectFolder,
  mainFolder,
  currentFolder,
  parentFolder,
  currentPath,
  showFile,
  showCurrentFolder,
  listContent,
  showCurrentPath,
  moveToParentFolder,
  showParentFolder,
  showEnvPath,
  showMetadata,
  finder,
  // isDuplicated,
  // deleteItem,
  deleteElement,
};
