'use strict';

(function () {
  //graph1: A - F
  //Создание очереди - цикл - вытаскивание из очереди, проверка, выход, наполнение очереди
  //graph2: a - e
  // Создание пути, дистанции - наполнение дистанций - цикл - самый быстрый - соседи. Короткий путь.
  const graph1 = {
    A: ['B', 'C'],
    B: ['A', 'D'],
    C: ['A', 'D', 'E'],
    D: ['B', 'C', 'E'],
    E: ['C', 'D', 'F'],
    F: ['E'],
  };
  const graph2 = {
    a: { b: 2, c: 1, i: 3 },
    b: { a: 2, d: 3 },
    c: { a: 1, d: 1 },
    d: { b: 3, c: 1, e: 5 },
    e: { d: 5, i: 2 },
    i: { a: 3, e: 2 },
  };
})();

/* Алгоритмы
1) В массиве все элементы хранятся в памяти рядом друг с другом. 
    Но все элементы массива должны быть однотипными (только целые числа, только вещественные числа и т.п.)
2) В хэш таблицах все элементы хранятся в памяти в произвольных местах, 
    ключом является уникальная хэш строка, поэтому доступ O(1). 

Ассоциативный массив это хэш таблица. Мэп это хэш карта, где ключом может быть не только примитив.

Структура   Получение  Поиск   Удаление    Добавление
Массив      O(1)        O(n)    O(n)       O(1) (конец), O(n) (середина)
Set         ----        O(1)    O(1)        O(1)
Map         O(1)        O(1)    O(1)        O(1)

[{имена на А}, {имена на Б}, ...] Лучше хранить так.

Последовательные операции складываются, вложенные умножаются. 
arr1.forEach() O(n)
arr2.forEach() O(n)
Итого O(n+n) = O(2n) = O(n) //константу 2 опускаем.
arr1.forEach(()=> {     O(n)
    arr2.forEach()      O(n)
})
Итого O(n*n) = O(n^2)

Берется самый сложный алгоритм
a = 1           O(1)
arr.forEach()   O(n)
Итого O(1 + n) = O(n) или допустим O(n + n^2) = O(n^2)

Сортировка sort() - по умолчанию числа сравниваются как строки. 
Самый оптимальный метод который применяет разные алгоритмы в зависимости от входных данных

Хэш таблица - создается объединением хэшфункции с массивом.
Это {}, Set, Map. Ключом является уникальная хэшфункция.
Проблема: коллизии. {апельсин: 5, абрикос: 7, брокколи: 10}
Допустим в памяти хранятся по очереди апельсин,абрикос,брокколи. 
А теперь мы хотим добавить авокадо. Но свободной ячейки между а и б нету.
Можно на ячейки "а" вешаем связанный список. абрикос будет знать где лежит авокадо.
Но и этот список может быть длинным если слов на "а" будет очень много.
Для избежания этого используют низкий коэф. заполнения - когда мест больше чем товаров
и хорошую хеш-функцию - обеспечивающую равномерное распределения товаров.
*/

/* Графы
https://www.youtube.com/@ivashov/videos
Графы состоят из узлов и рёрб. Узел---Ребро---Узел.
1) Поиск в ширину - алгоритм для невзвешанных граф. Помогает ответить на два вопроса:
    - существует ли путь от узла А к узлу Б.
    - как выглядит кратчайший путь от А к Б
Пример: найти продавца который продает манго. 
Составляем список из соседей(соседних узлов) и проверяем продают ли они манго.
Если нет, то добавляем в список соседей соседних узлов и проверяем их и т.д.
Каждый уровень вложенности будем реализововать с помощью очереди, что бы не перскакивать
на подуровень глубже раньшем, чем не проверим всех на верхнем уровне. Количество уровней
будет являться самым кратчайшим путем.
2) Дерево - это графы, в которых ребра имеет однонаправленность.
3) Очередь - первым вошел, первым вышел. Стек - последним вошел, первым вышел.

Алгоритм Дейкстры для взвешанных граф (графы имеющие вес). 
Работает только с направленными ациклическими графами, имеющими НЕотрицательный вес. 
(а ведет к б, б ведет к а =циклические графы. а ведет к б = ациклические графы)
(для отрицательных весов используется алгоритм Беллмана-Форда - не рассматриваю).
С помощью граф мы определили самый кратчайший путь, т.е. где наименьшее кол-во ребер.
Но что, если у ребер есть своя продолжительность и мы ищем не кратчайший, а наиболее быстрый путь.
Каждому ребру добавляется вес. Алгоритм состоит из 4ех этапов:
1) Найти узел с наименьшим весом (до которого можно добраться за минимальное время).
2) Обновить стоимость соседей этого узла.
3) Повторять, пока это не будет сделано для всех узлов.
4) Вычислить итоговый путь.
183
*/

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

(function () {
  // O(log n) логарифм n от двух. log8 = 3 (2*2*2 =8)
  function binarySearch(arr, num) {
    let low = 0,
      high = arr.length - 1;

    while (low <= high) {
      let mid = Math.floor((high + low) / 2);
      let guess = arr[mid];
      if (guess === num) return mid;
      if (guess > num) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    return null;
  }
})();
(function () {
  // Сортировка выбором O(n^2)
  const arr = [1, 3, 4, 6, 2, -1, 2];
  function findSmallest(arr) {
    let smallest = arr[0];
    let smallestIndex = 0;
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < smallest) {
        smallest = arr[i];
        smallestIndex = i;
      }
    }
    return smallestIndex;
  }
  // O(n^2). Долго т.к. приходится проходить по массиву (n n-1 n-2 ... 1 раз)=1/2 * n^2 но 1/2 игнорируют.
  function sortBySelection(arr) {
    let result = [];
    while (arr.length > 0) {
      let ind = findSmallest(arr);
      let [elem] = arr.splice(ind, 1);
      result.push(elem);
    }
    return result;
  }
  //console.log(sortBySelection(arr))
})();
(function () {
  // Задача о комивояжере O(n!) - есть n-городов. Найти наименьший путь между всеми городами.

  function getFactorial(num) {
    // циклы работают быстрее чем рекурсии
    let multiplication = 1;
    while (num > 0) {
      multiplication = multiplication * num;
      num--;
    }
    return multiplication;
  }
  //console.log(getFactorial(3))

  function recursion(num) {
    if (num === 1) return 1;
    return num * recursion(num - 1);
  }
  //console.log(recursion(3))
  //стэк: верхний     урвень factorial(num = 3) factorial(num = 2) factorial(num = 1) возвращает 1
  //стэк: подуровень  урвень factorial(num = 3) factorial(num = 2) factorial(num = 1)
  //стэк: нижний      урвень factorial(num = 3) factorial(num = 2)
  //При этом доступа у factorial(num = 2) к factorial(num = 3) и наоборот нету. Каждый вызов создает собственную копию num
  //Доходим до самого верхнего ур-ня и только тогда начинает возвращать результат.
  //т.о. в памяти сохраняются все num и num - 1 что увеличивает нагрузку на память.

  const arrs = [[1, 1], 1, [1, [1, [1], 1]]];
  let sum = 0;
  function getSum(arrs) {
    for (let i = 0; i < arrs.length; i++) {
      if (typeof arrs[i] === 'object') getSum(arrs[i]);
      if (typeof arrs[i] !== 'object') sum += arrs[i];
    }
    return sum;
  }
  //console.log(getSum(arrs))
})();
(function () {
  // Стратегия "Разделяй и властвуй" - это Рекурсивный метод решия задач.
  // Быстрая сортировка. O(n log n) - средний случай (он же и лучший), а для худшего O(n^2).
  // При работе с массивами выбираем случайный элемент массива, тогда почти всегда будет O(n log n).
  // 1) Сначало определяется базовый случай - простейший случай из всех возможных
  // 2) Задача делится или сокращается до тех пор, пока не будет сведена к базовому случаю.

  function quickSort(arr) {
    if (arr.length <= 1) return arr; // Условие остановки, выхода из рекурсии, возвращаем массив с 1 элементом
    let pivot = arr.splice(Math.floor((arr.length - 1) / 2), 1); // выбор случайного опорного элемента
    let less = [],
      greater = []; // Разделение на подмассивы, что меньше опорного элемента влево, остальное вправо
    for (let i = 0; i < arr.length; i++) {
      if (pivot > arr[i]) {
        less.push(arr[i]);
      } else {
        greater.push(arr[i]);
      }
      // [less, pivot, greater]
    }
    // Рекурсивно повторяем процесс для новых двух массивов
    return quickSort(less).concat(pivot, quickSort(greater));
  }

  // Фермерское поле 640*1680(=640+640+400). Разделить на равные квадраты самого большого размера.
  // - базовый случай. Самый большой квадрат 640*640. Два квадрата по 640 + 640 и остаток 400*640
  // у 400*640 самый большой квадрат 400*400 и остаток 240*400
  // у 240*400 самый большой квадрат 240*240 и остаток 240*160
  // у 240*160 самый большой квадрат 160*160 и остаток 80*160
  // у 80*160 самый большой квадрат 80*80 и остаток 80*80. Ответ 80*80
  // [640, 1680] [640, 1680-640=1040] [640, 1040-640=400] [640-400=240, 400]
  // [240, 400-240=160] [240-160=80, 160] [80, 160-80=80] [80, 80]
  function getMaxSquare(arr) {
    if (arr[0] === arr[1]) return arr;
    if (arr[0] > arr[1]) {
      arr[0] = arr[0] - arr[1];
    } else {
      arr[1] = arr[1] - arr[0];
    }
    return getMaxSquare(arr);
  }
  //console.log(getMaxSquare([640, 1680]))
})();
//Невзвешанные ГРАФЫ
(function () {
  const graph = {
    A: ['B', 'C'],
    B: ['A', 'D'],
    C: ['A', 'D', 'E'],
    D: ['B', 'C', 'E'],
    E: ['C', 'D', 'F'],
    F: ['E'],
  };
  //breadth first Search BFS. BFS предполагает движение вперед по одному соседу за раз
  //O(V+E) кол-во узлов + кол-во ребер
  function breadthFirstSearch(graph, start, end) {
    //создаем очередь с точкой и путем.
    const queue = [{ node: start, path: [start] }];

    //Посещенные точки, чтобы повторно их не проверять и не вызвать бесконечный цикл.
    const visited = {};

    while (queue.length > 0) {
      const { node, path } = queue.shift(); //достаем первый элемент из очереди

      if (visited[node]) {
        continue; //пропускаем эту итерацию цикла и не обрабатываем вершину
      }

      visited[node] = true;

      if (node === end) {
        //если точка конечна то мы нашли путь и выходим из цикла
        return path;
      }

      for (const neighbor of graph[node]) {
        //проверяем соседние вершины
        if (!visited[neighbor]) {
          queue.push({ node: neighbor, path: [...path, neighbor] });
        }
      }
    }
    return null;
  }
  const resultBFS = breadthFirstSearch(graph, 'A', 'F'); //хранит конечный путь BFS
  //console.log(resultBFS)
  /* ---------------------------Есть ли путь между узлами------------------------------------------ */
  function havePath(graph, start, end) {
    const queue = [{ node: start, path: [start] }];
    const visited = new Set();

    while (queue.length > 0) {
      const { node, path } = queue.shift();
      if (visited.has(node)) continue;
      visited.add(node);
      if (node === end) return `Путь из точки ${start} в точку ${end} существует`;
      for (const neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          queue.push({ node: neighbor, path: [...path, neighbor] });
        }
      }
    }
    return `Путь из точки ${start} в точку ${end} НЕ существует`;
  }
  const resultHavePath = havePath(graph, 'A', 'F');
  //console.log(resultHavePath)

  /* ---------------Найти все узлы на расстоянии N от начального узла-------------------- */
  /* не пройденные узлы, а узлы к которым можем прийти сделав N шагов. */
  function findNodesAtdistances(graph, start, distances) {
    const queue = [{ node: start, dist: 0 }];
    const nodes = [];
    const visited = {};

    while (queue.length > 0) {
      const { node, dist } = queue.shift();
      if (visited[node]) continue;
      visited[node] = true;
      if (dist === distances) nodes.push(node);
      for (const neighbor of graph[node]) {
        if (!visited[neighbor]) {
          queue.push({ node: neighbor, dist: dist + 1 });
        }
      }
    }
    return nodes;
  }
  const resultFindNodesAtdistances = findNodesAtdistances(graph, 'A', 2);
  //console.log(resultFindNodesAtdistances)

  /* ---------------Поиск всех путей между узлами-------------------- */
  function findAllPath(graph, start, end) {
    const queue = [[start]];
    const paths = [];

    while (queue.length > 0) {
      const currentPath = queue.shift();
      const currentNode = currentPath.at(-1);
      //Array.prototype.at() - возвращает элемент по индексу. at(-1) - вернет первый с конца.

      if (currentNode === end) {
        paths.push(currentPath);
      } else {
        for (const neighbor of graph[currentNode]) {
          if (!currentPath.includes(neighbor)) {
            queue.push([...currentPath, neighbor]);
          }
        }
      }
    }
    return paths;
  }
  const resultFindAllPath = findAllPath(graph, 'A', 'F');
  //console.log(resultFindAllPath)
})();
//Взвешанные графы - Дейкстры
(function () {
  //Хотим попасть из точки А в точку Е самым быстрым способом.
  const graph = {
    a: { b: 2, c: 1, i: 3 },
    b: { a: 2, d: 3 },
    c: { a: 1, d: 1 },
    d: { b: 3, c: 1, e: 5 },
    e: { d: 5, i: 2 },
    i: { a: 3, e: 2 },
  };

  function dijkstra(graph, start, end) {
    const distances = {};
    const visited = new Set();
    const path = {};

    for (const key in graph) {
      if (key !== start) {
        distances[key] = Infinity;
      } else {
        distances[key] = 0;
      }
    }
    //задаем на старте 0 остальным бесконечность distances = {start=a: 0, (b,c,d,e,i): inifinty}

    while (!visited.has(end)) {
      let lowestDistances = Infinity;
      let node = null;

      for (const key in distances) {
        if (lowestDistances > distances[key] && !visited.has(key)) {
          lowestDistances = distances[key];
          node = key;
        }
      }
      const neighbors = graph[node];
      for (const key in neighbors) {
        const newDistance = distances[node] + neighbors[key];
        if (newDistance < distances[key]) {
          distances[key] = newDistance;
          path[key] = node;
        }
      }

      visited.add(node);
    }

    const shortPath = [];
    let current = end;
    while (current !== start) {
      shortPath.unshift(current);
      current = path[current];
    }
    shortPath.unshift(start);

    return shortPath;
  }
  const result = dijkstra(graph, 'a', 'e');
  //console.log(result)
})();

(function () {
  const input = document.querySelector('.input');
  const inputBox = document.querySelector('.input__box');
  const inputContainer = document.querySelector('.input__container');
  inputContainer.onclick = function () {
    inputBox.classList.toggle('active');
    let flag = inputBox.classList.contains('active');
    input.checked = flag ? true : false;
  };

  let tabsControl = document.querySelectorAll('.tab__control');
  let tabsContent = document.querySelectorAll('.tab__content');
  tabsControl.forEach(tabControl => {
    tabControl.addEventListener('click', function () {
      let tabControlId = this.dataset.tabId;
      tabsContent.forEach(tabContent => {
        let tabContentlId = tabContent.dataset.tabId;
        if (tabControlId === tabContentlId) {
          tabContent.style.display = 'block';
          let hight = tabContent.offsetHeight;
          animationByHeight(tabContent, 0, hight, 500);
        } else {
          tabContent.style.display = 'none';
        }
      });
    });
  });
  function animationByHeight(elem, minH, maxH, delay) {
    return elem.animate([{ maxHeight: `${minH}px` }, { maxHeight: `${maxH}px` }], { duration: delay });
  }
})();
(function () {
  //JSON.stringifi() - функции и undefined пропадают. NaN превращается в null. Не копирует дом элементы. Пропадает связь с instanceof.
  const arrs = [
    1,
    [2],
    { age: 11, names: ['alex', 'petay'] },
    {
      name: function () {
        return 1;
      },
    },
  ];
  // [...arrs] || Object.assign([], arrs) : поверхностное копирование. Внутри ссылки на оригинал.
  //let clone = structuredClone(arrs) Новый способ глубокого копирования, но не копирует функции. Будет ошибка

  function getDeepClone(value) {
    if (typeof value !== 'object' || value === null) return value; //null - object баг самого js
    if (Array.isArray(value)) return value.map(elem => getDeepClone(elem));
    //Object.entries - [['age', 11], ['names',['alex', 'petay']]]
    return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, getDeepClone(val)]));
  }
  //console.log(getDeepClone(arrs))
})();
(function () {
  function debounce(func, delay) {
    let timeId = null;
    return function (...args) {
      clearTimeout(timeId);
      timeId = setTimeout(() => func.apply(this, args), delay);
    };
  }
  //throttle - ограничивает кол-во вызовов. Вызвали в первый раз, и пока не пройдет delay ф-я повторно не вызовется
  function throttle(func, delay) {
    let shouldBeCalled = true;
    return function (...args) {
      if (!shouldBeCalled) return;
      shouldBeCalled = false;
      setTimeout(() => (shouldBeCalled = true), delay);
      func.apply(this, args);
    };
  }
  //Просто создаем обертку bind вокруг функции
  function curry(func) {
    return function curried(...args) {
      if (func.length > args.length) return curried.bind(this, ...args);
      return func.apply(this, args);
      /* if (args.length >= func.length) return func.apply(this, args);
            return curried.bind(this, ...args) */
    };
    //func.length - кол-во аргументов переданных функции
  }
})();

