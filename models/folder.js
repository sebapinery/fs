class Folder {
  constructor(name, composite = [], metadata) {
    this.name = name;
    this.metadata = {
      type: "folder",
      path: metadata.path,
      createdAt: `${new Date().toLocaleDateString(
        "es-AR"
      )} ${new Date().toLocaleTimeString("es-AR")}`,
    };
    this.composite = composite;
  }

  showPath() {
    return this.metadata.path;
  }

  showName() {
    return this.name;
  }

  showComposite() {
    // console.log("SHOW COMPOSITE ");
    return this.composite;
  }

  addToComposite(element) {
    return this.composite.push(element);
    // return this.composite;
  }

  print() {
    return this;
  }
}

module.exports = Folder;
