const header = document.querySelector('[header]');
const input = document.getElementById('todo-input');
const list = document.getElementById('list');
const count = document.querySelector('[count]');
const today = document.querySelector('[today]');
const sort = document.querySelector('[sortList]');

const CHECK = 'fa-check-circle';
const UNCHECK = 'fa-circle-thin';
const LINE_THROUGH = 'lineThrough';
let data;
let List = [];

let reset = () => {
   localStorage.clear();
   List = [];
   list.innerHTML = '';
   getData();
}

let addTodo = () => {
   val = input.value;
   if (val == '') return // OR if(val)

   let newTodo = {
      todo: val,
      date: new Date().toLocaleString(),
      completed: false
   };

   List.push(newTodo);

   localStorage.setItem('TODO', JSON.stringify(List));

   input.value = '';
   insertItem(newTodo);
}

input.addEventListener('keydown', e => {   // keydown or keyup | 'enter' key code = 13 (e.keyCode)
   if (e.key === 'Enter' && input.value !== '') { addTodo(); }
});


let getData = () => {
   data = localStorage.getItem('TODO');
   if (data) {
      List = JSON.parse(data);
      // console.log(List)
      loadItems(List);
   }
   else {
      console.log('no data')
      setCount(List.length);
   }
}

let loadItems = (aList) => {
   aList.forEach(i => {
      insertItem(i);
   });
}

let insertItem = (i) => {
   let item =
      `<li class="item">
         <i class="fa ${i['completed'] ? CHECK : UNCHECK}" task="completed" id="${i['date']}"></i>
         <p class="${i['completed'] ? 'lineThrough' : ''} " todo>${i['todo']}</br><span class="createdAt">CreatedAt: ${i['date']}</span></p>
         <i class="fa fa-trash delete" task="delete" id="${i['date']}"></i>
      </li>`;
   list.insertAdjacentHTML('beforeend', item);
   scrollToBottom();
   setCount(List.length);
}

let setCount = (size) => {
   count.innerHTML = size;
}

const scrollToBottom = () => {
   list.scrollTop = list.scrollHeight;
}

list.addEventListener('click', (e) => {
   const el = e.target;
   if (!el.attributes.task) return
   const elTask = el.attributes.task.value;
   if (elTask == 'completed') {
      toggleComplete(el);
   } else {
      deleteTodo(el);
   }
   localStorage.setItem('TODO', JSON.stringify(List));
   setCount(List.length);
})

let toggleComplete = (el) => {
   el.classList.toggle(CHECK);
   el.classList.toggle(UNCHECK);
   el.parentNode.querySelector('[todo]').classList.toggle(LINE_THROUGH);

   List[todoIndex(el.id)].completed = !List[todoIndex(el.id)].completed;
   //  localStorage.setItem('TODO', JSON.stringify(List));
   // console.log(element.parentNode.querySelector('[todo]'));
}

let deleteTodo = (el) => {
   List.splice(todoIndex(el.id), 1);
   el.parentNode.parentNode.removeChild(el.parentNode);
   //  localStorage.setItem('TODO', JSON.stringify(List));
   // console.log(element.parentNode.querySelector('[todo]'));
}

let todoIndex = (key) => {
   return List.findIndex((todo, i) => {
      return todo.date === key;
   });
}

sort.addEventListener('click', e => {
   const el = e.target;
   if (!el.attributes.id || List.length === 0) return
   const task = el.attributes.id.value;
   // console.log(el);
   list.innerHTML = '';
   if (task == 'date') {
      loadItems(List);
   }
   else if (task == 'completed') {
      let tempList = [...List];
      loadItems(sortList(tempList));
   }
});

let sortList = (tempList) => {
   return tempList.sort((a, b) => {
      return b.completed - a.completed;
   });
}

let start = () => {
   today.innerHTML = new Date().toDateString();
   getData();
}

start()