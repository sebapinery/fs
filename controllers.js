var Folder = require("./models/folder");
var File = require("./models/file");

const initialPath = "~/";
const initialMetaData = {
  path: initialPath,
};

var mainFolder = new Folder("root", [], initialMetaData);
var currentFolder = mainFolder;
var parentFolder;
var currentPath = initialPath;

const showPath = (currentPath) => {
  console.log(currentPath);
};

// COMMAND $cat //// debe ser $create_file
const createFile = (argvs) => {
  const name = argvs[1];
  const content = argvs.slice(2).join(" ");
  const metadata = {
    path: currentPath,
  };

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
};

const createFolder = (argvs) => {
  const name = argvs[1];
  const metadata = {
    path: currentPath,
  };

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
};

const selectFolder = (argvs) => {
  if (argvs.length === 1) {
    currentFolder = mainFolder;
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
      // console.log(">>>>>>>>>>>>>> CUUURENT PATH EN SELECT FOLDER",currentPath)
      console.log(`Usted esta la ruta ${currentPath}`);
    }
  }
};

const moveToParentFolder = () => {
  console.log("SALE POR ACA");
  if (parentFolder === mainFolder) {
    currentFolder = parentFolder;
    parentFolder = undefined;
    currentPath = currentFolder.showPath();

    console.log("Esta en el nivel superior IGUAL A MAIN");
  } else if (parentFolder) {
    currentFolder = parentFolder;
    currentPath = currentFolder.showPath();
  } else if (!parentFolder) {
    console.log("Esta en el nivel superior NO HAY PARENT");
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
  console.log(">>>>> SHOWING PARENT PATH");
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
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log(">>>>> SHOWING COMPOSITE OF CURRENT FOLDER");
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log(currentFolder.showComposite());
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
  console.log("                                 ");
};

// COMMAND $ls
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

// COMMAND $show
const showFile = (argvs) => {
  const positionInArray = argvs[1];
  const list = currentFolder.showComposite();
  const selectedFile = list[0];
  // console.log(selectedFile.constructor.name);

  // FILTRAR EL ARRAY DEL CURRENT FOLDER CON SOLAMENTE ARCHIVOS
  const arrayOfFiles = list.filter((file) => file.showType() === "file");
  console.log("RESULTADO ARRAY FILTRADO DE CURRENT FOLDER >>>>>>>>>>>>>");
  console.log(arrayOfFiles);
};

module.exports = {
  showPath,
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
};