/* VS-CODE
---------------------------------VS-CODE--------------------------
Расширрения:
    Autoprefixer
    eCSStractor for VSCode              - копирование классов из html в css
    scss-to-css                         - scss + автопрефиксер
    Live Server
    Path Autocomplete                   - автоматический путь при import from "...."
    Reactjs code snippets
        rsf и  rsc - создает компонент функциональный или стрелочный.
    Для Tailwind: 
        Tailwind CSS IntelliSense       - автозаполнение классов в html
        Классы рекомендовано писать в нужном порядке. Для этого нужен преттер:
        Заходим на сайт Tailwind, в поиске вбиваем Prettier, переходим на гитхаб,
        устанавливаем npm i . В корне проекта создаем .prettierrc.json и добавляем туда то, 
        что на гитхабе (plugins). Далее устанавливаем расширение
        Prettier - Code formatter и ставим его в default: ctrl+shift+p -> format document with
        или через sittings - в поиске 'format'. 
        Text editor - editor default formater -> выбираем Prettier - Code formatter

Свои сниппеты:
    F1 -> Snippets:Congigure Snippets -> выбираем язык (есть js и jsx)
    Либо File -> Preferences -> Congigure Snippets -> выбираем язык (есть js и jsx)
    В открывшемся файле json: 
    {
        // комменты
        "mySnippets": {
            "prefixer": "cl",
            "body": "console.log()",
        }
    }

shift + alt + N     - открыть новую вкладку для второго проекта
shift + alt + F     - автовыравнивание
shift + alt + A     - многострочный коммент со звездочками
*/

/* HTML CSS z-index opacity / visibility / display. Инпут в Лейбл
----------------------------------HTML CSS------------------------------------------
display: none;       - Удаляет элемент из верстки. Гугл поиск не увидит нашу пустую страницу. Не анимируется.
visibility/opacity   - Элемент остается в верстке, гугл видит нашу страницу.
visibility: hidden;  - Скрывает информацию для скринридеров. Табуляция и клики не работает. Не анимируется.
opacity: 0;          - Скринридеры видят, табуляция и клики происходят. Анимируется.

Оборачивание инпут в лейбл - автоматически их связывает и заводить id не надо

justify - по основной оси, align - по поперечной оси
1) parent: dispay: flex; column. Т.к. флекс имеет всю ширину родителя, то кнопка будет 100%.
    [       ]
    [  btn  ]
    Но мы можем указать кнопке max-width: fit-content [  btn  ] -> [btn]
2) .wrapper {
    grid; 
    grid-template-columns: repeat(auto-fill, 200px) repeat(4, 1fr) repeat(4, minmax(0, 1fr))
    gap: ряд колонна
    }
3) Выключение обертки
    [ [logo]                [обертка [nav] [contacts] ]  ] У обертка.display: contents; Третья обертка исчезнет.
    [ [logo]          [nav]          [contacts] ]  ]
4) У svg есть fill stroke
5) Делаем 3 точки ...
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;              - количество строчек
    overflow: hidden;
    text-overflow: ellipsis;
6) z-index положительное и отрицательное число. По умолчанию все элементы static и не имеют z-index.
    z-index=5
        z-index=5.4
            z-index=5.4.1
        z-index=5.4
*/

//String Number(NaN) Boolean Symbol BigInt null undefined        Object{array obj func data map}

/* типы данных typeof
    Типы структур данных (типы данных:все примитивы + объект Итого 8 типов.)
    1) Примитивные. Сравниваются по значению
        Numbers - все числа в т.ч. с плавающей точкой и typepf NaN - number.
        String.
        Boolean - true / false. Boolean("Hello") или двойное !!. !!"Hello"-true !""-строка false+отрицание=true
        Null - всегда инициализируем сами. Сам js никогда его не вернет. Баг typeof null - object
        Undefined - присваивается по умолчанию
        Symbol -уникальные знач. Два одинаковых символа никогда не равны друг другу Symbol("a") === Symbol("a") false
        BigInt - для очень больших числе let val = BigInt(1111111111)
    2) Объекты. Сравниваются по ссылкам
        Object {} или let obj = new Object().   typeof - object
        Array [] или let obj = new Array().     typeof - object     Array.isArray(val) - true/false
        Function                                typeof - function
        Date.  let date = new Date()            typeof - object
        RegExp let reg = new RegExp('', g)      typeof - object
        Map - ключи любые в т.ч. элементы дом
        Set - уник значения.                    typeof - object
            можем передать массив new Set([1,1,2]) вернет [1,2] без повторения
            За 0(1) есть ли элемент в массиве. В обычном массиве нам бы пришлось перебрать весь массив O(n)
*/

/* Строгое / не строгое сравнение
    == НЕ СТРОГОЕ СРАВНЕНИЕ
    1) Object если ссылка совпадает
    2) Numbers, String, Boolean, BigInt по значению.
    3) Symbol уникальные
    4) При сравнении Примитивные и Объектов правила приведения к примитивам
        Null == Undefined != 0/false
        '' == false == [] == 0 != {}    
        [1,2] == '1,2' != '12'          //массивы выводятся как строки через запятую
        0 == -0
        NaN == NaN нет. NaN ничему не равен в т.ч. самому себе
    5) Регистр важен!
        'A' != 'a'
        'A' !== 'a'

    === СТРОГОЕ СРАВНЕНИЕ
    Нет приведения типов.
    false !== 0 !== [] !== '' 
    null !== undefined

    0 === -0 true

    Object.is() СТРОГОЕ СРАВНЕНИЕ
    Object.is(NaN, NaN) true
    Object.is(0, -0) false

    Number.isNaN(2 / 0) true. Все что делим на 0 есть NaN

    ПРИВИДЕНИЕ ТИПОВ
    1 + '1'  или  '1' + 1  от перестановки разницы нет для любых операций.
    +         всегда строка 11
    - * "/"   приводит к числу. Если в строке буква то NaN
*/

/* Логические операторы (|| ||= && &&= ! ?? ??=)
1) ||  (ИЛИ)
    Для булевых значение. (false || true) вернет true, (false || false) вернет false.
    Если значение не логического типа, то оно к нему приводится в целях вычислений. 0=[]=''=false, -1=1=2=true
        (0 || 2):2      (-2 || -1):-2
    Находит первое истинное значение. Либо ЛЮБОЕ последние, если истинных нет.
        (0 || 2 || 1):2    ('da' || 'dada'):da    (undefined || null || false || -1):-1
2) ||= (Оператор логического присваивания ИЛИ)     
    a ||=b    a || (a = b)          Если a = false, то a = b;
    let a, b = 123; Вернет a = 123,     let a, b = null; a ||=b вернет a = null.
3) &&  (И)
    Если все операнды были истинными, возвращается последний. Если все истинные - то первый.
    (true && 12 && '-sd'):-sd
4) &&= (Оператор логического присваивания И)
    a &&= b    a && (a = b)     Если и а и b истинны, то a = b.
5) !   (НЕ)
6) ??  (Оператор нулевого слияния)
7) ??= (Оператор нулевого присваивания)
ПРИОРИТЕТНОСТЬ выполнения: сначало !, потом &&, потом ||, потом

console.log(false || false)
console.log(-2 || -1)
console.log(0 || 2 || 1)
console.log(undefined || null || false || -1)
console.log(undefined || null || false || null)
console.log(a ||=b)
console.log(true && 12 && '-sd')
console.log(a &&= b)
*/

/* Boxing и Unboxing в JavaScript
-----Boxing и Unboxing - это процессы автоматического преобразования примитивных типов данных в объектные обёртки, и обратно.------
  let str1 = '123';
  let str2 = new String('123');
  console.log(str1, typeof str1);           //'123' string
  console.log(str2, typeof str2);           //String{'123'} 'object'
  У примитивов нет свойств и методов. Однако когда мы пишем так
  str1.toUpperCase()                        
  автоматически применяется new String(str1) и уже там у объекта String есть методы и св-ва.
*/

/* Сборщик мусора. JavaScript - интерпретируемый и компилируемый язык благодаря компилятору JIT.
интерпретируемый значит, что код выполняется строка за строкой без компиляции в машинный код. 
JS перед выполнением компилируется в машинный код, однако это делает динамически с помощью компилятора JIT.
Благодаря этому достигается производительность.
Сборщик мусора в js является автоматическим, в некоторых других языках его нужно вызывать вручную.
Старается работать во время простоя процессора, что бы не влиять на производительность.
Алгоритм работы: сначало сборщик проходит по приложению и помечает все достижимые объекты, 
потом удаляет все непомеченные объекты.
Достижимые объекты - все объекты до которых есть рабочая ссылка. Достижимые - все те кто участвуют в работе приложения
Ссылка может быть прямой либо косвенной, когда один объект ссылается на другой, а тот на третий и так по ступенькам.

let user = {
    name: 'alex',
};
user = null;  //Вариант1: ссылка на "name: 'alex'" потеряласть и память очищается
let secondLink = user; //теперь две ссылки на один объект
user = null;  //Вариант2: ссылка на "name: 'alex'" еще достижима через secondLink и не очищается
*/

/* Контекст Замыкание MyBind() Object.myBind Myfilter counter.increment()
-----------------------------------------Контекст Замыкание-------------------------------------
Execution Context - абстрактное понятие, содержащее информацию об окружающей среде, 
в которой выполняется текущий код. Т.к JS является однопоточным, в любой момент времени 
может быть запущен только один контекст выполнения!
Execution Context включает в себя Lexical Environment. Lexical Environment - лексическое окружение. 
Содержит в себе все внутренние переменные и ссылку на внешнее лексическое окружение.
this - определяется и сохраняется в контексте выполнения. Значение this зависит от того, как вызывается функция, 
и может относиться к глобальному контексту, текущему экземпляру объекта или быть задано явно с помощью call/apply/bind
Каждый раз когда вызывается функция создается свой Execution Context.
Замыкание - Когда функция возвращает другую функцию, возвращаемая функция сохраняет ссылку на свою 
исходную лексическую среду (в которой она была создана). Это и есть замыкание. 
Несмотря на то, что функции, возвращаемые другими функциями, выполняются вне своей исходной области видимости, 
они могут обращаться к переменным в области видимости родительской функции.
let obj = {
    a: 100,
    func1: () => {console.log(this)},
    func2: function(){console.log(this)},
}
let f2 = obj.func2.bind(obj);
let myF2 = myBind(obj.func2, obj)

function myBind(func, context, ...args) {
    return function() {
        func.apply(context, args)
    }
}
Object.prototype.myBind = function(context, ...args) {
    // Обязательно обычная функция что бы this работал
    return () => this.apply(context, args)
    // Обязательно стрелочная функция что бы this работал
}
let myF2B = obj.func2.myBind(obj);
myF2B()

Number.prototype.minus = function(num) {
    return this - num;
}
console.log((10).minus(3))

Array.prototype.myFilter = function(callback) {
    //callback(elem, ind, array)
    if (this == null) throw new Error('this is no Array'); //null undefined Нестрогое сравнение
    if (typeof callback !== 'function') throw new Error('not a  Function'); //Правильный колбэк
    let result = [];
    for (let i = 0; i < this.length; i++) {
        let flag = callback(this[i], i, this);
        if (flag) result.push(this[i]);
        //callback(this[i], i, this);           для forEach
    }
    return result;
}

function createCounter(num = 0) {
    let count = num;
    let obj = {
        increment() {return ++count},
        dicrement() {return --count},
    }
    return obj;
}
let counter1 = createCounter();
let counter2 = createCounter();
console.log(counter1.increment())
*/

//prototype __proto

/* axios FETCH
                                -------axios---------
axios.get(url, {}).then(response => response.data)                    //Не нужен .json()
axios.post(url, {id:1, name:''}).then(response => response.data)      //Не нужно преобразовывать в JSON.stringify(..)
axios(url, {
    method: 'POST',
    data: {id:1, name:''}
}).then(response => response.data)     //Второй вариант без вызова метода напрямую
  
                                -------FETCH---------                     
fetch('url', {
    method: 'GET'                              // Получить данные по идентификатору
}).then(response => response.json()).then(data => console.log(data))
fetch('url', {
    method: 'POST',                            // Отправить данные на сервер
    body: JSON.stringify({id:1, name: 'Vasay'})
})
fetch('url/1', {
    method: 'DELETE'                           // Удалить по идентификатору
})
fetch('url/1', {
    method: 'PUT',                             // Обновить данные
    body: JSON.stringify({id:1, name: 'Vasay'})
})
*/

/* REST, GraphQL, gRPC и WebSocket
При работе с сервером есть несколько вариантов.
1) WebSocket - протокол, устанавливающий постоянное двустороннее соединение между клиентом и сервером.
    Клиент отправляет HTTP-запрос на установку соединения. 
    После успешного “рукопожатия” соединение переходит на протокол WebSocket.
    Обе стороны могут отправлять и принимать данные без необходимости повторного запроса.
    Онлайн чаты, стриминговые площадки, финансовые платформы.
2) REST API — это не протокол, а архитектурный стиль приложения.
    Обмен по протоколу HTTP(S) через json.
    GET (получение ресурса), POST (сохранение ресурса), PUT (полная замена ресурса), 
    PATCH (частичная замена ресурса) и DELETE (удаление ресурса).
    Сервер не хранит результаты предыдущих сессий с клиентскими приложениями. 
    Каждое сообщение самодостаточное и содержит всю информацию, необходимую для его обработки.
    Подходит для простых приложений. 
3) GraphQL - это язык запросов. (как продолжение развития REST)
    Обмен по протоколу HTTP(S), но собственный формат на основе json.
    поддерживает обновления в реальном времени.
    позволяет задавать более гибкие запросы, что сокращает трафик и нагрузку на сервер.
    Подходит для более сложных приложений, но и требует более серъезных знаний.
4) gRPC (Google Remote Procedure Call) - фреймворк, разработанный Google.
    использует двоичный формат Protocol Buffers, который обеспечивает:
    высокую скорость и эффективность передачи данных в микросервисных архитектурах.
    Обновление в реальном времен. Поддержка разных языков программирования.
    Используют в высоконагруженных распределенных систем и микросервисов. Облака.
    Недостаток - сложность.
*/

/* Защита от XSS атак и от CSRF
1) XSS - вставка инородного скрипта в html.
    Пользователь вписывает в textarea вместо текста <script></script> и это сработает. 
    Поэтому в нативном js нужно сделать экранирование от скобочек:
    input.oninput = () => {
        let text = input.value;
        function escapeHTML(str) {
            return str
            .replace(/&/g, '&amp;')         //Обязательно первым в очереди, иначе баги.
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&#39;')
            .replace(/"/g, '&quot;')
        }
        elem.innerHTML = escapeHTML(text);
    }
    В реакте такой необходимости нету, он сам всё экранирует.
2) Подмена токена - для защиты используют CSRF(сисёрф токены).
    Все запросы которые отправляются с фронта доступны для чтения и могут быть перехвачены.
    Злоумышленники могут подменить сессию используя эти данные.
    Поэтому сервер генерирует дополнительный сисерф токен, уникальный для каждого пользователя. 
    Этот токен вставляется в скрытый инпут формы, и при отправке данных теперь дополнительно 
    отправляется этот токен. Если токена нет, то сервер не будет воспринимать эту форму.
    <form action="#">
        <input type="hidden" name="csrfToken" value="qwerty123">
        <input type="email">
    </form>
    Если форму отправляем через js, то записываем его в заголовки.
    const csrfToken = '123qwerty';
    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X_CSRF_Token': csrfToken
        },
        body: JSON.stringify({ email: '..@mail.ru' })
    })
    Так же на сервере используем политику CORS.
*/

