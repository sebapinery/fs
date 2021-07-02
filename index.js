// #!/usr/bin/env node

var File = require("./models/file");
var Folder = require("./models/folder");

var mainFolder = new Folder("root", [], "/");
var currentFolder = mainFolder;
var parentFolder;
var currentPath = currentFolder.showPath();

// const pathBuilder = (currentPath, newFolder) => {

//   console.log(">>>>>>>>>> ARGS DE PATH BUILDER <<<<<<<<<<<<<<<<",currentPath, newFolder)
//   console.log("                                           ");
//   console.log("                                           ");
//   console.log("                                           ");

//   if(!parentFolder){
//     console.log(">>>>>>>> MISMO PATH NO HAY PARENT <<<<<<<<<<<")
//     console.log("                                           ");
//     console.log("                                           ");
//     return currentPath;
//   }
//   // else if(parentFolder === mainFolder){
//   //   console.log(">>>>>>>> MISMO PARENT Y MAIN <<<<<<<<<<<")
//   //   console.log("                                           ");
//   //   console.log("                                           ");
//   //   return currentPath;
//   // }
//   else{
//     console.log(">>>>>>>> SALE POR EL ELSE <<<<<<<<<<<");
//     console.log("                                           ");
//     console.log("                                           ");
//     const newPath = currentPath + newFolder;
//     console.log(" NEW PATH >>>>>>>>>>> ",newPath);
//     console.log("                                           ");
//     console.log("                                           ");
//     currentPath = newPath;
//     return currentPath;
//   }
// }

const showPath = () => {
  console.log(currentPath)
}

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
      if(currentPath === "/"){
        currentPath = `${currentPath + currentFolder.showName()}`
      }else{
        currentPath = `${currentPath +"/"+ currentFolder.showName()}`

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

  const newFolder = new Folder(name, [], currentPath);
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
};

// COMMAND $create_file
const createFile = (argvs) => {
  const name = argvs[1];
  const metadata = {
    content: argvs[2],
  };

  const newFileCreated = new File(name, metadata);
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
  // console.log(newFileCreated.print())
  return currentFolder.addToComposite(newFileCreated);
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
    case "pf":
      console.log(
        "PARENT FOLDER >>> ",
        `${parentFolder ? parentFolder.showName() : "Estas en la ruta /"}`
      );
      break; 
    case "cd..":
      moveToParentFolder();
      break;
    case "cd":
      selectFolder(argvs);
      break;
    case "cat":
      createFile(argvs);
      break;
    case "mk":
      createFolder(argvs);
      break;
    // case "path":
    //   console.log(currentFolder.showName());
    //   break;
    case "ls":
      console.log(currentFolder.showComposite());
      break;
    case "sf":
      console.log(currentFolder.print())
      break;
    case "file":
      console.log(JSON.stringify(mainFolder));
      break;
    case "path":
      showPath();
      break;
    case "exit":
      process.exit(0);
    default:
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
