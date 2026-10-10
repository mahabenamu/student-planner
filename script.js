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


function addTask(){
    let inputBox = document.createElement("input");
    tasks.appendChild(inputBox);

}