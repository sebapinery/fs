class File {
  constructor(name, metadata) {
    this.name = name;
    this.metadata = metadata;
  }

  showName() {
    return this.name;
  }
  showMetadata() {
    return this.metadata;
  }

  print() {
    console.log(this);
  }
}

module.exports = File;