/* Работа Интернета, Домен - Хостинг -.
-----------------------------------Работа Интернета---------------------------------------
Интернет это связь между устройствами, которые общаются с помощью единых правил — протоколов.
IP - уникальный номер, адрес компьютера (Internet Protocol).
DNS - Система доменных имен, вместо сложных численных адресов используются имена "www.google.com", 
которые превращаются в IP. Domain Name System имеет свои технологии шифрования и защиты.
IP/TCP - протоколы, гарантируют, что пакеты не потеряются и будут доставлены в правильном порядке.
IP направляет пакет данных, а TCP обеспечивает доставку (Transmission Control Protocol).
SSL/TLS - протоколы шифрования, защищают данные при передаче их в интернете. (Secure Sockets Layer) (Transport Layer Security Более новый)
HTTP и HTTPS - протоколы, позволяют передавать информацию веб-страниц (HyperText Transfer Protocol).
HTTP - передает данные в открытом виде (HyperText Transfer Protocol Secure).
HTTPS - использует шифрование с помощью протокола SSL/TLS.

Cтатус-коды HTTP: 100+ информационные, 200+ успешные, 300+ перенаправление, 400+ ошибки клиента, 500+ ошибки сервера.

1) Вы вбиваете поиск сайта "www.google.com". В кеше компьютера/роутера/провайдера смотрится, есть ли IP этого домена.
2) Если нету, то отправляется запрос DNS-серверу, который знает где искать. 
3) Ваш браузер получает IP-адрес и использует его для нахождения сайта в интернете.

Хостинг — это услуга по аренде сервера. Домен - это адрес сайта, а хостинг - физический объект сервер. Типы хостинга:
1) Общий хостинг: Наиболее простой и экономичный вариант, где один сервер используется сразу несколькими сайтами.
2) VPS (Virtual Private Server): более гибкие настройки и больше ресурсов, позволяя создавать сложные и кастомизируемые решения.
3) Выделенный сервер: вы арендуете целый сервер, что идеально для крупных проектов с высокой нагрузкой.
4) Облачный хостинг: это сеть серверов, если один сервер выйдет из строя, другой возьмет на себя его функции.
*/

/* Политика CORS
SSR - server side rendering, SPA - single page application.
----------------------------------------Политика CORS------------------------------------------
Запрос на сервер происходит так: сначало  браузер методом OPTIONS отправляет предварительный запрос на сервер с загаловками,
содержащими информацию о текущем запросе, сервер в ответ отправляет пустой http запрос с cross заголовками сервера.
Браузер получает предварительный запрос, проверяет разрешен ли http запрос. Если всё хорошо отправляет нормальный запрос,
если нет то ничего не отправляет. И браузер выдаст ошибку по Политике CORS.
Политика CORS настраивается на стороне сервера. В загаловке Access-Control-Allow-Origin 
указываются все сайты откуда разрешено отправлять запросы. *-значит все.
Так же в инспекторе браузера можно посмотреть во вкладке Network, нажав на любой запрос
в Response Headers в пункте Access-Control-Allow-Origin и Access-Control-Allow-Methods (post get и т.п.)
Access-Control-Max-Age - количество времени на которое нужно кешировать разрешения, что бы не делать предвар.запрос каждый раз.

разные домены, разные протоколы http/https, разные порты localhost:3000/localhost:3001
*/

/* Работа браузера. Reflow Repaint
---------------------------------------Работа браузера. Reflow Repaint-------------------------------
Пользователь вводит URL, браузер запрашивает IP-адрес сайта у DNS-серверов и устанавливает соединение с веб-сервером, 
используя протоколы TCP и HTTP или HTTPS. После этого он запрашивает и получает необходимые файлы, которые потом 
будут обработаны и трансформированы в визуальное представление страницы.

HTML -> HTML parser -> DOM -
                            --> render tree -> layout -> paint
CSS -> CSS parser -> CSSOM -

1) Загрузка исходников.
    Сервер присылает нам html. В нем подключены стили, скрипт и ссылка на картинку. Всё скачивается сверху вниз.
    Если установить у скрипта defer, то он загрузится последним. А к картинкам можно применить lazy.
2) Нужно прочитать и распарсить.
    результат парсинга html кода - DOM (Document Object Model)
    результат парсинга css кода - CSSOM (CSS Object Model)
3) Render Tree. 
    Браузер объединяет DOM и CSSOM в общее дерево рендеринга — Render Tree, куда попадают только видимые элементы.
    Элементы с display: none, в это дерево не попадут.
4) Layout. 
    Браузер начинает «расставлять» элементы на странице. Этот процесс называется Layout.
5) Paint.
    Отрисовка начинается с заднего плана и переходит к переднему:
    background-color; background-image; border; children; outline.

Layout и Paint работают за счёт центрального процессора компьютера, поэтому относительно меленные, 
а плавные операции невероятно дорогие. Для плавных анимаций в браузерах предусмотрен Compositing.
Композитинг — это разделение содержимого страницы на «слои» (св-ва transform и opacity), 
которые браузер будет перерисовывать. Эти слои друг от друга не зависят, из-за чего изменение элемента 
в одном слое не затрагивает элементы из других слоёв, и перерисовывать их становится не нужно.
Поэтому рекомендуется использовать transform и opacity.

ПЕРЕРИСОВКА —  процесс циклический. Браузер перерисовывает экран каждый раз, когда на странице происходят какие-то изменения.
Сначало происходит перекомпановка(более трудоемкий процесс), потом перекрашивание (менее трудоемкий процесс).
Один цикл обновления — это animation frame. Для анимаций лучше использовать window.requestAnimationFrame(),
а не setInterval(), который не учитывает на какой стадии отрисовки находится страница и кадры могут быть рваными.
    Reflow (relayout) - перекомпановка. Происходит когда:
Добавление/удаление/изменение элементов DOM (appendChild, removeChild).
Изменение макета путем настройки стилей CSS, таких как width, height, margin, padding и т.д.
Изменение размера окна.
Изменение размера свойств шрифта.
Использование таких методов, как offsetWidth, offsetHeight, scrollTop, getBoundingClientRect(), 
поскольку они заставляют браузер перерасчитывать макет.
    Repaint - перекрашивание. Происходит когда:
Изменение свойств background-color, border-color или visibility.
Изменение box-shadow, outline или color элемента.
Изменение opacity, преобразований transform или z-индекса.

Есть глобальные изменения, которые вызывают полную перекомпнаовку/перерисовку, а есть грязные элементы, 
это те элементы, которые были изменены, и их дочерние элементы.

Вывод: 
1) стараться использовать transform, opacity, visibility вместо left, display.
2) Let coords = el.getBoundingClientRect() / offsetWidth / scrollTop. И работать с переменной а не с дом элементом.
3) Для анимаций лучше подойдет requestAnimationFrame а не setInterval.
*/

/* Что такое виртуал дом. Как работает реакт. Что такое Reconciliation.
Реакт это библиотека, а не фраймворк. Он более производителен т.к. работаем с виртуальным DOM, а не реальным.
Реакту отдается не jsx, а js. Компонент отдает jsx, компилятор Babel преобразует его в обычный js и передает в React.
React строит виртуальный DOM. Виртуальный DOM — это легковесное представление реального DOM в памяти.
Reconciliation - это алгоритм «согласования», который принимает решение о повторном рендеринге компонента.
1)При первом запуске приложения React собирает первое виртуальное дерево (Current tree)
и в среде Rendering Enviorement отрисовывает первое реальное DOM-дерево (стартовую веб-страницу).
2) Когда на сайте происходят изменения, строится новое виртуальное дерево (Work-in-progress tree).
3) Новое дерево сравнивается с Current tree для определения различий - процесс называется diffing.
4) Эти различия передаются в среду Rendering Enviorement для повторной отрисовки и обновления DOM.
5) Теперь Work-in-progress tree превращается в Current tree до следующего изменения, где данный цикл повторится.
Реакт производит более точечный перерендер, вместо глобального reflow/repaint что и оптимизирует работу.
Так же если тип элемента не изменился (с дива на спан), а изменился только класс/атрибут/стиль(конкретное св-во), 
то реакт лишь изменит это св-во в стилях, а другие стили оставит без изменения.
Ключи key нужны что бы реакт опозновал динамически изменяющиеся элементы и точечно вносил изменения. 
Если список полностью статичен(длина массива не меняется, элементы не перемещаются), то можно использовать индекс элемента.
*/

/* Жизненный цикл функционального компонента в React
-------------------------------Жизненный цикл функционального компонента в React------------------------------------------
В классовых компонентах есть методы. А в функциональных для этого есть useEffect.
1)render
2)component will mount     - синхронно выполняет код React при загрузке/монтировании компонента.
    Используется для отображение загрузчика. Устарел и не используется т.к. там были проблемы.
3)component did mount      - запускается после того, как компонент был смонтирован один раз.
    Используется для получение данных с сервера и настройки слушателей событий (window.addEventListener)
4)component did update     - запускается при обновлении данных
5)component will unmount   - запускается при размантировании компонента.
    Используется для удаления слушателей событий, setInterval setTimeout, websoketов


const App => () {
    console.log('render')                           1

    useEffect(() => {
        console.log('component did mount')          3
    }, [])

    useEffect(() => {
        const timerId = setTimeout...
        window.addEventListener('resize', func)
        return () => {
            console.log('component will unmount')   5
            clearTimeout(timerId)
            window.removeEventListener('resize', func)
        }
    }, [])

    const [count, setCount] = useState()
    useEffect(() => {
        console.log('component did update')         4
    }, [count])

    return <></>
}
*/

/* Способы оптимизации реакт компонентов. Управляемые и неуправляемые компоненты.
1) Обернуть в memo и useCallBack
2) Использовать уникальные key, а не индекс. Только если это не статический элемент.
3) Вместо управляемого компонента инпута сделать его не управляемым и брать данные напрямую.
let inputRef = useRef(null);
useEffect(()=> {
    let value = inputRef.current.value;
}, [])
<input ref={inputRef} />
 */

/* react <StrictMode> | <Suspense><lazyComponent> | property drilling | pure function 
------------------------------------<StrictMode> </StrictMode>-----------------------------
монтирует компонент дважды. Нужно для выявления ошибок, для оптимизации помяти и оптимизации запросов на сервер.
Например, если забудем удалить таймер у setinterval, то увидим удвоение значения. Если бы компонент монтировался один раз
то мы бы это даже не увидили, а память бы была занята лишними данными.
аналогично с слушателями событий и запросами на сервер. Например у нас запрос идет не пол секунды, а скажем пол минуты,
за это время успеваем размонтировать компонент и у нас повторяется запрос дважды (смотри вкладку нетворк).
Либо пользователь уходит со страницы, а запрос продолжает выполняться.
Что бы этого избежать используем аборт контроллер - встроенный js объект для отмены запроса.
    const abortController = new AbortController();              //Создаем экземпляр объекта
    const signal = abortController.signal;                      //У него есть св-во сигнал и метод аборт()
    fetch('', { signal: signal }).then(res => res.json());      //Передаем сигнал в тело фетч запроса
    return () => {
        abortController.abort('комментарий, причина отмены запроса')    //Прерываем запрос через аборт.
    }
---------------------------------<Suspense><lazyComponent> - </lazyComponent></Suspense>-----------------------
это инструменты в React, которые позволяют лениво загружать компоненты, то есть только тогда, когда они действительно нужны.
но я обычно использовал ф-ю очистки в useEffect, поэтому с этим не работал.
----------------------------------property drilling-----------------------
Передача пропсов от родителя к дочерним элементам через множетсво других компонентов, которым эти пропсы не нужны.
Решение - использование useContext или стейтменеджера.
-----------------------------pure function (чистые функции)-----------------------------------------------
- это ф-я которая соответствует двум критериям
1) Она занимается только своими делами, не взаимодействует с внешнем миром
2) При одинаковых входных данных всегда одни и теже выходные данные.
    export default function double(num) {
        return 2 * num;
    }
А вот не чистая ф-я т.к. она берет переменную извне.
    let counter = 0;
    export default function increment() {
        counter++;
        return counter;
    }
Либо ф-я со сторонними эффектами (onclick, useeffect).
Что бы превратить ф-ю в чистую нужно передавать ей значений через пропс
    export default function increment(num) {
        num++;
        return num;
    }
*/

/* SVG в React Vite
--------------------------------SVG-----------------------------
В React просто import {ReactComponents as NAME} from 'name.svg'
    Теперь используем как компонент <NAME />
В Vite npm i --save-dev vite-plugin-svgr
    Идем в vite.config.js:
        import svgr from 'vite-plugin-svgr';
        ...
            plugins: [react(), svgr()]
        ...
    Теперь в компонентах import ICON from 'name.svg?react'
    <ICON width="50" ... />         даст svg
    <img src={ICON} />              даст обычную картинку
    {ICON}                          ошибка.
*/

/* Автопрефиксер в React
-------------------------------Автопрефиксер--------------------------
1) Установка (autoprefixer и postcss в --save-dev) npm i autoprefixer postcss -D
2) В vite.config.js
    import autoprefixer from 'autoprefixer'
    export default defineConfig({
        plugins: ....,
        css: {
            postcss: {plugins: [autoprefixer]}      Без круглых скобок!
        }
    });
3) Выбор версий браузеров в package.json
    {
        "name": ...
        "scripts": ...
        "browserslist": ["Safari >= 5", "iOS >= 5", "not ie <= 10", "> 1%"]
    }
*/

/* Компоненты высшего порядка hocs
----------------------------Компоненты высшего порядка hocs-------------------------
- это функция, которая принимает компонент и возвращает новый компонент. 
Она добавляет поведение, пропсы или логику к исходному компоненту — не изменяя его напрямую.
    const withExtraLogic = (Component) => {
        return function WrappedComponent(props) {
            // Добавляем пользовательское поведение здесь
            return <Component {...props} />;
        };
    };
Например загрузка скелетона при isLoading вместо основного компонента.

Есть основной компонент со стилями
    const Banner = ({ item }) => {
        return <div className="banner"></div>
    };
Есть скелетон со стилями. Который в зависимости от типа и кличества выводит нужный скелетон.
    const Skeleton = ({ count = 1, type = 'banner' }) => {
        return (
            <>
            {count > 1 ? (
                <ul className={styles.list}>
                    {[...Array(count)].map((_, index) => {
                        return <li key={index} className={type === 'banner' ? styles.banner : styles.item}></li>;
                    })}
                </ul>
            ) : (
                <li className={type === 'banner' ? styles.banner : styles.item}></li>
            )}
            </>
        );
    };
Есть хокс который использует этот скелетон и выводит в зависимости от isLoading
    import Skeleton from '../../components/Skeleton/Skeleton';
    const withSkeleton = (Component, type, count) => {
        return function WithSkeleton(props) {
            const { isLoading, ...restProps } = props;
            if (isLoading) {
            return <Skeleton type={type} count={count} />;
            }

            return <Component {...restProps} />;
        };
    };
    export default withSkeleton;
    (обрати внимание withSkeleton и WithSkeleton разные ф-и)
Этот хокс засовываем в основной компонет
    const Banner = ({ item }) => {
        return <div className="banner"></div>
    };
    const BannerWithSkeleton = withSkeleton(Banner, 'banner', 1);
    export defualt BannerWithSkeleton;
Т.к. экспорт дефолт, то имя не важно при импорте и можно назвать просто как баннер.
import Banner from '../../components/Banner/Banner'; - тут хранится баннер со скелетоном.

*/

/* useRef forwardRef React.cloneElement(children, { ref: useRef.current }) на примере слайдера
1) Оборачиваем в наш слайдер и задаем шаг скролла 200px
<Slider step={200}>
    <Categories />
</Slider>
2) Чилдрона оборачиваем в forwardRef и вторым аргументом после пропсов передаем реф.
Передаем реф нужной обертке которую хотим скролить.
const Categories = forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      {props.categories.map(category => <button key={category}>{category}</button>)}
    </div>
  );
});
Categories.displayName = 'Categories'; //иногда нужно задавать что бы не ругался реакт.
3) В универсальном слайдере создаем клоне реакт элемента, что бы его двигать и в него передаем чилдрен и реф.
const Slider = ({ children, step = 150 }) => {
  const sliderRef = useRef(null);
  const scrollLeft = () => {sliderRef.current.scrollLeft -= step};
  const scrollRight = () => {sliderRef.current.scrollLeft += step};
  return (
    <div className={styles.slider}>
      <button onClick={scrollLeft}>{'<'}</button>
      {React.cloneElement(children, { ref: sliderRef })}
      <button onClick={scrollRight}>{'>'}</button>
    </div>
  );
};
 */

