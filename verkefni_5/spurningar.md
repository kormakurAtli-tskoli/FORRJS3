1. Afhverju er getElementById() fljótleglegasta aðferðin?<br>
+ _Vegna þess að það er beint kall í javascript._
2. Hvað er málið með auða hnúta (e. whitespace nodes) og DOM tréið?<br>
+ _Auðir hnútar sem line break, tab og fleira bæta hverjir við grein í DOM tréið._
3. Hvað er static og live NodeList, hver er munurinn á NodeList og HTMLCollection?<br>
+ _Live NodeList söfn geta breyst samkvæmt breytingum í DOMinu, static NodeList söfn gera það ekki. HTML Collection söfn eru alltaf live._
4. Hvað er event í eftirfarandi kóða og hvað er gert með því?
```js
 let link = document.querySelector("a");
 link.addEventListener("click", event => {
 console.log("Nope.");
 event.preventDefault();
 });
 ```
5. Af þremur leiðum til að binda event þá er AddEventListener() nýjust en afhverju er hún
betri en hinar?<br>
6. Hver er munurinn á true og false í AddEventListener?
```js
 elem.addEventListener("click", handlerFunction, true);
 elem.addEventListener("click", handlerFunction, false);
 ```
7. this vísar í Event listener á html element en ekki á object. Þú getur notað bind() til að
breyta því, leystu eftirfarandi kóðadæmi með notkun á bind() til að birta í console “My
name is Sam“ en ekki undefined.

```js
let Person = {
 name: 'Sam',
 sayName: function(){
 console.log('My name is '+ this.name);
 }
};
buttonEl.addEventListener('click', Person.sayName);
```
