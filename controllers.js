var File = require("./models/file");

const showPath = (currentPath) => {
    console.log(currentPath);
  };

  // COMMAND $create_file
const createFile = (argvs, currentPath, currentFolder) => {
    const name = argvs[1];
    const metadata = {
      path: currentPath,
    };
  
    console.log(argvs[2]);
  
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

  module.exports = { showPath, createFile }