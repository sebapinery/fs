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
  showType() {
    return this.metadata.type;
  }

  showName() {
    return this.name;
  }

  showMetadata() {
    return this.metadata;
  }

  showPath() {
    return this.metadata.path;
  }

  showComposite() {
    // console.log("SHOW COMPOSITE ");
    return this.composite;
  }

  addToComposite(element) {
    this.composite.push(element);
    // return this.composite;
  }

  print() {
    return this;
  }
}

module.exports = Folder;
