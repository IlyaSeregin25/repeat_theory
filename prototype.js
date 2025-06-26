'use strict';

;(function(){
    
}())





/* 


















*/

/*                                          Разница между prototype и __proto__
JavaScript это интерпретируемый яп ориентированный на объектно-ориентированное программирование с прототипным наследованием.
Все наследуемые сво-ва хранятся в prototype. Если ребенок хочет обратиться к св-вам родителя,
то делаем это по ССЫЛКЕ __proto__. Т.е. в prototype хранятся все св-ва, а __proto__ это ссылка на prototype.
1) child.__proto__ = работает. child.prototype = не работает.
2) parent.prototype = работает для всех конструкторов (классы, ф-и конструкторы).
2) parent.__proto__ = работает для обычных объектов {}.
*/

/*        -------------------                      prototype             -------------------
У test1 есть метод say2 т.к. там знак равно. А say1 будет лежать в test1.prototype.say1
Но тем не менее мы можем обратиться и как test1.say1. Это как массивы, есть объект Array, а его дети наследуют св-ва push shift.
Созданные объекты test1 наследуют и все прототипы родителя
*/
class Test1 {
  constructor() {
    this.a = 101;
  }
  say1() {} //улетит в прототип т.к. нет знака равно
  say2 = function () {};
}
const test1 = new Test1();
/* 
Классы это синтаксический сахар над функциями конструкторами. Появились в es5 (2015) Обязательно использовать new при создании.
Если хотим добавить что то в Prototype то делаем это напрямую Test2.prototype
Теперь и у Test2 и у его ребенка test2 есть в Prototype метод say2
*/
function Test2() {
  this.a = 201;
  this.say1 = () => {};
}
Test2.prototype.say2 = () => {};
const test2 = new Test2();

/* -------------------                      __proto__             -------------------
__proto__ - значит что rabbit наследует в прототип все св-ва animal. rabbit.eats будет да
Можно задавать прототип в момент создания объекта "rabbit = {__proto__: animal}"
либо уже после наследовать "rabbit.__proto__ = animal"
*/
var animal = {
  eats: 'yes',
};
var rabbit = {
  jumps: 'yes',
  __proto__: animal,
};

/* ----------------------------КОНТЕКСТ---------------------------------------------
Контекст ОБЩИЕ ВЫВОДЫ
1) В корне класса либо функции конструктора нет разницы между ()=> или function declaration. Привязывать ничего не нужно.
2) В корне объекта контекст ()=> не перепривязать. Используем function declaration и привязываем.
3) Используем ()=> в корне объекта если внутри нету this.
4) Для класса/объекта/функции конструктора используем ()=> внутри другой функции что бы взять контекст из внешнего окружения.
5) у прототипа функции конструктора контекст не перепривязать, а у остальных да.
*/
class Test3 {
  constructor() {
    this.a = 101;
    this.arr = [1, 2, 3];
  }
  say1() {
    console.log(this); // Работает
  }
  say2 = function () {
    console.log(this); // Работает
  };
  say3 = () => {
    console.log(this); // Работает

    this.arr.forEach(function () {
      console.log(this); // undefined
    });
    this.arr.forEach(() => {
      console.log(this); // Работает
    });
  };
}
//const test3 = new Test3(); test3.say1();
const test3 = new Test3();
/* Выводы по классам:
1) В корне класса в качестве метода можно использовать и ()=> или function declaration. Разницы нету.
2) Внутри корневого метода используем ()=>. Либо привязываем function declaration в конструкторе.
*/

function Test4() {
  this.a = 201;
  this.arr = [1, 2, 3];
  this.say1 = function () {
    //this.say1 = () => {                   Нет разницы между ()=> и обычной ф-й
    console.log(this); // Работает
    this.arr.forEach(function () {
      console.log(this); // НЕТ
    });
    this.arr.forEach(() => {
      console.log(this); // ДА
    });
  };
}
Test4.prototype.say2 = () => {
  console.log(this); // window и не перепривязать
};
//const test4 = new Test4(); test4.say1();

