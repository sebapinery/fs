class Group {
  constructor(name, composite = []) {
    this.name = name;
    this.composite = composite;
  }

  showComposite() {
    return this.composite;
  }
  addToComposite(User) {
    return this.composite.push(User);
  }

  removeInComposite(index) {
    return this.composite.splice(index, 1);
  }

  print() {
    return this;
  }
}

module.exports = Group;
