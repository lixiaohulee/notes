



function Person() {
    this.name = 'lee'
}

Person.prototype = {
    age: 22
}

Object.defineProperty(Person.prototype, 'constructor', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: Person
})

var p = new Person()


for(var key in p) {
    console.log(key)
}

