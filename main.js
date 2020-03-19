const url = './data.json';
const listOfUsers = document.querySelector('.users-list');
const buttons = document.querySelector('.container-input__buttons');
const addButton = document.querySelector('.button');
const textInput = document.getElementById('text');

const firstScreen = document.querySelector('.screen-one');
const secondScreen = document.querySelector('.screen-two');

let currentElement;
let currentPositionElement = 0;
let positionsButtons = 0;
let numberOfText = 4;

getData(url).then(
   () => {
      const el = listOfUsers.firstElementChild;
      el.classList.add('active');
      currentElement = el;
   }
);

async function getData(url){
   try {
      const response = await fetch(url);
      const data = await response.json();
      const users = data.accounts.map(account => getUser(account));
      users.forEach(user => listOfUsers.append(user));
   } catch(error){
      firstScreen.insertAdjacentHTML('beforeend', `<h2>${error.name}</h2>`);
   }
}

document.addEventListener('keydown', e => {
   const pressKey = e.code;
   switch (pressKey) {
      case 'ArrowLeft':
         if (!currentElement) break; 
         if (currentElement.parentElement.classList.contains('container-input__buttons')){
            if (!currentElement.previousElementSibling) break;
            currentElement.classList.remove('active');
            currentElement = currentElement.previousElementSibling;
            currentElement.classList.add('active');
            positionsButtons--;
         } else if (currentElement.classList.contains('button')) {
            if (!listOfUsers.children.length) break;
            currentElement.classList.remove('active');
            currentElement = listOfUsers.children[currentPositionElement];
            currentElement.classList.add('active');
         } else if (currentElement.classList.contains('users-list__item')){
            currentElement.remove();
            if (!listOfUsers.children.length) {
               currentElement = addButton;
               currentElement.classList.add('active');
            } else {
               if (currentPositionElement) currentPositionElement--; 
               currentElement = listOfUsers.children[currentPositionElement];  
               if (currentElement) currentElement.classList.add('active');   
            }
         }  
         break;
      case 'ArrowRight':
         if (currentElement.parentElement.classList.contains('container-input__buttons')){
            if (!currentElement.nextElementSibling) break;
            currentElement.classList.remove('active');
            currentElement = currentElement.nextElementSibling;
            currentElement.classList.add('active');
            positionsButtons++;
         } else if (currentElement.classList.contains('users-list__item')) {
            currentElement.classList.remove('active');
            currentElement = addButton;
            currentElement.classList.add('active');
         }         
         break;   
      case 'ArrowUp':
         if (currentElement.parentElement.classList.contains('container-input__buttons')){
            currentElement.classList.remove('active');
            currentElement = document.getElementById('text');
            currentElement.classList.add('active');
         } else {
            if (!currentElement.previousElementSibling) break;
            currentElement.classList.remove('active');
            currentElement = currentElement.previousElementSibling;
            currentElement.classList.add('active');
            currentPositionElement--; 
         } 
         break;
      case 'ArrowDown':
         if (currentElement.classList.contains('text')){
            currentElement.classList.remove('active');
            currentElement = buttons.children[positionsButtons];
            currentElement.classList.add('active');
         } else if (currentElement.classList.contains('users-list__item')) {
            if (!currentElement.nextElementSibling) break;
            currentElement.classList.remove('active');
            currentElement = currentElement.nextElementSibling;
            currentElement.classList.add('active');   
            currentPositionElement++;      
         } 
         break;
      case 'Enter':
         if (currentElement.classList.contains('button')) {
            firstScreen.style.display = 'none';
            secondScreen.style.display = 'block';
            currentElement = document.getElementById('text');
            currentElement.classList.add('active');
            currentElement.focus();   
         } else if (currentElement.classList.contains('container-input__add')){
            addElement(textInput.value || `something text ${numberOfText++}`);
            removeSecondScreen();    
         } else if (currentElement.classList.contains('container-input__cancel')){
            removeSecondScreen();
         }
         break;
      default:
         break;
   }
});

function getUser({title, img}){
   const li = document.createElement('li');
   li.classList.add('users-list__item');
   li.insertAdjacentHTML('afterbegin', `
      <div class="users-list__image">
         <img src="${img}" alt="user-logo">
      </div>
      <div class="users-list__text">${title}</div>
   `);
   return li;
}

function addElement(text){
   const li = document.createElement('li');
   li.classList.add('users-list__item');
   li.insertAdjacentHTML('afterbegin', `
      <div class="users-list__image">
         <img src="./image/svg/user.svg" alt="user-logo">
      </div>
      <div class="users-list__text">${text}</div>
   `);
   listOfUsers.append(li);
}

function removeSecondScreen(){
   textInput.value = '';
   secondScreen.style.display = 'none';
   firstScreen.style.display = 'flex';  
   currentElement.classList.remove('active');
   currentElement = addButton;   
   currentElement.classList.add('active');
}

