class Group {
  constructor(name, composite = []) {
    this.name = name;
    this.composite = composite;
  }

  setData(data){
    this.composite = data;
    return this.composite;
  }
}

module.exports = Group;
