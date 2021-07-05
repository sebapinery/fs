class File {
  constructor(name, metadata, content) {
    this.name = name;
    this.content = content;
    this.metadata = {
      type: "file",
      path: metadata.path,
      createdAt: `${new Date().toLocaleDateString(
        "es-AR"
      )} - ${new Date().toLocaleTimeString("es-AR")}`,
    };
  }

  // showDataCreated(){
  //   return this.metadata.createdAt;
  // }

  // showContent(){
  //   return this.content;
  // }

  // showType() {
  //   return this.metadata.type;
  // }

  // showName() {
  //   return this.name;
  // }
  // showMetadata() {
  //   return this.metadata;
  // }
  // showPath() {
  //   return this.metadata.path;
  // }

  // print() {
  //   console.log(this);
  // }
}

module.exports = File;