/* GIT
---------------------------------------GIT------------------------------------
(Q + Enter) (ctrl + c) (ctrl + break) -выйти из git log. Я использую (Q + Enter).
git config --global                  -просмотр настроек для всех проектов
git config   и   git config --list   -просмотр настроек для проекта
git config --list --show-origin      -просмотр всех настроект.
git config --global init.defaultBranch main     -переименование главной ветки с мастера на main.

1) Установить с оф. сайта. Ввести git --version, чтобы убедиться, что Git установлен правильно.
2) Настроить (имя(обязательно), почта(обязательно), текстовый редактор(не обязательно)):
    git config --global user.name "Ваше Имя"
    git config --global user.email "ваш@почта.com"
    git config --global core.editor "С:.../.../notepad.exe" - абсолютный путь.
    git config user.name просмотр установленного имена для проекта
3) Создание репозиториев (удаленный - УР, локальный - ЛР) и их соединение.
    А) Создаем локальный репозиторий. 
        Создаем папку с проектом и открываем ее в терминале.
        git init    - создаст скрытую папку .git со всеми данными коммитов и т.п.
        идем на гитхаб и создаем там пустой репозиторий
        git remote add origin https://github.com/......git      -соединяем наш ЛК с УР
    Б) Либо что бы скачать УР на ЛР.
        Создаем папку с проектом и открываем ее в терминале.
        git init
        git clone https://github.com/IlyaSeregin25/CinemaReact.git
        соединять через remote ненужно.
    В) Выгрузка из ЛР в УР:
        ctrl+s
        git add .
        git commit -m "комментарий"
        git push origin main        origin - путь к УР, main - имя ветки.
    Г) Загрузка из УР в ЛР
        git pull origin master      master - имя ветки
4) Pull request и Merge request - запрос на слияние веток. Делается в гитхабе, что бы без разрешения никто не сливал.
    4.1) Сохраняем на ЛР и УР свою ветку
    4.2) Заходим на гитхаб, слева сверху "Pull request". Потом справа сверху зеленая кнопка "New Pull request"
    4.3) Указываем из какой ветки в какую хотим сделать merge.
    4.4) Ждем разрешение остальных участников.
5) Основные команды.
Удаление файлов:
    git rm text.txt                 -Вручную не удалять т.к. статус не проиндексируется.
Перемещение/переименование файлов:
    git mv old.txt new.txt          -Вручную не перемещать. В ОС команда mv = Перемещение = Переименование
Сохранение изменений:
    ctrl+s                          - статус файла "модифицируемый"
    git add . или git add имяфайла  - статус файла "индексируемый"
    git commit -m "комментарий"     - коментируются только индексируемые файлы.
Ветки:
    git branch                      - просмотр всех веток
    git branch имя новой ветки      - создание новой ветки
    git checkout имя ветки          - переключения между ветками
    git checkout -b имя ветки       - создание новой ветки и переход на нее
    git branch -d имя ветки         - удаление ветки
    * - будет показывать на какой ветке сейчас находимся.
Просмотр:
    git log    или    git log -3    - просмотр всех/3ех последних коммитов.
    git checkout №хэш               - переход к нужному коммиту (у коммита есть хэш номер)
Слияние веток:
    git checkout main               - переходим в ветку куда сливаем изменения
    а) git merge имя ветки           - все изменения войдут как 1 новый коммит
    б) git rebase имя ветки          - сохраняет все коммиты
Переменование ветки:
    git --move oldName newName
Перенос отдельного коммита из ветки1 в ветку2
    git checkout ветка2             - переходим в ветку куда заливаем коммит
    git cherry-pick №хэш            - добавляем коммит
Решение конфликтов:
    а) решаем вручную, а после ctrl+s, git add ., git commit -m "комментарий"
    б) решаем через IDE, а коммит он сделает сам.
Отмена действий:
    git revert №хэш                 - вернемся ко значению до этого коммита. После этого редактор попросит сделать коммит.
    git reset --soft №хэш           - все изменения остаются, удаляются только история коммитов до выбранного коммита.
    git reset --hard №хэш           - полностью откатываемся к выбранному коммиту. История коммитов тоже стирается.
Сохранение в буферной зоне: 
    Допустим забыли выйти из ветки feature и ведем разработку в ней. 
    Далее хотим перейти в ветку develop, создать от него новую ветку и в новою ветку сохранить все изменения. 
    Однако при попытки перейти в develop гит попросит закоммитеть наши изменения, но мы не хотим их сохранять в текущую ветку.
    Поэтому в ветке feature делаем "git stash", переходим в ветку develop, создаем новую ветку и переходим в нее,
    далее в ней делаем "git stash pop" и далее сохраняем и коммитем все изменения.
    git stash                       - вырезать изменения
    git stash pop                   - вставить вырезанные изменения

GitFlow - последовательность работы с гитом
1) Создать репозиторий на гитхаб и клонировать его в ЛР либо инициализировать.
2) Создать ветку разработки develop от главной ветки main(master).
3) Создать от ветки develop ветки с фичами "feature/имя-фичи" и мержить их в develop.
4) Создание ветки release/0.1.0 от develop. 
5) В ветке релиза нильзя добавлять новые фичи, можно только исправлять баги.
6) Когда ветка релиза закончена, она мержится в develop и удаляется.
7) Ветка develop мержится в main.
8) Если в ветке main обнаружены ошибки, то создает hotfix-ветка.
9) Когда ошибки исправлены ветка hotfix мержится и в main и в develop, а саму ветку удаляют.
Удаление ветки: 

Рекомендации:
1) Используйте 
    git status  для проверки состояния файлов
    git diff    для просмотра внесенных изменений.
2) Делать регулярные коммиты с небольшими изменениями.
3) Не работайть в основной ветке, вместо этого создавайте новые ветки для каждой задачи.
4) Прежде чем сливать ветки, убедитесь, что ваша текущая ветка не противоречит изменениям в основной ветке. 
Используйте git merge осторожно и всегда готовьтесь к решению конфликтов.
5) не игнорируйте файл .gitignore

Если ошибка remote: Permission to .git denied to IlyaBybnov. 
возникает когда меняем аккаунт на гитхабе, то решаем эту проблему новым именем так
git config user.name "new name"
git config credential.username "new name"
а потом опять пушем ветку

Элиасы [alias]:
Идем в папку с -> Пользователи -> Илья -> .gitconfig и в нем пишем
[alias]
    l = log
Теперь вместо "git log" можем писать "git l". Важно: слово git сокращать до g нельзя.

Игнорирование:
Файл .gitignore, в нем указываем что игнорировать
/debug.log                      игнор debug.log в корне папки, но не в других разделах
debug.log                       игнор debug.log во всех папках
logs                            игнор всех папок logs
двеЗвездочкиУмножить/logs       игнор папок содержащих logs
!logs                           отмена игнора
*/

/* Prettier и ESLint
----------------------Линтеры и форматеры (Prettier и ESLint)------------------------------
https://result.school/roadmap/frontend/article/eslint-i-kak-on-pomozhet-uluchshit-kod?utm_source=youtube&utm_medium=vladilen&utm_campaign=video&utm_content=26_10_24

Prettier - это инструмент, который приводит код к единому стилю
ESLint - инструмент, который обнаруживает неточности в коде JS TS. Исправляет синтаксис, поддерживает много плагинов.
1) Установка. Нужно устанавливать и то и то в режим разработки:
    npm install eslint prettier --save-dev
2) Настройка ESLint (в vite уже усстановлен):
    Создаем файл .eslintrc.json в корне проекта либо
    eslint --init чтобы создать начальную конфигурацию либо 
    eslint:recommended
3) Настройка Prettier
    Создайте файл конфигурации .prettierrc в корне проекта
4) Интеграция ESLint с Prettier. Используйте плагин eslint-plugin-prettier. 
Он добавляет правила форматирования Prettier в ESLint.
5) Запуск и исправление ошибок. Используйте команды 
    eslint. и prettier --write. чтобы проанализировать и автоматически исправить файлы в проекте.
    Точка значит все файлы. У меня работает и с (ctrl + s)
Prettier: Нужно npm i prettier --save-dev
{
  "semi": true,
  "singleQuote": true,          одинарные ковычки
  "jsxSingleQuote": false,      
  "bracketSpacing": true,
  "trailingComma": "all",
  "printWidth": 120,            количество символов на строке включая табы
  "tabWidth": 2,                табуляция, кол-во символов.
  "arrowParens": "avoid",       до (num) =>, после num => . Скобки
  "endOfLine": "lf"
}
ESLint: Нужно npm i eslint --save-dev (в vite уже установлен в рекоммендованных настройках)
*/

/* DRY, KISS
------------------------------------Принципы для разработки: DRY, KISS-------------------------------
Don’t Repeat Yourself / Не повторяйтесь.
    1) Код не должен повторяться, разделять на модули.
    2) Принцип единой отвественности, каждый кусок кода отвечает только за одну ответственность. 
        Изменения одного компонента не должно ломать другие.
    3) Один источник истины - данные хранятся только в одном месте в одном экземпляре. 
        Если будет дубликат и случится какая то ошибка, то у нас будет два объекта с разными данными, какому объекту верить.
Keep It Simple, Stupid / Будь проще. 
    1) Код должен быть коротким и простым, разделять на модули.
    2) Избегать излишней сложности. Не надо делать кучу возможных поднастроеек если этого не требуется.
    3) Не загружать всю библиотеку если нужна только одна функция.
*/

/* use strict
-----------------------------------use strict-----------------------------------------------
1) Должен быть в самом начале кода приложения или функции. Выше могут быть только комментарии.
2) Отменить строгий режим невозможно.
3) В JS-модулях, которые появились в ES2015, строгий режим включён по умолчанию и включать его явным образом не нужно.
4) То, что в нестрогом режиме тихо даёт сбой, в строгом вызывает сообщение об ошибке.
Например:
    smth = 5;                   - неправильное присвоение, нету let/var/const
    delete Array.prototype;     - попытка присваивания/удаления значения свойству, предназначенному только для чтения. 
    let o = { a: 1, a: 2 };     - имена параметров функций/объектов должны быть уникальными
*/

/* Error + промисы + промисыЭвентЛуп
Промисы витки - каждый then создает новый виток эвент лупа с микротасками
У реджета витки then не пропускаются, а так же обрабатываются эвентлупом, но выводит только катч.
------------------------------------Error-----------------------------------------
1) TypeError:       delete Array.prototype; num.forEach()
    Недопустимый тип переменной/параметра
2) ReferenceError:  вызов переменной до её объявления в строгом режиме.
3) SyntaxError:     let a = 5; let a = 15; (а вот для const это будет TypeError)
    Недопустимый код. Одинаковые имена переменных, забыли закрыть скобки

Создание ошибок:
let err = new Error('Общая ошибка. Проверьте код')
У ошибки есть св-ва, которые можно переопределять.
    err.message     - 'Общая ошибка. Проверьте код'
    err.name        - Error
    err.message = '123', err.name = '321';  - переопределили.
Либо 
let err = new TypeError('text')/ReferenceError()/SyntaxError()
Создание ошибки код не ломает, ее надо вбросить, тогда произойдет исключительная ситуация.
throw new TypeError('text')
throw {name: 'имя ошибки', message: 'text'}
throw(new TypeError())

Чтобы код не падал, а продолжил работать нужно обрабатывать исключительные ситуации.
для СИНХРОННОГО кода        try {} catch (error) {} finally {код выполнится в любом случаи}
для АСИНХРОННОГО кода:
1) Колбек функции.
    function make(num, callback) {
        setTimeout(()=> {
            let arr = [];
            let err;
            arr[num] === undefined ? err = 'text' : err = null
            callback(arr[num], err)
        }, 500)
    }
    make(0, function(val, err) {
        err ? console.log(err) : console.log(val)
    })
    Проблема: callback hell при большой вложенности.
2) Промисы
    let promise = new Promise()                             -Промис, можем посмотреть console.log(promise) и его статус
    let promise = new Promise().then()                      -Промис, но console.log(promise) не адекватно работает

    let promise = new Promise(function(resolve, reject) {
        setTimeout(() => {
            let err = true;
            err ? reject() : resolve()
        }, 500)
    }).then(function(resolve) {}, function(reject) {
        console.log(0)                                    //выведет только 0, а в catch не пойдет, т.к. уже обработали ошибку
    }).catch(function(err) {console.log(-1)})
    // Ошибка обрабатывается в первом попавшемся обработчике ошибок, либо в then(..., (err)) либо catch().

    Вброс ошибок:
    let promise = new Promise(function(resolve, reject) {
        throw new Error()                                  // В синхронном коде можно выбрасывать
        setTimeout(() => {
            throw new Error()                              // Нельзя, нужно обязательно либо resolve либо reject.
            reject(new Error())                            // Можно
        }, 500)
    }).then(function(resolve) {
        throw new Error();                                 // В then можно вбрасывать ошибки, которые уйдут в обработчик.
    }).catch(function(err) {console.log(-1)})

    Состояние промиса: pending rejected fulfilled. Состояния (rejected fulfilled) НЕИЗМЕННЫ!
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {console.log("result"); resolve("result")}, 300);      
        setTimeout(() => {console.log("ignored"); reject("ignored")}, 100);     //reject сработает раньше
    });
    promise
        .then(
        result => console.log("0: " + result),
        ).then(
        result => console.log("Fulfilled1: " + result),
        error => console.log("Rejected1: " + error)
        ).then(
        result => console.log("Fulfilled2: " + result),
        error => console.log("Rejected2: " + error)
        ).catch(
        error => console.log("catch: " + error)
        ).then(
        result => console.log("Fulfilled3: " + result),
        error => console.log("Rejected3: " + error)
        );
        console.log(promise);                                                    //Состояние reject
        В консоли увидим: 
        ignored  Rejected1:ignored  Fulfilled2:undefined  Fulfilled3:undefined  result
        Т.е. сначало отрабатывает reject в промисе,
            попадаем в первый обработчик ошибки,
            от этого обработчика ошибки спускаемся вниз до конца по цепочке then(result) игнорируя обработчики ошибок,
            срабатывает resolve в промисе
            т.к. мы не делаем return, то там лежим undefined

        setTimeout(() => console.log(0), 0)
        let pr1 = new Promise((res) => {
            console.log('первыйПромис')
            setTimeout(() => {console.log(1); res(1)}, 200)
        }).then(res => console.log(11)).then(res => console.log(111));
        let pr2 = new Promise(res => console.log('второйПромис'));
        Сначало сработают тела промисов по очереди, потом фетч запросы. В данном случаи вместо них setTimeout кто быстрее
        первыйПромис    второйПромис    0   (1  11  111)    (setTimeout второго промиса)
        Если бы были фетч запросы, то это тоже промис. Сработало бы тело промиса фетч запроса, но в then бы не ушло.

    Методы промисов:
        let promises = [
        new Promise(resolve => setTimeout(() => resolve(10), 10)),
        new Promise(resolve => setTimeout(() => resolve(30), 30)),
        new Promise(resolve => setTimeout(() => resolve(20), 20)),
        ]
        let all = Promise.all(promises); 
        // Вернет новый промис с массивом, результаты всех промисов поочереди а не по времени [10,30,20]
        // Если есть хотя бы один reject, то вернет новый промис rejected с одним результатом.
        let race = Promise.race(promises); 
        // Вернет новый промис с результатом первого сработавшего промиса
        let prom = Promise.resolve('123')/Promise.reject('123');
        // Вернет новый сработавший промис resolve или reject.

    Проблема: promise hell
3) async await + try {} catch {} Ошибку обязательно вбрасывать, а не просто reject, что бы "try catch" ее увидел.
    async function func() {                        // Читает сверху вниз, по очереди ожидая выполнения каждого промиса
        let promise1 = await new Promise()   
        let promise2 = await new Promise()
    }
    async function func() {                        // Кто первый выбросит ошибку, тот и попадет в catch. Остальной код игнорится.
        try {
            let promise1 = await new Promise(1000сек).then(throw new Error())   // выпонится первый. Вызовет ошибку, код внизу игнор.
            let promise2 = await new Promise(10сек)                             // игнор
            console.log(1)                                                      // игнор
        } catch(err) {
            console.log(er)                         // увидим вброшенную ошибку promise1
        }
    }

    async function func() {
        try {
            let promise1 = await new Promise((resolve, reject) => {
                setTimeout(() => {reject(100)}, 1000);
            }).catch(err => {
                console.log(err)                            // выведет reject = 100
                throw new Error('1000ms');                  // вброс ошибки
            });
            код игнорируется т.к. вброшена ошибка
        } catch(er) {
            console.log(er)                                 // выведет ошибку
        }
    }
*/

