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
}

module.exports = File;
