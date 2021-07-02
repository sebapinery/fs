// #!/usr/bin/env node

var File = require("./models/file");
var Folder = require("./models/folder");

// CONTROLLERS
const controller = require("./controllers");

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

// COMMAND $show
// const showFile = (argvs) => {
//   const positionInArray = argvs[1];
//   const list = currentFolder.showComposite();
//   const selectedFile = list[0];
//   // console.log(selectedFile.constructor.name);

//   // FILTRAR EL ARRAY DEL CURRENT FOLDER CON SOLAMENTE ARCHIVOS
//   const arrayOfFiles = list.filter((file) => file.showType() === "file");
//   console.log(
//     "RESULTADO ARRAY FILTRADO DE CURRENT FOLDER >>>>>>>>>>>>>",
//     arrayOfFiles
//   );
// };

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
      controller.selectFolder(argvs);
      break;
    case "cat": // create_file
      controller.createFile(argvs);
      break;
    case "mk": // create_folder
      controller.createFolder(argvs);
      break;
    case "ls":
      console.log(controller.currentFolder.showComposite());
      break;
    case "sf": /////////////// dev ///////////////
      console.log(controller.currentFolder.print());
      break;
    // case "file": /////////////// dev ///////////////
    //   console.log(JSON.stringify(mainFolder));
    //   break;
    case "path": // whereami
      controller.showPath(controller.currentPath);
      break;
    case "show": //
      controller.showFile(argvs);
      break;
    case "test": //
    console.log(controller.currentFolder.showPath())
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