/* Задачи на EventLoop
[   call stack  ]         [  WebApi  ]
[Queue(очередь): Задача1Б Задача2 ...]
тело промиса = async func = await = синхронной функции
then = микро задачи.

execution context - это специальная внутренняя структура данных которая в МОМЕНТ ВЫЗОВА ф-и 
сохраняет область видимости всех переменных, this объекта т.е. всю служебную информацию.

Есть три Блока: call stack, WebAPI, Queue (очередь). В stack кладутся данные всегда наверх стэка, а не вниз! 
Размер stack ограничен и равен около 10тыс элементов. Хотя некоторые движки браузеров позваляют выполнять
100тыс. операций в секунду. Превысить ограничение можно через рекурсию. 
Будет ошибка браузер о превышении размера стэк вызовов.

Паттерн следующий:
Первый тик: выполняется весь синхронный код. Синхр.код попадает в Stack, выполняется и сразу же Stack очищается. 
Все асинхр попадают в WebAPI. Когда весь синхронный код выполнился и Stack очистился, выполняются
асинхр ф-и внутри WebAPI. По мере выполнения они заполняют очередь кто быстрее тот и первее в очереди (Задача1, Задача2).
Второй тик: Задача1 из очереди отправляется в Stack. По аналогии сначало выполняется синх код, потом асинхр. 
Когда вся Задача1 выполнена (и синхр и асинхр код) стек очищается и готов принять следующую задачу из очереди (Задача2).
Т.о. заблокировать Stack можно через alert().
Очередь в действительности состоит из микро и макро задач. 
Микрозадачи: промисы (Promise.resolve()), await (т.к. под капотом промис)и явно созданные микрозадачи. 
К макрозадачам относят всё остальное, setTimeOut, клики, change input и прочие события.
Сначало выполняется синхронный код из Stack, потом все микрозадачи, потом одна макро задача, затем все микрозадачи, 
потом одна макро задача и так покругу. Пока Stack занят, рендер страницы блокируется. Всевозможные клики, callback не работают
async function = синхронный код, а вот внутри где await - микрозадача.
1)
console.log('start')
setTimeout(() => console.log('setTimeout'), 0)
new Promise((resolve, reject) => {
    console.log('promise');
    setTimeout(() => {
        console.log('promiseSetTimeout');
        resolve()
    }, 100)
}).then((res) => console.log('then1'))
console.log('end')
2)
console.log('start')
setTimeout(() => console.log('setTimeout'), 0)
new Promise((resolve, reject) => {
    console.log('promise');
    setTimeout(() => console.log('promiseSetTimeout'), 100)
    resolve()
}).then((res) => console.log('then1'))
console.log('end')
3)
console.log('start')
setTimeout(() => console.log('setTimeout'), 0)
new Promise((resolve, reject) => {
    console.log('promise');
    setTimeout(() => {
        console.log('promiseResolve')
        resolve()
    }, 100)
    setTimeout(() => {
        console.log('promiseReject')
        reject()
    }, 10)
}).then((res) => console.log('then1Result'), (err) => console.log('then1Error')
).then((res) => console.log('then2Result'), (err) => console.log('then2Error'))
console.log('end')
4)
async function name(params) {
    console.log('asyncFuncStart')
    await new Promise((resolve, reject) => {
        console.log('promise');
        setTimeout(() => {
            console.log('promiseResolve')
        }, 100)
        resolve()
        setTimeout(() => {
            console.log('promiseReject')
            reject()
        }, 10)
    }).then((res) => console.log('then1Result'), (err) => console.log('then1Error')
    ).then((res) => console.log('then2Result'), (err) => console.log('then2Error'))
    console.log('asyncFuncEnd')
}
name()
5)
console.log('start')
setTimeout(() => console.log('setTimeout'), 0)
async function name(params) {
    console.log('asyncFuncStart')
    await new Promise((resolve, reject) => {
        console.log('promise');
        setTimeout(() => {
            console.log('promiseResolve')
            resolve()
        }, 100)
        setTimeout(() => {
            console.log('promiseReject')
            reject()
        }, 10)
    }).then((res) => console.log('then1Result'), (err) => console.log('then1Error')
    ).then((res) => console.log('then2Result'), (err) => console.log('then2Error'))
    console.log('asyncFuncEnd')
}
console.log('end')
name()
6)
name()
console.log('start')
setTimeout(() => console.log('setTimeout'), 0)
async function name(params) {
    console.log('asyncFuncStart')
    await new Promise((resolve, reject) => {
        console.log('promise');
        setTimeout(() => {
            console.log('promiseResolve')
            resolve()
        }, 100)
        setTimeout(() => {
            console.log('promiseReject')
            reject()
        }, 10)
    }).then((res) => console.log('then1Result'), (err) => console.log('then1Error')
    ).then((res) => console.log('then2Result'), (err) => console.log('then2Error'))
    console.log('asyncFuncEnd')
}
console.log('end')
*/

/* События: keyDown | keyPress | input | pointer
keyDown: 
    Получаем точное имя клавиши в любом регистре на любом языке через ev.key, в т.ч. точка. 
    keyCode для обычных клавиш не используем т.к. язык и регистр он не различает.
    Мат.знаки получаем через ev.key. Для обычной и правой клавиатуры кейкод отличается, но есть.
    Знаки через клавишу шифт (!""@ и др) получаем и по символу и по коду.
    Клавиши Enter(13) Backspace(8) shift(16) ctrl(17) alt(18) через ev.key или ev.keyCode. Клавиатура не важна. 
    Клавишу Пробел получаем только через ev.keyCode = 32. Клавиатура не важна.
    ev.keyShift - true/false
keyPress:
    Работают только основные клавиши, Enter, пробел, keyShift. Работает как ev.key так и ev.keyCode. Различает регистр, язык.
    Клавиатура основная правая не имеет значение. Так же можно получать клавиши через шифт (!""@ и др) и так и так.
    Клавиши shift ctrl alt можно отлавливать через ev.keyShift - true/false.
    Клавиши Backspace Esc и другие вообще не вызывают событие.
input:
    Срабатывает при изменении в инпуте. Если он пустой, то Backspace не вызывет событие. Данные лежат в ev.data, кодов нет.
    события copy cut paste могут вызвать событие input если вносят изменение в содержимое инпута, но что бы получить доступ
    к самим данным, нужно вешать слушатели на эти самые события и внутри них уже 
    let data =  ev.clipboardData || window.clipboardData   ev.clipboardData.getData("Text"). 
    А в событии input к этим данным доступа нет.
pointer:
    Аналог dragAndDrop, работает и с мышью и с пальцем (touch) и с сенсорным пером.
    pointerup pointerdown pointermove pointercancel - хорошо подходит для слайдов.
    
** - непонятный символ.
keydown: 
ev.key:q  ev.keyCode:81   String.fromCharCode(key):    String.fromCharCode(keyCode):Q
ev.key:Q  ev.keyCode:81   String.fromCharCode(key):    String.fromCharCode(keyCode):Q
ev.key:1  ev.keyCode:49   String.fromCharCode(key):**  String.fromCharCode(keyCode):1     Обычная клавиатура
ev.key:1  ev.keyCode:97   String.fromCharCode(key):**  String.fromCharCode(keyCode):a     Правая клавиатура
ev.key:-  ev.keyCode:189  String.fromCharCode(key):    String.fromCharCode(keyCode):**    Знаки - = обычная клавиатура
ev.key:/  ev.keyCode:111  String.fromCharCode(key):    String.fromCharCode(keyCode):o     Знаки - + / * правая клавиатура
ev.key:Enter      ev.keyCode:13  String.fromCharcode(key): String.fromCharcode(keyCode):      Enter обе клавиатуры 
ev.key:Backspace  ev.keyCode:8   String.fromCharcode(key): String.fromCharcode(keyCode):**    Backspace
ev.key:           ev.keyCode:32  String.fromCharcode(key): String.fromCharcode(keyCode):      Пробел
ev.key:Shift      ev.keyCode:16  String.fromCharcode(key): String.fromCharcode(keyCode):**    shift alt ctrl - обе клавиатуры
ev.key:й  ev.keyCode:81  String.fromCharcode(key): String.fromCharcode(keyCode):Q         Русский язык
ev.key:Й  ev.keyCode:81  String.fromCharcode(key): String.fromCharcode(keyCode):Q         Русский язык
ev.keyShift: true -при нажатии shift и false если любая другая.

keypress:
ev.key:q  ev.keyCode:113  String.fromCharCode(key):     String.fromCharCode(keyCode):q
ev.key:Q  ev.keyCode:81  String.fromCharCode(key):      String.fromCharCode(keyCode):Q
ev.key:1  ev.keyCode:49  String.fromCharCode(key):**    String.fromCharCode(keyCode):1     Обычная и правая клавиатура
ev.key:-  ev.keyCode:45  String.fromCharCode(key):      String.fromCharCode(keyCode):-     Обычная и правая клавиатура
ev.key:Enter  ev.keyCode:13  String.fromCharCode(key):  String.fromCharCode(keyCode):      Enter обе клавиатуры
ev.key:           ev.keyCode:32  String.fromCharcode(key): String.fromCharcode(keyCode):   Пробел
ev.keyShift: true -при нажатии shift и false если любая другая.
*/