const obj = {
  a: 50,
  arr: [1, 2, 3],
  say2: () => {
    console.log(this); // window. Через bind стрелочную ф-ю привязать НЕ получится.
  },
  say1() {
    console.log(this); // undefined. Привязываем через bind
    this.arr.forEach(function () {
      console.log(this); // undefined
    });
    this.arr.forEach(() => {
      console.log(this); // {a: ...} Показывает наш obj
    });
    return () => {
      console.log(this); // ДА testObj1()();
    };
    return function () {
      console.log(this); // НЕТ testObj1()();
    };
  },
};
//const testObj1 = obj.say1.bind(obj); testObj1();
/* Выводы по объектам:
1) в корне объекта в качестве метода ()=> не применяем т.к. их контекст потом не привязать. Либо не используем внутри this
2) в корне объекта в качестве метода используем function declaration и их потом привязываем
obj.func.call(obj, param1, param2) / .apply(obj, [param1, param2])           Если надо сразу вызвать
const newFunc = obj.func.bind(obj, param1, param2) / newFunc(param1, param2) Если надо создать обертку и вызвать после
3) стрелочную ф-ю используем внутри другой function declaration или forEach

(function () {
  let obj = {
    age: 100,
    func: function () {
      console.log(this);
    },
  };
  function myBindd(func, context, ...args) {
    return func.apply(context, args);
  }
  //let f1 = myBindd(obj.func, obj);
  Object.prototype.mb = function (context, ...args) {
    // Обязательно обычная функция что бы this работал
    return () => this.apply(context, args);
    // Обязательно стрелочная функция что бы this работал
  };
  let f2 = obj.func.mb(obj);
  //f2();

  Number.prototype.minus = function (num) {
    return this - num;
  };
  let val = (100).minus(5);
})();
*/

/* Делаем функцию с несколькими методами т.е. возвращаем объект с этими методами */
function createCounter(num) {
  let count = num;
  const obj = {
    increment() {
      return count++;
    },
    decrement() {
      return count--;
    },
    log() {
      setTimeout(() => {
        console.log(count);
      }, 1000);
    },
  };
  return obj;
}
//const counter = createCounter(10); counter.increment();counter.log();


function sayHello() {
  console.log(this.name);
}

const person = {
  name: 'John',
  sayHello: sayHello,
};

//person.sayHello(); // Выводит 'John'

const greet = person.sayHello;
//greet();

/* 
Array;
//console.log(Array.prototype);
const arr = [];
//console.log(arr.__proto__);

const animall = {
  eate: 'yes',
};
animall.__proto__.newFunc = 100; //будет у всех объектов т.к. animall наследует от Object. Осторожно!
const rabbitt = {
  jumps: 'yes',
  __proto__: animall,
};
rabbitt.__proto__.s = 55;
delete rabbitt.__proto__.s;

function Users() {
  this.a = 55;
}
Users.prototype.ssss = 1000;
const userrr = new Users();
userrr.__proto__.dd = 5;

class Men {
  constructor(name) {
    this.name = name;
  }
  say() {} //prototype
  say2 = function () {
    return this.name;
  };
  age = 100;
}
const men = new Men('vasya');
Men.prototype;
men.__proto__;

class Workerr extends Men {
  //наследует все св-ва и прототипы
  constructor(name, salary) {
    //this ошибка, нужен суперконструктор
    super(name);
    //this теперь всё ок
    this.salary = salary;
  }
  getInfo() {
    return this.name + ' ' + this.salary; //name доступна из родителя. Супер ненужен. Он нужен для изменения
  }
  changeParentProperty() {
    super.say2 = 1; //меняем св-во только у ребенка. У men say2 попрежнему функция. Вложенность любая super.super
  }
}
const workerr = new Workerr('petya', 500);
workerr.changeParentProperty();

// -------------------------- Инкапсуляция - ненаследование приватных св-в ----------------------------------------
// _name раньше так делали, но доступ все равно есть. Сейчас так #name и доступа нет
class People {
  #name; // объявляем обязательно
  constructor() {
    this._age = 100;
    this.#name = 100; // присваиваем
  }
  // Акссессор
  get Age() {
    return this._age;
  }
  set Age(val) {
    this._age = val;
  }
}
const people = new People();
people.Age = 55;
//console.log(people.Age);
//console.log(people._age);
//console.log(people.#age); //ошибка #
class Peoples extends People {
  constructor() {
    super();
    this.count = 10;
    //#name или this.#name :Ошибка. Доступа нет. Только через публичные методы или геттеры/сеттеры или аксессоры.
  }
}
const peoples = new Peoples();
//console.log(peoples);  #name видим, но напрямую обратиться не можем
 */
