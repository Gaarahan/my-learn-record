const beforeDecorate = {
  setName(name) {
    this.name = name;
  }
}

const afterDecorator = {
  setName(name) {
    console.log(name)
    this.name = name;
  }
}


Object.defineProperty(beforeDecorate, 'setName', {
  value: () => {
    /* ..... */
  }
})