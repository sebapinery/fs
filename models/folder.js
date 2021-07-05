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

  // showParentFolder(){
  //   return this.metadata.parentFolder;
  // }

  // showDataCreated() {
  //   return this.metadata.createdAt;
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

  showComposite() {
    return this.composite;
  }

  // addToComposite(element) {
  //   this.composite.push(element);
  // }

  removeInComposite(index) {
    return this.composite.splice(index, 1);
  }

  setData(data){
    this.composite = data;
    return this.composite;
  }

  // print() {
  //   return this;
  // }
}

module.exports = Folder;
