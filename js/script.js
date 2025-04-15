const button = document.querySelector(".buttonAddTask");
const input = document.querySelector(".inputTask");
const completList = document.querySelector(".listTask");
const darkModeToggle = document.querySelector("#darkModeToggle");
const container = document.querySelector(".container");


let myList = [];

darkModeToggle.addEventListener("click", () => {
  container.classList.toggle("dark");

    if (container.classList.contains("dark")) {
      localStorage.setItem("darkMode", "enabled");
   } else {
      localStorage.setItem("darkMode", "disabled");
    };
});

function taskDone(index){
  myList[index].done = !myList[index].done;
  

  if (myList[index].done) {
    const doneTask = myList.splice(index, 1)[0];
    myList.push(doneTask);
  } else {
    myList.sort((a, b) => a.done - b.done);
  }

  printTask();
}

window.addEventListener("load", () => {
  const savedMode = localStorage.getItem("darkMode");
  if (savedMode === "enabled") {
    container.classList.add("dark");
  } 
});

document.addEventListener('keydown', (event) => {
  const active = document.activeElement;
  const isEditing = active.tagName === "p" && active.isContentEditable;

  if (event.shiftKey === 'Enter' && shiftKey && !isEditing) {
      event.preventDefault();
      addNewTask();
    }
  if (event.shiftKey === 'Enter' && !event.shiftKey && !isEditing) {
      event.preventDefault();
    }
  
  if (event.key === 'Delete' && !isEditing) {
    if (myList.length > 0) {
      deleteItem(myList.length - 1);
    }
  }
});
function addNewTask() {
  const tarefaTexto = input.value.trim();
  const selectedPriority = document.querySelector('input[name="priority"]:checked');
  const today = new Date().toLocaleDateString();
  if (tarefaTexto === "") {
    alert("Por favor, digite uma tarefa antes de adicionar!")
    return;
  }
  if (!selectedPriority) {
    alert("Por favor, selecione a prioridade da tarefa!")
    return;
  }


  myList.push({
    tarefa: tarefaTexto,
    done: false,
    prioridade: selectedPriority.value,
    deadline: today
  });

  input.value = '';
  selectedPriority.checked = false;

  printTask();
}

function printTask() {
  let newLi = ""

  myList.forEach((item, index) => {
    newLi =
      newLi +
      `

      <li class="task ${item.done ? "done" : ""} priority-${item.prioridade}" 
      draggable="true" 
      ondragstart="dragStart(event, ${index})" 
      ondragover="dragOver(event)" 
      ondrop="drop(event, ${index})">
        <img src="assets/img/checked.png" alt="checkNaTarefa" onclick="taskDone(${index})"/>
        <p contenteditable="true" onblur="editTask(${index}, this.innerText)">${item.tarefa}</p>
        <small contenteditable="true" onblur="editDeadline(${index}, this.innerText)"><strong>Deadline:</strong> ${item.deadline}</small>
        <img src="assets/img/trash.png" alt="tarefaLixo" onclick="deleteItem(${index})"/>
      </li>
      
      `
  });

  completList.innerHTML = newLi;


  localStorage.setItem('list', JSON.stringify(myList))

}

function editDeadline(index, newDate) {
  myList[index].deadline = newDate.trim();
  localStorage.setItem('list', JSON.stringify(myList));
}

function editTask(index, newText) {
  myList[index].tarefa = newText.trim();
  localStorage.setItem('list', JSON.stringify(myList));
}

function taskDone(index){
  myList[index].done =  !myList[index].done

  printTask();
}

function deleteItem(index) {
  myList.splice(index, 1)

  printTask();
}

function loadingTask() {
  const localStorageTasks = localStorage.getItem('list')
  if(localStorageTasks){
    myList = JSON.parse(localStorageTasks)
  }
  printTask();
}

loadingTask()

button.addEventListener("click", addNewTask);


let draggedIndex = null;

function dragStart(event, index) {
  draggedIndex = index;
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event, dropIndex) {
  event.preventDefault();

  if (draggedIndex === null || draggedIndex === dropIndex) return;

  const draggedItem = myList[draggedIndex];
  myList.splice(draggedIndex, 1);
  myList.splice(dropIndex, 0, draggedItem);

  draggedIndex = null;
  printTask();

}


