class File {
  constructor(name, metadata) {
    this.name = name;
    this.metadata = {
        type: "file",
        path: metadata.path,
        createdAt: `${new Date().toLocaleDateString(
          "es-AR"
        )} ${new Date().toLocaleTimeString("es-AR")}`,
      };
  }

  showType(){
    return this.metadata.type;
  }

  showName() {
    return this.name;
  }
  showMetadata() {
    return this.metadata;
  }
  showPath(){
      return this.metadata.path;
  }

  print() {
    console.log(this);
  }
}

module.exports = File;
