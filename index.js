// #!/usr/bin/env node

var File = require("./models/file");
var Folder = require("./models/folder");

// CONTROLLERS
const controller = require("./controllers");

const initialPath =  "~/"
var mainFolder = new Folder("root", [], initialPath);
var currentFolder = mainFolder;
var parentFolder;
var currentPath = initialPath;

// COMANDO cd $foldername
const selectFolder = (argvs) => {
  if (argvs.length === 1) {
    currentFolder = mainFolder;
  } else {
    const folderDestination = argvs[1];
    const listOfcomposite = currentFolder.showComposite();

    const folderFound = listOfcomposite.filter(
      (e) => e.name == folderDestination
    );
    // currentPath = pathBuilder(currentPath, folderFound[0].showName());

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

// COMMAND $cd
const moveToParentFolder = () => {
  if (parentFolder === mainFolder) {
    parentFolder = undefined;
    console.log("Esta en el nivel superior");
  } else if (parentFolder) {
    currentFolder = parentFolder;
    currentPath = currentFolder.showPath();
  } else if (!parentFolder) {
    console.log("Esta en el nivel superior");
  }
};

// COMMAND $create_folder
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

// COMMAND $show
const showFile = (argvs) => {
  const positionInArray = argvs[1];
  const list = currentFolder.showComposite();
  const selectedFile = list[0];
  // console.log(selectedFile.constructor.name);

  // FILTRAR EL ARRAY DEL CURRENT FOLDER CON SOLAMENTE ARCHIVOS
  const arrayOfFiles = list.filter((file) => file.constructor.name === "File");
  console.log(
    "RESULTADO ARRAY FILTRADO DE CURRENT FOLDER >>>>>>>>>>>>>",
    arrayOfFiles
  );
};

var readline = require("readline");
const { argv } = require("process");
const { log } = require("console");
rl = readline.createInterface(process.stdin, process.stdout);
prefix = `FileSystem> `;

rl.on("line", function (line) {
  const argvs = line.split(" ");
  const command = argvs[0].trim();
  switch (command) {
    case "cd..": //
      moveToParentFolder();
      break;
    case "cd":
      selectFolder(argvs);
      break;
    case "cat": // create_file
      controller.createFile(argvs, currentPath, currentFolder);
      break;
    case "mk": // create_folder
      createFolder(argvs);
      break;
    case "ls":
      console.log(currentFolder.showComposite());
      break;
    case "sf": /////////////// dev ///////////////
      console.log(currentFolder.print());
      break;
    case "file": /////////////// dev ///////////////
      console.log(JSON.stringify(mainFolder));
      break;
    case "path": // whereami
      controller.showPath(currentPath);
      break;
    case "show": //
      showFile(argvs);
      break;
    case "exit": /////////////// dev ///////////////
      process.exit(0);
    default:
      /////////////// dev ///////////////
      console.log("COMANDO NO VALIDO: ", argvs);
      break;
  }
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
}).on("close", function () {
  console.log("Gracias que tengas un buen dia!");
  process.exit(0);
});
console.clear();
console.log("==========================================");
console.log("==========================================");
console.log("========                         =========");
console.log("========                         =========");
console.log("======== Bienvenido a FileSystem =========");
console.log("========                         =========");
console.log("========                         =========");
console.log("==========================================");
console.log("==========================================");
// console.log("Menu de opciones");
// console.log("--help", "Para la informacion completa de comandos");
rl.setPrompt(prefix, prefix.length);
rl.prompt();
