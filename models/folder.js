class Folder {
  constructor(name, composite = [], metadata) {
    this.name = name;
    this.metadata = {
      type: "folder",
      path: metadata.path,
      parentFolder: metadata.parentFolder,
      createdAt: `${new Date().toLocaleDateString(
        "es-AR"
      )} - ${new Date().toLocaleTimeString("es-AR")}`,
    };
    this.composite = composite;
  }
  showComposite() {
    return this.composite;
  }

  removeInComposite(index) {
    return this.composite.splice(index, 1);
  }

  setData(data){
    this.composite = data;
    return this.composite;
  }

}

module.exports = Folder;
