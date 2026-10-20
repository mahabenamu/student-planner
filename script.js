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

let selectedDateKey = "";
let events = JSON.parse(localStorage.getItem("events")) || {};

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
        const dateKey = 
         currentYear + "-" + 
         String(currentMonth + 1).padStart(2, "0") + "-" +
         String(i).padStart(2, "0");

        const isToday = 
         i === today.getDate() &&
         currentMonth === today.getMonth() &&
         currentYear === today.getFullYear();

        const dateClass = isToday ? "today" : "date";

        calendarGrid.innerHTML += `
        <div class="${dateClass}">
         <span>${i}</span>
         <div class="event-list" data-date="${dateKey}"></div>
        </div>
        `;
    }

    calendarGrid.querySelectorAll(".date, .today").forEach(function(dateCell){
        dateCell.addEventListener("click", function(){
            const day = Number(dateCell.querySelector("span").textContent);

            const clickedDate = new Date(currentYear, currentMonth, day);

            selectedDateKey = 
               clickedDate.getFullYear() + "-" +
               String(clickedDate.getMonth() + 1).padStart(2, "0") + "-" +
               String(clickedDate.getDate()).padStart(2,"0");

            eventForm.style.display = "block";

            selectedDate.textContent = 
               "plans for " + clickedDate.toLocaleDateString("en-GB", {
                   day: "numeric",
                   month: "long",
                   year: "numeric"
               });
        });
    });

    displayEvents();

}

function displayEvents() {
    document.querySelectorAll(".event-list").forEach(function(eventList) {
        const dateKey = eventList.dataset.date;

        eventList.innerHTML = "";

        if (events[dateKey]) {
            events[dateKey].forEach(function(title, index) {
                const eventItem = document.createElement("div");

                const eventText = document.createElement("span");
                eventText.textContent = title;

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "x";

                deleteButton.addEventListener("click", function(event) {
                    event.stopPropagation();
                    events[dateKey].splice(index, 1);

                    if (events[dateKey].length === 0) {
                        delete events[dateKey];
                    }

                    localStorage.setItem("events", JSON.stringify(events));
                    displayEvents();
                    displayTodayEvents();
                });

                eventItem.appendChild(eventText);
                eventItem.appendChild(deleteButton);
                eventList.appendChild(eventItem);

            });
        }
    });
}

function displayTodayEvents() {
    const todayEvents = document.getElementById("today-events");
    todayEvents.innerHTML = "";

    const todayKey =
     today.getFullYear() + "-" +
     String(today.getMonth() + 1).padStart(2, "0") + "-" +
     String(today.getDate()).padStart(2, "0");

    if (events[todayKey] && events[todayKey].length > 0) {
        events[todayKey].forEach(function(title){
            const eventItem = document.createElement("li");
            eventItem.textContent = title;
            todayEvents.appendChild(eventItem);
        });
    } else {
        const emptyMessage = document.createElement("li");
        emptyMessage.textContent = "nothing planned for today";
        todayEvents.appendChild(emptyMessage);
    }
}

generateCalendar();
displayTodayEvents();

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

const notesContent = document.getElementById("notes-content");

notesContent.addEventListener("input", function(){
    localStorage.setItem("savedNotes", notesContent.value);
});

notesContent.value = localStorage.getItem("savedNotes") || "";

const eventForm = document.getElementById("event-form");
const selectedDate = document.getElementById("selected-date");
const eventTitle = document.getElementById("event-title");
const saveEventButton = document.getElementById("save-event");
const cancelEventButton = document.getElementById("cancel-event");


saveEventButton.addEventListener("click", function() {
    const title = eventTitle.value.trim();

    if(title === "") {
        return;
    }

    if (!events[selectedDateKey]) {
        events[selectedDateKey] = [];
    }

    events[selectedDateKey].push(title);

    localStorage.setItem("events", JSON.stringify(events));
    displayEvents();
    displayTodayEvents();

    eventTitle.value = "";
    eventForm.style.display = "none";
});

cancelEventButton.addEventListener("click", function() {
    eventTitle.value = "";
    eventForm.style.display = "none";
});