/* TypeScript
----------------------------------TypeScript------------------------------
JS - интерпритируемый (нужен компилятор) слаботипизированный (приводит типы при нестрогом сравнении) 
с динамической (работает в рантайме runtime, т.е. тип переменной может меняться) типизацией
TS - строготипизированный со статической типизацией.
Массив из разных значений:
    let arr:(string | number)[] = [1, 's', ....];   
    let arr: Array<string | number> = [1, 's', ....];
    let iuser: IUser = {...}
    let arr: IUser[] = [iuser]; arr.push(iuser);

                            СУЖЕНИЕ типов, значений:
Литеральные строки, т.е. определенные значения чисел, строк:
    function f1(x:5) {};     function f1(x:'caddas') {}; 
Union строки (объединенные):
    function f1(x: 5 | 1) {};    function f1(x: 'yes' | 'no') {}
Объединенные строки, типы:
    type TRole = 'admin' | 'user';      type TType1 = number | string;
Оператора объединения и пересечения | и &    
type t1 = { curse: string };
type t2 = { name: string; age: number };
type t3 = t1 | t2;          //Любая комбинация любых полей {name} {name curse} {name age curse}
type t4 = t1 & t2;          //Обязательно все поля  {name age curse}

1) Отличие интерфейсов (interface) от типов (type). (расположение в документе не важно)
    1) Наследование: 
        interface IUser2 extends IUser {age:number};    Для интерфесов extends
        type TUser2 = TUser & {age:number};             Для типов оператор &
    2) Если написать два экземпляра с одинаковыми именами, то интерфейсы объединятся в один, а типы выдадут ошибку.
        Мы можем создать IUser незная что в другом файле он уже есть. Поэтому лучше использовать Типы.
    3) Типы можем записать в одну строчку как объединение типов: 
        type TRole = 'admin' | 'user';   type TUser3 = TUser1 | TUser2;
        У интерфейсов нет знака равно, поэтому не можем испольовать |. 
    4) Внутри самих и типов и интерфейсов можем использовать |.

    type TRole = 'admin' | 'user';
    interface IUser {name: string; age: number};
    interface IUserWithRole extends User {role: Role}

2) Особенности использования оператора | в функциях: 
    а) необходимо дописать undefined или null для ф-й.
        function func(val:string): string | number | null {
            if (val === 'ok') return val;
            if (val === 'error') return 10;
            return null;
        }
    б) необходимо делать доп проверки на тип.
        let f = func('ok');
        f.charAt(1);                    //Ошибка, т.к. там может быть string | number | null
        if (typeof f === 'string') {
            f.charAt(1);                //Теперь ошибки нет.
        }
    Это усложняет код, поэтому | стоит избегать в функциях.

3) Пример работы с типами/интерфейсами
    type TUser = {
        name: string;
        age: string | number;
        f1: (val: string) => string;
        f2: (val: string) => {data: number};    Возварщаем объект с data.
        f3: (data: {status: string | number}) => {status: string | number} | undefined;       //undefined
    }
    let tuser: TUser = {
        name: 'Alex',
        age: 5,
        f1: (val = 'a') => {return val},
        f2: (val = 'a') => {return {data: val.length}},
        f3: (data) => {
            if (data.status === 'ok') return {status: data.status};
            if (data.status === 5) return {status: data.status};           
        },                                                              //ф-я вернет undefined если ничего нет.
    }
4) Кастование типов (когда используем библиотеки, у которых плохо описаны типы):
например мы импортировали ф-ю qwerty(), которая возвращает булевое значение.
    let data: boolean = qwerty('ok');       //Ошибка, тс ругается.
    Есть 4 способа заткнуть тс.
    а) использовать комментарий // @ts-ignore и тс проигнорирует следующую строчку кода.
        // @ts-ignore
        let data: boolean = qwerty('ok');
    б) использовать тип any, который отключает типизацию у переменной data навсегда. Не лучший вариант.
        let data: any = qwerty('ok');
        data.foreach()  data.charAt()   всё можно прминить т.к. типизация отключена
    в) использовать type guard. Но тут это не будем рассматривать
    г) использовать кастование типов as unknown as любой тип
        let data = qwerty('ok') as unknown;                Сначало приводим к типу я хз что там лежит
        let data = qwerty('ok') as unknown as boolean;     Потом приводим к нужному типу
        data.charAt(1); - OK    data.foreach() - Ошибка т.к. это строка.
        Сразу привести к нужному типу не получится (раньше работало). Сначало unknown потом нужный тип!
    Мы можем использовать кастование (буква г) в ограниченных случаях:
    а) Когда получаем данные извне тип которых неизвестен.
        let data = qwerty('ok') as unknown as boolean;
    б) После создания массива или когда хотим обратиться к елементу, которого нет.
        let one = [] as unknown as boolean;     теперь это булево значение, а не массив.
        (one as unknown as [1,2,3])[1];
    в) После создания объекта или когда хотим обратиться к св-ву, которого нет.
        let two = {} as unknown as boolean;
        (two as unknown as {name: string}).name     //круглые скобочки

5) Enum
    можем хранить только строки и числа.
    enum user {name = 'Alex', age = 20};    //конвертируются в обычном js во что то страшное. Не используем.
    А вот константные енамы можем использовать.
    Если какое то поле не используется, то оно не конвертируется в js и не засоряет память и сам енам не хранится в коде.
    const enum user {name = 'Alex', age = 20};      //В js ничего не будет.
    if (user.name === 'Alex') {}                    //В js: if ("Alex" / user.name / === 'Alex') {}
    при этом при минификации комментарии удаляются поэтому там останется if ("Alex" === 'Alex') {}
    Пример использования:
        const enum Status {NOT_FOUND = 404, SUCCESS = 200, ERROR = 500};
        const enum ErrorInfo {empty = 'вы не заполнили поле', unknown_symbols = '', min_length = ''};
    
6) Enum или Объекты: если хотим хранить массив, функции, спред операторы, то используем объекты.

7) Utility type - можем и типы и переменные.
    есть еще capitalize uppercase lowercase.
    а)type partialType = Partial<TUser>;        //делает все св-ва опциональными(необязательными т.е.?)
    б)type requiredType = Required<TUser>;      //делает все св-ва обязательными
    в)type readonlyType = Readonly<TUser>;      //делает все св-ва readonly
    г)const smthRecord: Record<number,string> = {22:'apple'}    //задает тип ключам и значениям.
    в)const profilePick: Pick<IProfile, 'name' | 'age'> = {name: 'name', age: 20}     //Берет эти поля
    г)const profileOmit: Omit<IProfile, 'name' | 'age'> = {isOwner: true}    //Удаляет эти поля
    д)получение типа, который возвращает функция
        function f1 (val:string):number {return 5};
        let data: {f2: (val:string) => number } = {f2: function(val) {return 5} }
        type returnType1 = ReturnType<typeof f1>;               //из функции
        type returnType2 = ReturnType<typeof data['f2']>;       //из функции объекта
    е)NonNullable<> - избавление от undefined/null
        let data: {f2?: (val:string) => number }        //тут опциональное св-во
        type returnType2 = ReturnType<NonNullable<typeof data['f2']>>;
8) Типы данных
    any - отключает типизацию. Плохая практика.
    unknown - нам не изестно какой тип данных придет с сервера. В дальнейшем нужно доказать тс
        if (typeof data === 'number) data + 10;
        if (data instanceof Object && 'f1' in data && typeof data.f1 === 'function') data.f1();
    void - нам все равно что возвращает ф-я. Если указать any, то тоже будет работать,
    но нам не понятно, тот кто писал ф-ю просто не захотел описывать нормально ф-ю или 
    она действительно ничего не возвращает. Поэтому лучше прямо указать void что ф-я ничего не возвращает.
    never - подсказать тс что такая ситуация никогда не произойдет
        function Strore(): string {Условие return data}    Так не можем написать, ф-я по умолчанию может вернуть undefined
        function Strore(): string |undefined {Условие return data}    или вручную возвращаем null
        function Strore(): string |null {Условие return data; return null}    или вручную возвращаем null
        Но теперь когда мы будем использовать ф-ю Strore() нам везде нужно будет учитывать ситуацию когда ф-я вернет null\undefined
        хотя нашей логикой вообще не предусмотрено что ф-я может такое возвращать.
        function Strore(): string | never {Условие return data; throw new Error()}   Тоже самое но теперь ненадо писать проверки.
            И второй вариант:
        type Currency = 'USD' | 'Rub';       //Если добавить условие | 'qwerty'
        function getCurrency(val: Currency): string | never {
            if (val === 'Rub') return 'P';
            if (val === 'USD') return '$';

            const _smthName: never = val;    //То тут тс будет ругаться, мол в val лежит строка qwerty которая не равна невер
            throw new Error();
        }
        _нижнееПодчеркивание - что бы IDE не ругался на "Переменная объявлена но не используется"

9) Обработка ошибки
    try {} catch(error) {
        if (error instanceof Object && 'f1' in data && typeof error.f1 === 'function') error.f1();
    }
10) Type guard (проверка типа)      asserts condition (не изменяет тип)       asserts value is type (изменяет тип)
    Type guard - что бы тайпскрипту доказать, что значение которое прилетает не unknown а конкретный тип MyError при помощи оператора is.
    type MyError = {message: string, status: number};
    try {
        console.log(1)
    } catch (err) {
            //Надо описать все поля MyError, что сложно и занимает много места, а можно вынести в отдельную ф-ю.
        if (err instanceof Object && 'message' in err && typeof err.message === 'string') {     
            console.log(2)
            console.log(err.status)
        }
    }

    Утиная рутина - если что то крякает, то это удка. Не надо доказывать что у нее есть 2лапы, 2 крыла и т.д.
    Берем пару уникальных полей и доказываем что они есть.
        type MyError = {specialString: string, message: string, status: number};
        function isMyError(value: unknown): value is MyError {
            return value instanceof Object && 'specialString' in value;     //Утиная рутина.
        }
        try {
            console.log(1)
        } catch (err) {
            if (isMyError(err)) {           //если тру, то провалимся в это условие.
                console.log(err.status)
            }
        }

    asserts condition (проверяет тип не изменяя его и выбрасывает ошибку)
        function assertNonNull(value: unknown): asserts value {
            if (value === null || value === undefined) throw new Error('')
        }

    asserts value is type (проверяет тип изменяет тип)
    type User = {name: string}
    function assertIsUser(data: any): asserts data is User {
        if (typeof data !== 'object' || data !== null) throw new Error('Object expected')
        if (typeof data.name !== 'string') throw new Error('Property "name" must be a "string"')
    }

11) as const - говорим что объект/массив теперь является константным объектом и его значения не меняются т.е. тип readonly.
    const DATA1: string[] = ['USD', 'Rub'];         //Обычный массив
    const DATA2 = ['USD', 'Rub'] as const;          //Константный массив
    const OBJ1 = { val1: 'USD', val2: 'Rub' };
    const OBJ2 = { val1: 'USD', val2: 'Rub' } as const;
    function getSmt(val: 'USD' | 'Rub'): void {}
    getSmt(DATA1[0]);                               //Ошибка, мы передаем какую то сроку а в описании можем только литеральную.
    getSmt(DATA2[0]);                               //Всё ок, мы передаем определенную неизменную строку.
    DATA2.push(2)                                   //Ошибка, константные объекты нельзя изменять
    getSmt(OBJ1.val1);                              //Ошибка
    getSmt(OBJ2.val1);                              //Всё ок
12) readonly | as const и ТОЧЕЧНЫЕ поля (обязательные, только чтение)
    readonly применяем для типов и не забываем про <>
        type TProsto = {v1: string, v2: number};
        type TReadOncly = Readonly<{v1: string, v2: number}>;
    as const применяем для переменных.
    Если хотим создать тип с выборочными ридонли, то пишем перед полем.
        type T1 = {readonly v1: string, v2: number};
13) tuple - тапл - кортедж - массив задонной длины const arr: [number, number] = [1, 2] - массив из вдух чисел.
    Можно использовать в плюрал - 
    const PLURAL: [string, string, string] = ['товар', 'товара', 'товаров'];
    function plural(ind: number, arr: [string, string, string]): string {
        return arr[ind];
    }
    plural(2, PLURAL);
14) typeof keyof
    keyof - берет ключи ТОЛЬКО у интерфейсов и типов т.е. работает только с тайпскриптом.
        type Ttype = { n1: string; a1: number };
        type Tkeyof = keyof Ttype;                  //тут теперь лежат n1 | a1
        const res1: Tkeyof = 'gsad';                //Ошибка
    typeof - преобразует js код в тайскрипт типы. Можем применять ко всему угодно, и к объектам и к функциям.
        const SITTINGS = { duration: 5000, controls: ['play', 'pause'] };
        type Ttype = typeof SITTINGS;                  //тут теперь лежит { duration: number; controls: string[] }
        function renderVideoElement(settings: Ttype): void {}
        renderVideoElement(SITTINGS);
    Таким образом:
        const SITTINGS = { duration: 5000, controls: ['play', 'pause'] };
        type TSittings = { duration: number; controls: string[] };
        type T1 = keyof TSittings;          //берем ключи у ts кода 'duration' | 'controls'
        type T2 = typeof SITTINGS;          //берем тип полей у js кода { duration: number; controls: string[] }
        type T3 = keyof typeof SITTINGS;    //берем ключи у js кода 'duration' | 'controls'
    Перебор объекта
        const user = { name: 'alex', age: 20 };
        for (let userKey in user) {
            const key1 = userKey;                           //абстрактные string - баг
            const key2 = userKey as keyof typeof user;      //'name' | 'age' 
            //(как ключ от юзера, т.к. keyof работает ток с тс то преобразуем юзер в typeof user)
            const value1 = user[key1]                        //any
            const value2 = user[key2]                        //string | number
        }
15) typeof и ReturnType<>
    typeof - описываем всю ф-ю
    ReturnType<> - описывает только тип возвращаемого результата.
        function f1(val: string):number {return 10};
        type T1 = typeof f1                             //type T1 = (val: string) => number
        type T2 = ReturnType<typeof f1>                 //type T2 = number
        type T30 = ReturnType<f1>                       //Ошибка синтексиса, нужно описывать полностью
        type T31 = ReturnType<(val: string) =>number>   //type T30 = number

    type TGetUserBalanceReturnData = { id: number; balance: number };
    function getUserBalance(id:number): TGetUserBalanceReturnData {...fetch  return { id: 0, balance: 100 }}
    const balance = getUserBalance();
    function renderBalance(                             //Разницы почти нет что использовать
        data: typeof balance                            //Иногда не имеем доступа к переменной balance
        data: ReturnType<typeof getUserBalance>,        //Всегда имеем доступ getUserBalance, используется ЧАЩЕ ВСЕГО.
        data: TGetUserBalanceReturnData                 //Если используем сторонние библиотеки то не всегда имеем доступ.
    ): string {return `${data.balance}`}
    renderBalance(balance);

    type param = Parameters<typeof getUserBalance>      //[id: number] Если хотим достать параметры.
16) ReturnType<> и Parameters<> 
    Напрямую ф-ю вписать не можем т.к. ф-я это обычный js. Его надо преобразовать в тс с помощью typeof.
    function getUserBalance(id:number): TGetUserBalanceReturnData {...fetch  return { id: 0, balance: 100 }}
    type return = ReturnType<typeof getUserBalance> - вернет возвращаемый тип TGetUserBalanceReturnData
    type param = Parameters<typeof getUserBalance>  - вернет массив параметров [id: number]
    param[0] - с нулевым индексом лежит айди.
17) Mapped types и Record<> - указываем типы данных для полей. Mapped - более сложная вещь.
    Эти две записи делают одно и тоже. Record реализован через мэппед с дженериками.
        Record<string, number | string>
        type Tmapped = {
            [key: string]: string | number;
        };
        type Tmapped = {
            [key: number]: string;          //и для объектов и для масивов.
        };
    Преимущества меппеда в том, что можем делать с ключом всё что захотим
        type Tmapped = {
            [key in string as `get${key}`]: string | number;        //Все ключи должны начинаться с 'get'
        };
        const obj: Tmapped = { getSd: 23 };
18) Оператор in
    field in object                                     //оператор принадлежности из js - Есть ли такое поле в объекте
    type Tmapped = {
        [key in string as `get${key}`]: string;         //Все ключи должны начинаться с 'get'
    };
    type Tmapped = {
        [key in keyof IUser]: string;                   //Все ключи должны быть только из ключей интерфейса IUser
    };
    type Tmapped = {
        [key in keyof IUser as `get${key}`]: string;    //Комбинация
    };
19) Дженерики - обопщения. Делаем типы динамическими, добавляем изменяемые типы внутрь.
    Использование в интерфесах
        interface IUser {name: string}
        interface IBalance {balance: number}
        interface IApiResponse <T, K> {
            status?: 'ok' | 'error';
            data: T;
            balance: K;
        }
        const responseFromUserApi: IApiResponse <IUser, IBalance> = {
            data: {
                name: 'alex',
            },
            balance: {
                balance: 100,
            },
        };
    Использование в функциях
        function f<T>(value: T): T {
            return value;
        }
        //В стрелочных ф-х в реакте нужно дописать запятую в дженерики, что бы реакт не считал его компонентом!
        const fa = <T,>(value: T): T => {           
            return value;
        };
    Использование в классах
        class User<T> {
            val: T;
            constructor(data: T) {
                this.val = data;
            }
        }
        let user = new User(11);
        user.val = 22           //Всё ок            
        user.val = '22'         //Ошибка, не можем перезаписать тип
20) Ограничения (constraints) дженериков - (extends) - предпологает что сущность, которую положат в дженерик обязательно имеет эти поля.
    т.е. заганяет в определенные рамки.
    function f<T extends { id: number, name: string }>(value: T): T {
        value.id
        value.name
    return value;
    }
    f({ smth: 'bds', id: 2, name: 'n' });       //Поля id и name обязательны.
21) Значение дженериков по умолчанию
    interface IUser<T = string> {
        name: T;
    }
    const user11: IUser = {name: 'alex'}
    const user22: IUser<number> = {name: 22}
22) Conditional types - Условные типы. Тенарный оператор.
    type Ttype<T, K> = T extends K ? t1 : t2;    //Если (T extends K), то вернет t1, если нет, то вернет t2
    t1, t2 - могут быть типы, интерфейсы, булевы значение и т.д.
    type isArray<T> = T extends any[] ? true : false;       //Является ли тип массивом.
        const first: isArray<string> = false;
        const second: isArray<[string]> = true;
        const third: isArray<[2]> = true;
23) Сужение типов
    Для примитивов используем typeof
        function fn(arg: number | string | null) {
            if (typeof arg === 'number') {}
        }
    Для объектов типов интерфейсов используем проверку наличия поля в объекте
        interface IUser {name: string}
        interface IPerson {name: string; age: number}
        function fn2(arg: IUser | IPerson) {
            if ('age' in arg) {arg}             //Тут будет лежать IPerson
        }
    Для классов instanceof
        class Bmw {}
        class Audi {}
        function fn3(arg: Bmw | Audi) {
            if (arg instanceof Bmw) {arg}
        }    
    console.log({ name: 'n1' } instanceof Object);          //true
    console.log(typeof { name: 'n1' });                     //'object'

    Для объектов еще часто используют
    Discriminated unions - Добавляем поле, которое будет в каждом типе и по которому можно идентифицировать тип
        type Bmw = {type: 'Bmw', velocity: number }
        type Audi = {type: 'Audi', speed: number}
        function fn3(arg: Bmw | Audi) {
        switch(arg.type) {
            case 'Audi':
                arg.speed;
                break;
            case 'Bmw':
                arg.velocity;
                break;
        }
        }
    А вообще используют type guard - Добавляем уникальное поле к каждому интерфейсу и по нему проверяем.
24) Явное преобразование типов
    ('dsa' as unknown as number).toFixed(2) - будет ошибка.
    Такое кастование можно использовать в конфигах и в тестах. Иногда в разработке.
    В продакшене НЕЛЬЗЯ что бы небыло таких ошибок.
    Иногда можно:
    - при работе с html элементами когда один в другой надо преобразовать
    - в утилитарных функциях
    - когда тс не может вывести тип сам. Преобразование json fetch
        const parsedJson = JSON.parse('{name:20}');         Вар1 json
            const parsedJson = JSONParse<IUser>('{name:20}');
            function JSONParse<T>(value: string): T {
                return JSON.parse(value) as T;
            }
        async function fn() {                               Вар2 fetch
            const data = await fetch('');
            const parseData = await data.json()
        }
25) Перегрузка функций - часто используется в строготипизированных ЯП - сишарп с++
    В зависимости от условий вызова (сколько параметров передаем или какого они типа) будет выполнено условие.
    Алгоритм: сначало описываем СИГНАТУРУ первого варианта, потом СИГНАТУРУ второго варианта.
    Затем описываем общую СИГНАТУРУ для всех и выполение ф-и. Если надо добавляем Union и опциональность.
    function f(v1: number): string;
    function f(v1: boolean, v2: string): number;
    function f(v1: number | boolean, v2?: string): string | number {
    if (v2 !== undefined) {
        return 1;
    } else {
        return '1';
    }
    }
    А вот для этой ф-и перегрузка не нужна т.к. все переменные одинакового типа 
    и им достаточно добавить опциональность
    function f(v1: number): string;
    function f(v1: number, v2: number): string;
    function f(v1: number, v2?: number): string;
26) infer и условные типы - вытаскивает тип чего либо. Сделаем аналог ReturnType<ts> и Parametrs<ts>
    function f(v1: number, v2: string): void {}
    type myInferParam<T> = T extends (...args: ТипПараметров) => any ? ТипПараметров : never;
    говорим, что если на вход подается функция то вернем ТипПараметров иначе ничего. Вытаскиваем тип через инфер
    type myInferParam<T> = T extends (...args: infer U) => any ? U : never;
    type t1 = myInferParam<typeof f>;
    type myInferReturn<T> = T extends (...args: any) => infer U ? U : never;
    type t2 = myInferReturn<typeof f>;





interface Todo {
    id?: number;        //опциональное св-во.
    title: string;
    done: boolean;
}
const createNewTodo = (todo: Omit <Todo, 'id'>): Todo => {      //в строке
    const id = useId();

    return ({
        ...todo, id         //места не имеют разницы т.к. структурная типизация
    })
}

*/

/* {} Object object -большая маленькая буква
----------------------{} Object object----------------------
Пустой объект {} не подразумевает что объект пустой, а равен {} = Object
Через конструктор Object создается почти всё, включая примитивы и объекты, за исключением null и undefined.
type EmptyObject = {} | Object;
    const obj1:EmptyObject = {} | [];
    const obj2:EmptyObject = {age: '123'} | [1, '1'];
    const obj3:EmptyObject = 1;
    const obj4:EmptyObject = '1';
    const obj5:EmptyObject = () => {};
    const obj6:EmptyObject = new Date() | boolean | Symbol(1);
    const obj7:EmptyObject = undefined;                            //Ошибка
    const obj8:EmptyObject = null;                                 //Ошибка
Для object с маленькой буквы допустимы только сами объекты и массивы, остальное выдаст ошибку.
    const obj1:object = {} | [];
    const obj2:object = {age: '123'}  | [1, '1'];





*/

