class Person {
  constructor(name, lastname) {
    this.name = name
    this.lastname = lastname
  }

  sayHello() {
    console.log(`${this.name} ${this.lastname}`);
  }
}

const p1 = new Person('John', 'Do');
const hello = p1.sayHello();
