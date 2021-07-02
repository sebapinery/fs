// #!/usr/bin/env node

var File = require("./models/file");
var Folder = require("./models/folder");

// CONTROLLERS
const controller = require("./controllers");

var readline = require("readline");
rl = readline.createInterface(process.stdin, process.stdout);
prefix = `FileSystem> `;

rl.on("line", function (line) {
  const argvs = line.split(" ");
  const command = argvs[0].trim();
  switch (command) {
    case "cd..": //
      controller.moveToParentFolder();
      break;
    case "cd": //
      controller.selectFolder(argvs);
      break;
    case "cat": // create_file
      controller.createFile(argvs);
      break;
    case "mk": // create_folder
      controller.createFolder(argvs);
      break;
    case "ls":
      controller.listContent();
      break;
    case "sf": /////////////// dev ///////////////
      controller.showCurrentFolder();
      break;
    case "path": // whereami
      controller.showCurrentPath();
      break;
    case "show": //
      controller.showFile(argvs);
      break;
    // case "file": /////////////// dev ///////////////
    //   console.log(JSON.stringify(mainFolder));
    //   break;
    case "env": //
      controller.showEnvPath();
      break;
    case "pf": //
      controller.showParentFolder();
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