/* Опциональный оператор - когда есть ?. ?.() .[5] чтобы не упало приложение. Еще есть !. 
который затыкает тс как тс-игнор если есть ошибка. Но его в продакшене лучше не использовать. Только тесты и конфиги.
    type T1 = {
        name: string;
        address?: {street: string};
        func?:() => {}
        arr: []
    };
    function prepear(user: T1) {
        console.log(user.address.street)    //Ошибка
        console.log(user.address?.street)
        user.func?.()                       
        user.arr?.[]                       
    }
    
*/

/* TypeScript with React
---------------------------------TypeScript with React---------------------------
стрелочные ф-и с дженериками не забудь запятую поставить <T,> иначе реакт будет думать что это компонент.
                Конфиг
tsconfig.json       - задает основную конфигурацию проекта.
tsconfig.app.json   - наследуется от основной и расширяет и переопределяет ее.
Читай документацию. https://www.typescriptlang.org/tsconfig/
                Компоненты
Компоненты функциональные описываются так: FC(функц компонент) и JSX импортируются из 'react'
function App({ setIsAdult }: AdualtProps): JSX.Element {}
но лучше так
const AdualtQuestion: FC<AdualtProps> = ({ setIsAdult }) => {}

                Пропсы
Для пропсов компонента
либо вручную, но не забываем проставить опциональные св-ва что бы не ругался родитель
    type TGameProps1 = {name: string, description?: string, version?: string} 
либо через Pick
    type TGameProps3 = Pick<TGame, 'name' | 'description' | 'version'>;
либо вот так, тогда опциональные св-ва указывать не надо.
    type TGameProps2 = {name: TGame['name'], description: TGame['description'], version: TGame['version']}
а когда прокидываем ф-ю стейта, то вот так
    type AdualtProps = {setIsAdult: (value: boolean) => void} //используем any либо void

                Опциональные св-ва
Для опциональных св-в необходимо делать проверку
в верстке для price?
    {typeof game.price === 'number' && <>Цена: {priceWithCurrency(game.price)}</>}
в коде компонента
    const renderTags = (tags: TGame['tags']): JSX.Element[] | undefined => {  
      return tags?.map((tag, index) => <span key={tag + index}>{tag}</span>)
    };
    в верстке <Тэги: {renderTags(game.tags)}>   //ф-я возвращает jsx element

Если делаем проверку в верстке, то тут нужно будет избавиться от undefined при помощи NonNullable
const renderTags = (tags: NonNullable<TGame['tags']>): JSX.Element[] | undefined => {  };

                Получение данных с сервера
useEffect(() => {
    getGamesFromServer().then((gamesFromServer) => {
        setLoading(false);
        setGames(gamesFromServer);
    })
}, [])
export const getGamesFromServer: () => Promise<TGames> = () => {
    return new Promise(resolve => setTimeout(() => resolve(GAMES), 1000))
}
export function priceWithCurrency(price: number):string {return `${price} Руб.`}

                Стейты
const [isAdult, setIsAdult] = useState<boolean | null>(null)   //что бы не ругался setIsAdult передаваемый в <AdualtQuestion />
const [loading, setLoading] = useState<boolean>(true)
const [games, setGames] = useState<TGames>([])

                События
MouseEvent ChangeEvent KeyboardEvent FormEvent FocusEvent - их надо импортить из react
HTMLInputElement и другие элементы при связывании не надо импортить.
клики: MouseEvent
    ev: MouseEvent<HTMLButtonElement>
инпуты: ChangeEvent - т.к. событие доступно у разных элементов, нужно связать с конкретным.
    ev: ChangeEvent<HTMLInputElement>
Два варианта, через ChangeEvent (надо импортить, вешаем на переменную функции)
    const onChangeHandler1 = (ev: ChangeEvent<HTMLInputElement>) => {
        setValue(ev.target.value);
    }
либо через ChangeEventHandler (надо импортить, вешаем на саму функцию)
    const onChangeHandler2: ChangeEventHandler<HTMLInputElement> = (ev) => {
        setValue(ev.target.value);
    }
*/

/* Задачи и вопросы тс
1) Литеральные строки это определенные строки и значения.
2) Union строки, типы
3) Оператора объединения и пересечения | и &    
4) Отличие интерфейсов (interface) от типов (type): наследование, одинаковые имена, | объединения типов.
5) Особенности использования оператора | в функциях
    требует доп проверку типа.
6) Кастование типов (когда используем библиотеки, у которых плохо описаны типы). 4 способа заткнуть тс
7) Enum. Что может лежать в ключах. Как обращаться по ключу.
8) Utility type
9) Типы данных : any   unknown   void    never
10) Обработка ошибки try {} catch(error) {
11) Type guard - что бы тайпскрипту доказать, что значение которое прилетает не unknown а конкретный тип MyError при помощи оператора is.
12) as const. readonly | as const, ТОЧЕЧНЫЕ поля.
13) tuple - тапл - кортедж - массив заданной длины. Плюс енамов. Аналог плюрал через тайпоф, дженерик.
14) typeof keyof. Перебор объекта. typeof и ReturnType<>
15) Mapped types и Record<>. Что под капотом. Оператор in (для obj, string, keyof). Начало с get. С заглавной буквы. От интерфейса
16) Дженерики - обопщения. Делаем типы динамическими, добавляем изменяемые типы внутрь.
Пример для ф-й, интерфейсов, типов, классов.
Особенность дженериков в стрелочных ф-й в реакте. 
17) Ограничения (constraints) дженериков - (extends) - предпологает что сущность, которую положат в дженерик обязательно имеет эти поля.
Пример с ф-ей f({ smth: 'bds', id: 2, name: 'n' });
18) Значение дженериков по умолчанию
19) Conditional types - Условные типы. Тенарный оператор. Что может лежать в t1 t2
20) Сужение типов - когда на входе | и нужно уточнить тип. Пример Для примитивов, объектов/типов/интерфейсов
Для примитивов используем ...
Для объектов типов интерфейсов используем ...
Для классов ...
Для объектов еще часто используют Discriminated unions -...
А вообще используют type guard
21) Где кастование можно использовать: в конфигах и в тестах. Иногда в разработке. В продакшене НЕЛЬЗЯ.
22) Классы, наследование классов от класса, от интерфейсов/типов. Статические св-ва/методы, приватные ридонли протектед публичные. 
Абстрактные классы и методы.
23) Перегрузка функций - часто используется в строготипизированных ЯП - сишарп с++
Пример правильного и неправильного(типы одинаковые) использования.
24) infer с условными типами  - вытаскивает тип чего либо. Сделаем аналог ReturnType<ts> и Parametrs<ts>
function f(v1: number, v2: string): void {}
type t1 = myInferParam<typeof f>;
Так же есть массив с элементами, вытащить тип элемента.
const arr: (string | number)[] = ['1', 2];
type t2 = myType<typeof arr>;

1) Есть объект js. Сделать ф-ю достающую значения по ключу.
const obj = { n: 10, n2: 'das' };
let val = getValueByKey(obj, 'n2');

    function getValueByKey<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
    }

2) Есть объект и перечисления цветов. Написать ф-ю установки цветов + дженерик. 
const Color = { RED: 'red', GREEN: 'green' };
const enum COLOR { RED = 'red', GREEN = 'green' }
function setColor(color: ) : void {}

    function setColor1(color: COLOR): void {}
    function setColor2(color: (typeof Color)[keyof typeof Color]): void {}
    или через дженерик
    type valueOf<T> = T[keyof T];
    function setColor3(color: valueOf<typeof Color>): void {}
К енаму можно обратиться по индексу, но только если он числовой.

3) Показать пример структурной типизации тс на примере типа/интерфейса и енама
    type I1 = {name:string}
    type I2 = {name:string}
    function func(value: I1): void {}
    const user: I2 = {name: 'name'}
    func(user)                              //Всё ок

    enum E1 { name = 'name'}
    enum E2 { name = 'name'}
    function func(value: E1): void {}
    const user: E2 = E2.name
    func(user)                              //Ошибка
Лучше всё же использовать const object ({} as const)

4.1) Сделать тип readonly, partial. Использовать маппед и дженерик
    type User = {name: string, age: number}
        type readonly<T> = {
            readonly [K in keyof T]: T[K]  | [K in keyof T]?: T[K]
            -readonly [K in keyof T]: T[K] | [K in keyof T]-?: T[K]
        }
4.2) Сделать тип делающий все ключи начинающимися с get
    type keyGet = {
        [K in string as `get${K}`]: number;
    };
    const fe: keyGet = {
        getfd: 1,
    }
4.3) Сделать тип делающий все ключи из интерфейса и начинающимися с get
    type User = {name: string}
        type keyGet = {
            [key in keyof User as `get${key}`]: User[key];
        };
        const user: keyGet = {
            getname: '1'
        }
4.4) Написать тип через дженерик, если тру то вернет T в противном случаи F
    type If<C, T, F> = ...........;
    type caes = [If<true, 1, 2>, If<false, 1, 2>];

        type If<C extends boolean, T, F> = C extends true ? T : F;
4.5) Написать аналог метода push, но для типа.
    type result = Push<[1,2], '3'>      [1,2, '3']

        type Push<T extends any[], K> = T extends any[] ? [...T, K] : never;
4.6) Написать аналог метода Concat, но для типа.
    type result = Concat<[1,2], ['3']>      [1,2, '3']

        type Concat<T extends any[], K extends any[]> = T extends any[] ? [...T, ...K] : never;
4.7) Написать аналог length.
    type smth = [1,2,'3']
    type result = length<smth>      3

        type length<T extends any[]> = T extends any[] ? T['length'] : never;
В обычном js есть два варианта получения длины [].length и ['length']. В тс только второй вариант.
        type length<T extends readonly any[]> = T extends any[] ? T['length'] : never;
Для объектов с readonly или as const надо писать так.
4.8) Вернуть первый элемент массива. Не забудь рассмотреть вариант когда у нас пустой массив.
    type smth = [1, 2, '3'];
    type result = firstElementByArr<smth>;      

        type firstElementByArr<T extends any[]> = T extends [] ? never : T[0];
4.9) Аналог Pick
    type smth = {name:string, age: number, curse: number};
    type result = myPick<smth, 'age'>;
        type myPick<T, Keys extends keyof T> = {
            [key in Keys]: T[key]
        }
        type myPick<T, Keys extends keyof T> = {
            [key in keyof T & Keys]: T[key];
        };
4.10) Аналог Omit. Вспомни как работает оператор для & типов
    type smth = { name: string; age: number; curse: number };
    type result = myOmit<smth, 'age'>;

        type myOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
        type t3 = myOmit<smth, 'curse' | 'name'>;
4.11) Есть массив, сделать из него объект где ключ и значение равны значению эл массива.
Достать все значения из массива можно так [number], если нужен конкретный то [1]
[1,2,3,'1'] T[number] = 1 | 2 | 3 | '1' - конвертирует значения массива в union тип тс.
    const arr = ['n1', 'n2', 3];
    type result = objectFromArr<['n1', 'n2', 3]>
    type result1 = objectFromArr<typeof arr>

        type objectFromArr<T extends any[]> = {
            [value in T[number]]: value
        }
4.12) Аналог ut Exclude<'a' | 'b' | 'c', 'a'> = 'b' | 'c'. Есть union тип, из него надо выкинуть одно значение.
Подсказка type TEST = 1 | 2 | never | 3 | never; даст 1 | 2 | 3. Все never удаляются.
    type MyExclude<T, K> = [];
    type t1 = MyExclude<'a' | 'b' | 'c', 'a'>; // 'b' | 'c'

        type MyExclude<T, K> = T extends K ? never : T;
    в Т поочередно помещаются элементы юнионтипа (а === а ? never : a) (b === a ? never : b)
4.13) Аналог Includes([1,2,3], 2) - true
type t11 = myIncludes<[1, 2, 3, '1'], 2>;   //для плоского массива

    type myIncludes<T extends any[], U> = U extends T[number] ? true : false;
    T[number] = 1 | 2 | 3 | '1'. Т.к. мы сравниваем единичный элемент, то пишем U extends T[number].
    (T[number] extends U) - работать не будет.
    (2 extends 1 | 2 | 3 | '1' Да)  (1 | 2 | 3 | '1' extends 2 Нет)

4.14)
4.15)
4.16)
4.17)
4.18)
4.19)
4.20)

5)
*/

