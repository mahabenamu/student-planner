const today = new Date();

document.getElementById("today-day").textContent =
 today.toLocaleDateString("en-GB", { weekday: "long"});

document.getElementById("today-full-date").textContent =
 today.toLocaleDateString("en-GB",{
    day: "numeric",
    month: "long"
 });

 document.getElementById("today-year").textContent = 
 today.getFullYear();

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();



const monthYear = document.getElementById("month-year");
const calendarGrid = document.getElementById("calendar-grid");

function generateCalendar() {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();

    const displayedDate = new Date(currentYear, currentMonth, 1);

    monthYear.textContent = displayedDate.toLocaleDateString("en-US",{
        month: "long",
        year: "numeric"
    });

    calendarGrid.innerHTML = "";

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let day of weekdays){
        calendarGrid.innerHTML += `<div class="weekday">${day}</div>`;

    }

    for (let i = 0; i < firstDay; i++){
        calendarGrid.innerHTML += `<div></div>`;
    }

    for (let i = 1; i <= daysInMonth; i++){
        if ( i === today.getDate() &&
             currentMonth === today.getMonth() &&
             currentYear === today.getFullYear()
            ){calendarGrid.innerHTML += `<div class="today">${i}</div>`;} 
            else {
        calendarGrid.innerHTML += `<div class="date">${i}</div>`;
        }
    }
}

generateCalendar();

const nextButton = document.getElementById("next-month");
const prevButton = document.getElementById("prev-month");

nextButton.addEventListener("click", function(){
    currentMonth++;
    generateCalendar();
});

prevButton.addEventListener("click", function() {
    currentMonth--;
    generateCalendar();
})

const tasks = document.getElementById("tasks");

function saveTasks() {
    let savedTasks = [];

    tasks.querySelectorAll("li").forEach(function(listItem){
        let checkbox = listItem.querySelector('input[type="checkbox"]');
        let task = listItem.querySelector("span");

        if(checkbox && task) {
            savedTasks.push({
                text: task.textContent,
                completed: checkbox.checked
            });
        }
    });

    localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

function addTask(){
    let listItem = document.createElement("li");
    let inputBox = document.createElement("input");
    
    inputBox.type = "text";
    inputBox.placeholder = "write a task...";

    inputBox.addEventListener("keydown", function(event){
        if (event.key === "Enter") {
            let taskText = inputBox.value.trim();

          if (taskText === "") {
            return;
          }
          
          let checkbox = document.createElement("input");
          checkbox.type = "checkbox";

          let task = document.createElement("span");
          task.textContent = taskText;

          let deleteButton = document.createElement("button");
          deleteButton.textContent = "x";

          deleteButton.addEventListener("click", function(){
            listItem.remove();
            saveTasks();
            updateTaskCount();
          });

          checkbox.addEventListener("change", function() {
            task.classList.toggle("completed", checkbox.checked);
            saveTasks();
            updateTaskCount();
            });

          inputBox.replaceWith(checkbox);
          checkbox.after(task);
          task.after(deleteButton);
          saveTasks();
          updateTaskCount();

        }
    });

    listItem.appendChild(inputBox);
    tasks.appendChild(listItem);

    inputBox.focus();

};

function loadTasks() {
    let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.forEach(function(savedTask) {

        let listItem = document.createElement("li");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = savedTask.completed;

        let task = document.createElement("span");
        task.textContent = savedTask.text;
        task.classList.toggle("completed", checkbox.checked);

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "x";

        deleteButton.addEventListener("click", function(){
            listItem.remove();
            saveTasks();
            updateTaskCount();
          });

          checkbox.addEventListener("change", function() {
            task.classList.toggle("completed", checkbox.checked);
            saveTasks();
            updateTaskCount();
            });

        listItem.appendChild(checkbox);
        listItem.appendChild(task);
        listItem.appendChild(deleteButton);

        tasks.appendChild(listItem);

    });

    updateTaskCount();
};

loadTasks();

function updateTaskCount() {
    let allTasks = tasks.querySelectorAll("li");
    let totalTasks = allTasks.length;
    let completedTasks = tasks.querySelectorAll('input[type="checkbox"]:checked').length;
    let tasksLeft = totalTasks - completedTasks;

    document.getElementById("task-count").textContent = tasksLeft + "/" + totalTasks;

    let progress = 0;

    if(totalTasks > 0) {
        progress = (completedTasks / totalTasks) * 100;
    }

    document.getElementById("progress-fill").style.width = progress + "%";
}