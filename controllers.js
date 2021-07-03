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

const fileFinder = (name) => {
  const fileFound = currentFolder
    .showComposite()
    .filter((content) => content.showName() === name)[0];
  return fileFound;
};

const exist = (name, type) => {
  let existFile;
  if(!type){
    existFile = currentFolder
      .showComposite()
      // .filter((content) => content.showType() === type)
      .filter((content) => content.showName() === name)[0];
    }else{
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

const isDuplicated = (name) => {

  const qtyOfFilesSameName = currentFolder
    .showComposite()
    .filter((content) => content.showName() === name);

  if (qtyOfFilesSameName.length > 1) {
    console.log("Nombre duplicado");
    return true;
  } else {
    return false;
  }
};

const indexFinder = (name) => {
  // const name = argvs[1];

  const fileFound = fileFinder(name);
  if (!fileFound) {
    console.log("El archivo no existe");
  } else {
    const folderContent = currentFolder.showComposite();
    const index = folderContent.indexOf(fileFound);
    console.log(index);
    return index;
  }
};
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// COMMAND $rm + name + type // DEBE SER $detroy

// const deleteItem = (argvs) => {
//   const name = argvs[1];
//   const type = argvs[2];

//   console.log("Name: ", name);
//   console.log("Type: ", type);

//   if (!type) {
//     const isDuplicatedResult = isDuplicated(name);
//     if (isDuplicatedResult) {
//       console.log("El nombre pertenece a una carpeta y a un archivo.");
//       console.log("");
//       console.log("Si indicar cual eliminar, indiquelo con '-file' o '-folder' luego del nombre")
//     }
//   } else {
//     const indexOfItem = indexFinder()
//   }
// };
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

// const showPath = (currentPath) => {
//   console.log(currentPath);
// };

// COMMAND $cat //// debe ser $create_file
const createFile = (argvs) => {
  const name = argvs[1];
  const content = argvs.slice(2).join(" ");
  const metadata = {
    path: currentPath,
  };
  const fileExist = exist(name);
  if (fileExist) {
    return console.log(
      ">>>> Esta intentando crar un archivo con un nombre ya en uso, seleccione otro. El archivo no fue creado"
    );
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

  const folderExist = exist(name, "folder");
  if (folderExist) {
    return console.log(
      " >>>> Esta intentando crar una carpeta con un nombre ya en uso, seleccione otro. La carpeta no fue creada"
    );
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
  if (argvs.length === 1) {
    currentFolder = mainFolder;
    // currentPath = currentFolder.showPath();
  } else {
    const folderDestination = argvs[1];
    const listOfcomposite = currentFolder.showComposite();

    const folderFound = listOfcomposite.filter(
      (e) => e.name == folderDestination
    );

    if (folderFound.length === 0) {
      console.log(" >>>>>>>>>>>>>>>> Folder not found <<<<<<<<<<<<<<<<");
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
  console.log("");
  console.log("");
  console.log("");
  console.log("USTED ESTA EN >>>>>", currentFolder.showPath());
  console.log(">>>>> SHOWING COMPOSITE OF CURRENT FOLDER");
  console.log("");
  console.log(currentFolder.showComposite());
  console.log("");
  console.log("");
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
  const name = argvs[1];
  const fileExist = exist(name);

  if (!fileExist) {
    console.log("El archivo no existe");
  } else {
    const fileFound = fileFinder(name);
    if(fileFound.showType() === "folder"){
      console.log(`El archivo no existe, existe una carpeta con el nombre "${name}"`);
    }else{
      // console.log("CONTENT DEL ARCHIVO", fileFound.showName())
      console.log("");
      console.log("");
      console.log(fileFound.showContent());
      console.log("");
      console.log("");
    }
  }
};

// COMMAND $metadata + name
const showMetadata = (argvs) => {
  const name = argvs[1];
  const fileExist = exist(name);
  if (!fileExist) {
    console.log("El archivo no existe");
  } else {
    const fileFound = fileFinder("file", name);
    // console.log("CONTENT DEL ARCHIVO", fileFound.showName())
    console.log("");
    console.log("");
    console.log(fileFound.showMetadata());
    console.log("");
    console.log("");
  }
};

module.exports = {
  // showPath,
  indexFinder,
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
  isDuplicated,
  deleteItem,
};