/* Ответы на вопросы тс
Вопросы:
1) Литеральные строки это определенные строки и значения.
    function func(x:5, str: 'str') {}
2) Union строки, типы
    let str: 'admin' | 'user';      type t = 'admin' | 'user'        type t = number | string;
3) Оператора объединения и пересечения | и &    
type t1 = { curse: string };
type t2 = { name: string; age: number };
4) Отличие интерфейсов (interface) от типов (type): наследование, одинаковые имена, | объединения типов.
5) Особенности использования оператора | в функциях
    требует доп проверку типа.
6) Кастование типов (когда используем библиотеки, у которых плохо описаны типы). 4 способа заткнуть тс
//"тип any" "@ts-ignore" "type guard" "as unknown as"
7) Enum. Что может лежать в ключах. Как обращаться по ключу.
8) Utility type
    Partial<TUser>;     Required<TUser>;    Readonly<TUser>;
    Pick<IProfile, 'name' | 'age'>      Omit<IProfile, 'name' | 'age'>
    Record<number,string>
    capitalize      uppercase       lowercase
    ReturnType<typeof f1>       Parametrs<typeof f1>
    NonNullable<>
9) Типы данных : any   unknown   void    never
10) Обработка ошибки try {} catch(error) {
        if (error instanceof Object && 'f1' in data && typeof error.f1 === 'function') error.f1();
    }
11) Type guard - что бы тайпскрипту доказать, что значение которое прилетает не unknown а конкретный тип MyError при помощи оператора is.
12) as const. readonly | as const, ТОЧЕЧНЫЕ поля.
    let arr = ['0', '1'] as const;  function func(val: '0' | '1') {}
    func('0');  func(arr[0]);
13) tuple - тапл - кортедж - массив заданной длины. Плюс енамов. Аналог плюрал через тайпоф, дженерик.
    const PLURAL: [string, string] = ['товар', 'товаров'];
    function plural(val: ['товар', 'товаров'], index: number):string {return val[index]}
    function plural(val: enum ...
    могли бы использовать енам в качестве типа, а не вручную прописывать.
    function plural2(val: typeof PLURAL, index: number):string {return val[index]}
    function plural3 <T extends typeof PLURAL, K extends number> (val: T, ind: K): T[K] {return val[ind]}   ПЕРЕПРОВЕРИТЬ не работает
14) typeof keyof. Перебор объекта. typeof и ReturnType<>
    typeof - из js в тс для объектов, ф-й.   keyof - берет ключи у тс объекта.   ReturnType<> - возвращает тип возвращаемого результат тс объект
    const obj = {name:'asdo', age: 2};
    for (let keyObj in obj) {
        let key = keyObj as keyof typeof obj;
        let value = obj[key]
    }
15) Mapped types и Record<>. Что под капотом. Оператор in (для obj, string, keyof). Начало с get. С заглавной буквы. От интерфейса
    type t1 = Record<string, string>;
    type t2 = {[key: string]: string};
    type t3 = {[key in string as `get${Capitalize<key>}`]: string };
    const d: t3 = { getSa: 'sd' };
    interface User { name: string};     type t4 = {[key in keyof User]: string}
    const c: t4 = { name: 'sd' };
16) Дженерики - обопщения. Делаем типы динамическими, добавляем изменяемые типы внутрь. 
Особенность дженериков в стрелочных ф-й в реакте.
Пример для ф-й, интерфейсов, типов, классов. 
    const fa = <T,>(value: T): T => {return value};
    function smth <T>(val: T): T {return val}       type t <T> = {name: T}  
    interface i <T> {name: T}                       class c <T> {}
17) Ограничения (constraints) дженериков - (extends) - предпологает что сущность, которую положат в дженерик обязательно имеет эти поля.
    function f<T extends { id: number, name: string }>(value: T): T {
        value.id
        value.name
        return value;
    }
    f({ smth: 'bds', id: 2, name: 'n' });
18) Значение дженериков по умолчанию
    interface IUser<T = string> {name: T}
19) Conditional types - Условные типы. Тенарный оператор. Что может лежать в t1 t2
    type t1 = { n: string };
    type t2 = { d: string };
    type smth<T, K> = T extends K ? t1 : t2;
20) Сужение типов - когда на входе | и нужно уточнить тип. Пример Для примитивов, объектов/типов/интерфейсов
Для примитивов используем typeof
    function func1(val: number | string) {if (typeof val === 'number') {}}
Для объектов типов интерфейсов используем проверку наличия поля в объекте
    type user = { user: string };   type person = { person: string };
    function func(val: user | person) {if ('user' in val) {}}
Для классов instanceof
    class Bmw {}; class Audi {}
    function fn3(arg: Bmw | Audi) {if (arg instanceof Bmw) {arg}} 
Для объектов еще часто используют
    Discriminated unions - Добавляем поле, которое будет в каждом типе и по которому можно идентифицировать тип
        type Bmw = {type: 'Bmw', velocity: number }
        type Audi = {type: 'Audi', speed: number}
        function fn3(arg: Bmw | Audi) {
        switch(arg.type) {
            case 'Audi':
                arg.speed;
                break;
            case 'Bmw':
                arg.velocity;
                break;
        }
        }
    А вообще используют type guard - Добавляем уникальное поле к каждому интерфейсу и по нему проверяем.
21) Где кастование можно использовать: в конфигах и в тестах. Иногда в разработке. В продакшене НЕЛЬЗЯ.
23) Перегрузка функций - часто используется в строготипизированных ЯП - сишарп с++
    В зависимости от условий вызова (сколько параметров передаем или какого они типа) будет выполнено условие.
    Алгоритм: сначало описываем СИГНАТУРУ первого варианта, потом СИГНАТУРУ второго варианта.
    Затем описываем общую СИГНАТУРУ для всех и выполение ф-и. Если надо добавляем Union и опциональность.
    function f(v1: number): string;
    function f(v1: boolean, v2: string): number;
    function f(v1: number | boolean, v2?: string): string | number {
    if (v2 !== undefined) {
        return 1;
    } else {
        return '1';
    }
    }
    А вот для этой ф-и перегрузка не нужна т.к. все переменные одинакового типа 
    и им достаточно добавить опциональность
    function f(v1: number): string;
    function f(v1: number, v2: number): string;
    function f(v1: number, v2?: number): string;
24) infer с условными типами  - вытаскивает тип чего либо. Сделаем аналог ReturnType<ts> и Parametrs<ts>
    function f(v1: number, v2: string): void {}
    type myInferParam<T> = T extends (...args: ТипПараметров) => any ? ТипПараметров : never;
    говорим, что если на вход подается функция то вернем ТипПараметров иначе ничего. Вытаскиваем тип через инфер
    type myInferParam<T> = T extends (...args: infer U) => any ? U : never;
    type t1 = myInferParam<typeof f>;
    Достанем тип элемента массива.
        const arr: (string | number)[] = ['1', 2];
        type myType<T extends any[]> = T extends (infer U)[] ? U : never;
        Не ЗАБЫВАЕМ и тут написать extends, говоря тс что мы сужаем входной тип. А на выходе невер никогда не будет такой ситуации.
        type t1 = myType<typeof arr>;


1) Есть объект js. Сделать ф-ю достающую значения по ключу.
const obj = { n: 10, n2: 'das' };
let val = getValueByKey(obj, 'n2');

    function getValueByKey<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
    }

2) Есть объект и перечисления цветов. Написать ф-ю установки цветов + дженерик.
const Color = { RED: 'red', GREEN: 'green' };
const enum COLOR { RED = 'red', GREEN = 'green' }

    function setColor1(color: COLOR): void {}
    function setColor2(color: (typeof Color)[keyof typeof Color]): void {}
    или через дженерик
    type valueOf<T> = T[keyof T];
    function setColor3(color: valueOf<typeof Color>): void {}
К енаму можно обратиться по индексу, но только если он числовой.

3) Показать пример структурной типизации тс на примере типа/интерфейса и енама
    type I1 = {name:string}
    type I2 = {name:string}
    function func(value: I1): void {}
    const user: I2 = {name: 'name'}
    func(user)                              //Всё ок

    enum E1 { name = 'name'}
    enum E2 { name = 'name'}
    function func(value: E1): void {}
    const user: E2 = E2.name
    func(user)                              //Ошибка
Лучше всё же использовать const object ({} as const)

4.1) Сделать тип readonly, partial. Использовать маппед и дженерик
    type readonly<T> = {
        readonly [K in keyof T]: T[K]  | [K in keyof T]?: T[K]
        -readonly [K in keyof T]: T[K] | [K in keyof T]-?: T[K]
    }
4.2) Сделать тип делающий все ключи начинающимися с get
    type keyGet = {
        [K in string as `get${K}`]: number;
    };
    const fe: keyGet = {
        getfd: 1,
    }
4.3) Сделать тип делающий все ключи из интерфейса и начинающимися с get
    type User = {name: string}
    type keyGet = {
        [key in keyof User as `get${key}`]: User[key];
    };
    const user: keyGet = {
        getname: '1'
    }

5) Написать пример тайп гарда и ассертс



6)




7)




*/

/* TS, установка, запуск, Config.
-------------------------------------TS, установка, запуск, Config--------------------------------------- 
            Установка и первый запуск.
Должен быть установлен npm, для этого проверяем это
npm -v      Если всё ок то идем дальше иначе устанавливаем нпм.
Инициализируем проект что бы появился файл package.json
npm init -y
Устанавливаем компилятор
либо глобально в компьютер
npm install -g typescript
либо локально для дев режима, т.к. в рантайм он не попадает.
npm install -D typescript
Создадим тс конфиг файл командой (tsconfig.json)
npm tsc --init
Теперь можем запускать через терминал командой tsc
tsc app.ts
Для сборщиков vite смотрим на сайте какой командой создать проект с тс. и npm install
            Конфиг 
tsconfig.json - дефолтный конфиг, который референтся (состоит) из 
tsconfig.app.json   tsconfig.node.json   для тестов может быть отдельный конфиг
tsconfig.app.json - конфиг для этого приложения. Приоритет у него, он переписывает tsconfig.json.
tsconfig.node.json - конфиг для компилятора TS в среде Node.js. Специфичен для серверного кода. 
Мы его (tsconfig.node.json) не трогаем.
{
  "compilerOptions": {
    "target": "ES2020",                  //то какую систему хотим поддерживать
    "module": "ESNext",                  //каким образом подключать модули
    "strict": true,                      //Ставим обязательно true. Будет подсвечивать спорные моменты
    "allowJs": true,                     //Компилятор будет обрабатывать и js файлы, а не только ts
  },
}

*/

/* Пример хука для фетч запросов React
import { useEffect, useState } from 'react';

export const useFetch = (fetchFunction, params) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const stringParams = params ? new URLSearchParams(params).toString() : ''; //Преобразовывваем в строку

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const result = await fetchFunction(params);
        setData(result);
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })(); //самовызывающаяся ф-я
  }, [fetchFunction, stringParams]); //строку сравнивать легче чем объекта

  return { data, isLoading, error };
};
*/

/* children:React.ReactNode      ref:ForwardedRef<HTMLDivElement>       ...rest  

REF
interface Props {
  categories: CategoriesType[];
  setSelectedCategories: (category: CategoriesType | null) => void;
  selectedCategories: CategoriesType | null;
}
const Categories = forwardRef(
  ({ categories, setSelectedCategories, selectedCategories }: Props, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div ref={ref} className={styles.categories}>
        <button>All</button>
        {categories.map(category => ..})}
      </div>
    );
  },
);

CHILDREN
interface Props {
  top?: boolean;
  bottom?: boolean;
  children: React.ReactNode;
}
const PaginationWrapper = ({ top, bottom, children, ...paginationProps }: Props) => {
  return (
    <>
      {top && <Pagination {...paginationProps} />}
      {children}
      {bottom && <Pagination {...paginationProps} />}
    </>
  );
};

...REST
...paginationProps - делаем типизацию для Pagination и ее добаляем в PaginationWrapper вместо рест оператора
interface Props {           // Pagination
  totalPages: number;
  currentPage: number;
  handlePageClick: (page: number) => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
}
interface Props {           // PaginationWrapper
  top?: boolean;
  bottom?: boolean;
  children: React.ReactNode;

  totalPages: number;
  currentPage: number;
  handlePageClick: (page: number) => void;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
} 
Но лучше вынести в отдельный интерфейс и не дублировать код.
*/

/* React, {ReactElement, ReactNode, ComponentType} from 'react, HTMLElement, JSX.Element + TYPESCRIPT
Для скелетона Component:ComponentType<P>     return<Component {...(restProps as P)} /> где Р - тип пропсов
Для слайдера children: React.ReactElement;
Для рефа     const sliderRef = useRef<null | HTMLElement>(null);
{React.cloneElement(children, { ref: sliderRef })}

HTMLElement - это тип из стандартного DOM браузера, представляющий любой HTML-элемент страницы.
ReactElement, ReactNode, ComponentType - из виртуального DOM, которые преобразуются потом в реальные элементы.
У реакт компонентов/узлов/элементов нет св-в наподобе scrollLeft. Поэтому нужно использовать реальный элемент.
const sliderRef = useRef<null | HTMLElement>(null);
const scrollLeft = () => {
    if (!sliderRef.current) return;
    sliderRef.current.scrollLeft -= step;
};

ReactElement равен JSX.Element. Они не могут возвращать null undefined, только элемент.
React.ReactNode - может возвращать всё, что угодно.
function func(): JSX.Element | React.ReactElement {
    return <></>;    return <p></p>;                //Ок
    return 1;   return null;    return [<p></p>];   //Ошибка
}
function func(): React.ReactNode {
    return <></>;  return <p></p>;  return 1;  return null;  return [<p></p>];     //Ок
}

ReactElement    - конкретный элемент созданный средствами реакт
JSX.Element     - любой объект внутри jsx кода.

ComponentType   - описывает шаблон создания любого компонента с пропсами
const Button: ComponentType = ({ text }) => <button>{text}</button>;
ReactElement    - конкретный экземпляр компонента, созданный на основе типа ComponentType и готовый к показу.
<Button text="Нажми меня"/>
ComponentType:  схема дома (чертёж)
ReactElement:   построенный дом по этому чертежу
*/

/* Redux toolkit with TypeScript
1) Установить 
react-redux @reduxjs/toolkit    - тулкит  
@types/react-redux              - дополнение для тс. Во вкладке Redux Toolkit TypeScript Quick Start сбоку.
    npm install @reduxjs/toolkit react-redux @types/react-redux
2) Вкладка Redux Toolkit TypeScript Quick Start следуем всем инструкциям,
    создаем хранилище, в него можем скопировать app/hooks.ts. Создаем слайсы и подключаем.
3) Не забываем приложение обернуть в 
    <Provider store={store}>
4) По аналогии подключаем rtk query из вкладки быстрый старт для него
5) Настраиваем хранилище на мидлвар
6) Получаем данные в компоненте
const { data, error, isLoading } = useGetNewsQuery({ ...filters, keywords: debounceKeywords });
const { data, error, isLoading } = useGetLatestNewsQuery(null);
*/
/* store/index.ts 
import { configureStore } from '@reduxjs/toolkit';
import { useSelector, type TypedUseSelectorHook } from 'react-redux';
import { useDispatch } from 'react-redux';
import newsReducer from './slices/newsSlice';

export const store = configureStore({
  reducer: {
    news: newsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

Хуки: вариант 1
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
Хуки: вариант 2
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;   
*/
/* store/services/newsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { NewsApiResponse, ParamsType } from '../../interfaces';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const Base_URL = import.meta.env.VITE_NEWS_BASE_API_URL;

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: fetchBaseQuery({ baseUrl: Base_URL }),
  endpoints: builder => ({
    getNews: builder.query<NewsApiResponse, ParamsType>({
      keepUnusedDataFor: 0,                     //Если нужно отключить кэширование для этого запроса.
      //query: (name) => `pokemon/${name}`,     //Простой запрос
      query: params => {
        const { page_number = 1, page_size = 10, category, keywords } = params || {};
//ОБЯЗАТЕЛЬНО должны вернуть объект return {url, method?,в params?, body?, headers?}
        return {
          url: 'search',
          params: {
            apiKey: API_KEY,
            page_number,
            page_size,
            category,
            keywords,
          },
        };
      },
      async onQueryStarted(_arg, {dispatch, queryFulfilled}) {  
        const result = await queryFulfilled;
        const data = result.data;
        dispatch(setNews(data.news))        //Можно сразу полжить в хранилище.
      },
    }),
    getLatestNews: builder.query<NewsApiResponse, null>({
      query: () => {
        return {
          url: 'latest-news',
          params: {
            apiKey: API_KEY,
          },
        };
      },
    }),
  }),
});

export const { useGetNewsQuery } = newsApi;
*/
/* store/index.ts Донастройка для RTK Query
export const store = configureStore({
  reducer: {
    news: newsReducer,
    [newsApi.reducerPath]: newsApi.reducer,              *
  },
    middleware: (getDefaultMiddleware) =>                *
    getDefaultMiddleware().concat(newsApi.middleware),   *
});
*/

/* alias vite -вводим и там первая ссылка на гайд.
1) npm install -D @types/node              - что бы не ругался конфиг
2) В vite.config.ts добавляем resolve:
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    import path from 'path';
    export default defineConfig({
    resolve: {
        alias: {
        '@': path.resolve(__dirname, './src'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@components': path.resolve(__dirname, './src/components'),
        },
    },
    plugins: [react()]
    })
3) Добавить это в свой tsconfig.json или tsconfig.app.jso. (НЕ СЮДА tsconfig.node.json)
    {
    "compilerOptions": {
        // ... your other compiler options
        "baseUrl": ".",
        "paths": {
            "@/*": ["src/*"],
            "@components/*": ["src/components/*"],
            "@assets/*": ["src/assets/*"]
        },
    },
    "include": ["src"],
    "references": [{ "path": "./tsconfig.node.json" }]
    }
 */

/* FSD-архитектура проекта (Feature-Sliced Design) 
подходит если создаем приложение, сайт, а не библиотеку.

Layers              Slices              Segments

app
processes
pages
widgets
features
entities    - {user post comment} -   {ui model api}
shared

app         - корневые файлы, подключение редакса, редьюсеров, роутинг, провайдеры тем. Функционал относится ко всему проекту.
processes   - уже не используется, раньше использовали для сложных сценариев (например авторизации).
pages       - композиция, большие самостоятельные страницы, профиль/main и т.д.
widgets     - композиция, самостоятельные большие компоненты, список юзеров, список постов т.е. блоки из которых строится страница.
features    - взаимодестви, функциональность приложения, скрол, пагинация, какието кнопки.
entities    - бизнес сущностей, карточки товара, карточки профиля.
shared      - общие элементы (ui kit), общие хуки, хоки, хелперсы, ассетс, картинки, темы и стили, которые используются в разных слоях.

Slices      - деление и распределение на определенные сущности. Они могут быть одинаковыми в разных слоях.
            Например {user post comment} могут быть и в features и в widgets и в entities
Segments    - что то, что оносится к сущности например к юзеру.
            ui(разметка, компоненты юзера) model(файлы типизации, файлы слайсы для редакса) 
            api(запросы на получение/удаление/замену юзера. А также доп вещи например utils/helpers)

В каждом "слайсе/сегменте" должен быть свой index файл из которого мы всё экспортируем - тоесть точка входа.
Ниже лежащий слой не может использовать верхне лежащий слой. Например "app" может использовать все слои снизу.
    А вот "entities" может использовать только "shared".
    Еденственное исключение "shared" - его могут использовать все слои. 
Внитри "Slices" не должно быть сообщение между собой. Например в Slices есть {user post comment}. 
    Юзер не должен использовать пост, а пост не должен использовать юзера.

*/

const alfavit = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 };
const alf = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'c'];
const arrFamilies = [];
for (let k = 0; k < 10; k++) {
  let str = '';
  for (let i = 0; i <= 3; i++) {
    let randomNum = Math.floor(Math.random() * (0 + alf.length - 1)) - 0 + 1;
    let letter = alf[randomNum];
    str += letter;
  }
  arrFamilies.push(str);
}
arrFamilies.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
});
