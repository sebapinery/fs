class Folder {
  constructor(name, composite = [], path) {
    this.name = name;
    this.path = path;
    this.composite = composite;
  }

  showPath(){
      return this.path;
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
