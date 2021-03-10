function test(target, key, index) {
  Object.defineProperty(target, key, {
    value: ()=> {
      console.log('setName is edited');
    }
  })
}

class TestParams {
  name = 'hhh';
  setName(@test name) {
    console.log('setName is working');
    this.name = name
  }
}

new TestParams().setName('test');