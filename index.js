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
    case "cd": //
      controller.selectFolder(argvs);
      break;
    case "create_file": // 
      controller.createFile(argvs);
      break;
    case "create_folder": //
      controller.createFolder(argvs);
      break;
    case "ls":
      controller.listContent();
      break;
    case "whereami": //
      controller.showCurrentPath();
      break;
    case "show": //
      controller.showFile(argvs);
      break;
    case "metadata": // 
      controller.showMetadata(argvs);
      break;
    case "destroy": //
      controller.deleteElement(argvs);
      break;
    case "whoami": // 
      controller.getCurrentUser();
      break;
    case "create_user": // 
      controller.createUser(argvs);
      break;
    case "destroy_user":
      controller.deleteUser(argvs);
      break;
    case "update_password": //
      controller.updatePassword(argvs);
      break;
    case "login": //
      controller.login(argvs);
      break;
    case "logout": //
      controller.logout();
      break;
    case "-persist": //
      controller.persistData(argvs);
      break;
    case "backup": //
      controller.backUpData();
      break;
    case "menu":
      controller.menuOptions(argvs);
      break;
    case "exit":
      console.clear();
      console.log("Gracias que tengas un buen dia!");
      console.log("");
      console.log("");
      console.log("");
      process.exit(0);
    default:
      console.log("");
      console.log("==========================================");
      console.log(`"${argvs}" NO ES UN COMANDO NO VALIDO`);
      console.log("==========================================");
      console.log("");
      console.log("Puede ver el menu de comandos ingresando:");
      console.log("COMANDO >>> menu + tipo de menu");
      console.log("");
      console.log("Tipos de menu: 'files', 'users' y 'data.'");
      console.log("");

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
console.log("");
console.log("Puede ver el menu de comandos ingresando:");
console.log("COMANDO >>> menu + tipo de menu");
console.log("");
console.log("Tipos de menu: 'files', 'users' y 'data.'");
console.log("");
console.log("");

rl.setPrompt(prefix, prefix.length);
rl.prompt();
