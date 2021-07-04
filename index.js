#!/usr/bin/env node

// CONTROLLER
const controller = require("./controllers");

const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);
const prefix = `FileSystem> `;

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
    case "path": // whereami
      controller.showCurrentPath();
      break;
    case "show": // show + name
      controller.showFile(argvs);
      break;
    case "metadata": // metadata + name
      controller.showMetadata(argvs);
      break;
    case "rm": // destroy name -type?
      controller.deleteElement(argvs);
      break;
    case "cu": // TIENE QUE SER $whoami
      controller.getCurrentUser();
      break;
    case "create": // $create_user
      controller.createUser(argvs);
      break;
    case "exit":
      console.clear();
      console.log("Gracias que tengas un buen dia!");
      console.log("");
      console.log("");
      console.log("");
      process.exit(0);
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    case "sf": /////////////// dev ///////////////
      controller.showCurrentFolder();
      break;
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    case "find": //
      console.log(controller.finder(argvs));
      break;
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    case "pf": //
      controller.showParentFolder();
      break;
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    case "users": //
      controller.getAllUsers();
      break;
    case "login": //
      controller.login(argvs);
      break;
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    case "role": //
      controller.checkMyRole();
      break;
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    //////////////////////////////////////////////
    default:
      console.log("COMANDO NO VALIDO: ", argvs);
      break;
  }
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
}).on("close", function () {
  console.clear();
  console.log("Gracias que tengas un buen dia!");
  console.log("");
  console.log("");
  console.log("");
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
