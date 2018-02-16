# notes-solution
Proper solution to notes app without cheating

## Начало работы
```bash
cd server
npm install
npm run serve
```

## Что тут в целом?
FLUX + vDOM (позволяет обновлять весь View не очень дорого) + REST like API + сервис

## Куда стоит посмотреть
`src/common.js` Тут главая идея, что теперь файлы можно включать в любом порядке и явно известно, что -- внешний модуль.
`src/render.js` Очень упрощенная реализация vDOM, на идее vDOM строятся такие фреймворки как React и Vue, 
так что постарайтесь понять что там происходит.
`src/store.js` 100% логики приложения живет там и вообще не связано с View.
`server/notes.js` это называется сервис. Выделенный кусок бекэенда, при большой нагрузке 
его можно выделить в отдельный процесс \ продублировать.

---

```js
common.render = (function renderModule() 
//...
}())
```
Так называемый IIFE (Immediately Invoked Function Expression) Это позволяет получить инкапсуляцию с помощью областей видимости в JS

---

```js
/**
 * Virtual DOM node
 * @typedef {(string|{tag: string, props: Object, children: [VNode]})} VNode
 */



/**
 * Updates DOM bssed on VDOM's diff
 * @param {HTMLElement} $root element to mount app into
 * @param {VNode} vNode virtual DOM to render effectively
 */
const render = ($root, vNode) => {
  // ...
}
```

[JS DOC](http://usejsdoc.org/index.html) -- договоренность по документированию в JS. 
Заметьте, она достатночно популярна, чтобы IDE и GitHub ее поддерживали.
