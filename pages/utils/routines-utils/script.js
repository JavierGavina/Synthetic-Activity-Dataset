var DataFrame = dfjs.DataFrame;

const colores_routines = ["#1D90A7", "#1DA724", "#9BA71D", "#A72F1D",
                          "#1D26A7", "#561DA7", "#B3D3E1", "#CEBAAC",
                          "#831445", "#800000", "#00FFFF", "#008080",
                          "#800080", "#FF7F50", "#87CEEB", "#00FF00",
                          "#1D90A7", "#1DA724", "#9BA71D", "#A72F1D",
                          "#1D26A7", "#561DA7", "#B3D3E1", "#CEBAAC",
                          "#831445", "#800000", "#00FFFF", "#008080",
                          "#800080", "#FF7F50", "#87CEEB", "#00FF00",
                          "#1D90A7", "#1DA724", "#9BA71D", "#A72F1D",
                          "#1D26A7", "#561DA7", "#B3D3E1", "#CEBAAC",
                          "#831445", "#800000", "#00FFFF", "#008080",
                          "#800080", "#FF7F50", "#87CEEB", "#00FF00",
                          "#1D90A7", "#1DA724", "#9BA71D", "#A72F1D",
                          "#1D26A7", "#561DA7", "#B3D3E1", "#CEBAAC",
                          "#831445", "#800000", "#00FFFF", "#008080",
                          "#800080", "#FF7F50", "#87CEEB", "#00FF00",
                          "#1D90A7", "#1DA724", "#9BA71D", "#A72F1D",
                          "#1D26A7", "#561DA7", "#B3D3E1", "#CEBAAC",
                          "#831445", "#800000", "#00FFFF", "#008080",
                          "#800080", "#FF7F50", "#87CEEB", "#00FF00",
                          "#1D90A7", "#1DA724", "#9BA71D", "#A72F1D",
                          "#1D26A7", "#561DA7", "#B3D3E1", "#CEBAAC",
                          "#831445", "#800000", "#00FFFF", "#008080",
                          "#800080", "#FF7F50", "#87CEEB", "#00FF00",
                          "#1D90A7", "#1DA724", "#9BA71D", "#A72F1D",
                          "#1D26A7", "#561DA7", "#B3D3E1", "#CEBAAC",
                          "#831445", "#800000", "#00FFFF", "#008080",
                          "#800080", "#FF7F50", "#87CEEB", "#00FF00"
                        ]
                          
var rooms_ids = new DataFrame({}, ["Room", "ID-Room"]);
var daily_routines = new DataFrame({}, ["Day", "Start-Time", "End-Time", "Room"]);
var assignedRoutines = {};

const seccion2 = document.querySelector("#daily-routines")
const seccion3 = document.querySelector("#schedule-routines")
seccion2.style.display = "none"
seccion3.style.display = "none"

room_selector = document.querySelector(".room-controls")
daily_room_selector = document.querySelector("#room-daily")
var count = 0

room_selector.addEventListener("change", function(e) {
    count++
    defaultOption = document.querySelector('#default')
    selectedOption = document.querySelector(`option[value="${room_selector.value}"]`)

    rooms_ids = rooms_ids.push({Room: e.target.value, "ID-Room": count})
    show_table(rooms_ids)

    selectedOption.remove()
    if (defaultOption) {
        defaultOption.remove()
    }

})


const show_table = (df)=>{
    table = document.querySelector("#table-rooms")
    var data = [{
        type: 'table',
        header: {
            values: df.listColumns(),
            align: 'center',
            line: {width: 1, color: 'black'},
            fill: {color: '#f5f5f5'},
            font: {family: 'Arial', size: 12, color: 'black'}
        },
        cells: {
            values: [df.select("Room").toArray().flat(),
                     df.select("ID-Room").toArray().flat()],
            align: 'center',
            line: {color: 'black', width: 1},
            font: {family: 'Arial', size: 11, color: ['black']}
        }
    }];
    
    var layout = {
        title: 'Tabla Interactiva',
        height: 400,
        width: 600
    };
    
    Plotly.newPlot(table, data, layout);
    document.querySelector("#assign-rooms").replaceChild(table, document.querySelector("#table-rooms"))
    
}

const show_table_daily = (df)=> {
    const div = document.querySelector("#table-daily-routines")
    const table = document.createElement("table")
    aux = df.filter(row => row.get("Day")==count_daily)
    columnas = aux.listColumns()
    valores = aux.toArray()
    const headerRow = document.createElement("tr")
    columnas.forEach(function(columna) {
        const th = document.createElement("th")
        th.textContent = columna
        headerRow.appendChild(th)
    })

    table.appendChild(headerRow)
    index = 0
    valores.forEach(function(fila) {
        const tr = document.createElement("tr")
        fila.forEach(function(valor) {
            const td = document.createElement("td")
            td.textContent = valor
            tr.appendChild(td)
        })
        if (index === valores.length - 1) {
            const td = document.createElement("td")
            td.innerHTML = `<img src="../../../imgs/cancelar.png" alt="delete" class="delete-row"/>`
            tr.appendChild(td)
        }

        table.appendChild(tr)
        index++
    })
    
    div.innerHTML = table.outerHTML
    document.querySelectorAll(".delete-row").forEach(function(deleteButton) {
        deleteButton.style.width = "20px";
        deleteButton.style.height = "20px";
        deleteButton.style.cursor = "pointer";
    
        // Inicializar una variable para almacenar el temporizador
        let hoverTimer;
    
        deleteButton.addEventListener("click", function(e) {
            const row = e.target.parentElement.parentElement;
            const day = row.children[0].textContent;
            const start = row.children[1].textContent;
            const end = row.children[2].textContent;
            const room = row.children[3].textContent;
            daily_routines = daily_routines.filter(row => row.get("Day") != day || row.get("Start-Time") != start || row.get("End-Time") != end || row.get("Room") != room);
            start_daily.value = daily_routines.select("End-Time").toArray().flat().pop();
            end_daily.value = "";
            clearTimeout(hoverTimer);
            if (start_daily.value.split(":").length === 1 || start_daily.value === "23:59"){
                start_daily.value = "00:00";
            }
            show_table_daily(daily_routines);
        });
    
        // Añadir el evento mouseover para iniciar el temporizador
        deleteButton.addEventListener("mouseover", function() {
            hoverTimer = setTimeout(function() {
                Swal.fire({
                    title: 'Delete last activity',
                    text: "Do you want to delete the last activity?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it',
                    cancelButtonText: 'No, keep it',
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Simula un click en el botón de eliminar
                        deleteButton.click();
                    }
                });
            }, 2000); // 2000 milisegundos = 2 segundos
        });
    
        // Añadir el evento mouseout para cancelar el temporizador si el usuario sale antes de 2 segundos
        deleteButton.addEventListener("mouseout", function() {
            clearTimeout(hoverTimer);
        });
    });
    
}

const reset = document.querySelector("#reset")
const finish_room = document.querySelector("#finish-rooms-button")

reset.addEventListener("click", function(e) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will restart all the rooms assigned if you accept",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, restart it',
        cancelButtonText: 'No, keep it',
    }).then((result) => {
        if (result.isConfirmed) {
            var options = rooms_ids.select("Room").toArray().flat();
            
            options.forEach(function(option) {
                var newOption = document.createElement("option");
                newOption.value = option;
                newOption.text = option;
                room_selector.appendChild(newOption);
            });

            seccion2.style.display = "none"
            seccion3.style.display = "none"
            daily_room_selector.innerHTML = `<option value="" disabled selected id="default">--Select a room--</option>`


            /*RESTART ALL DATAFRAMES, TABLES AND COUNTERS*/
            rooms_ids = new DataFrame({}, ["Room", "ID-Room"]);
            daily_routines = new DataFrame({}, ["Day", "Start-Time", "End-Time", "Room"]);
            document.querySelector("#table-rooms").innerHTML = ""
            document.querySelector("#table-daily-routines").innerHTML = ""
            document.querySelector("#startTime").value = "00:00"
            document.querySelector("#endTime").value = ""
            document.querySelector("#endTime").removeAttribute("readonly")
            count = 0

            room_selector.disabled = false;
            daily_room_selector.disabled = false;


            count_daily = 1
            const definedDays = document.querySelector("#defined-days")
            document.querySelectorAll(".dragable-day").forEach(function(day) {
                definedDays.removeChild(day)
            })
        }
    })
}) 

finish_room.addEventListener("click", function(e) {
    if (rooms_ids.count() === 0){
        
        Swal.fire({
            title: 'Error!',
            text: "You have to assign at least one room",
            icon: 'error',
            confirmButtonText: 'Ok'
        }).then(() => {setTimeout(()=>{room_selector.focus()}, 500)})
        return
    }
    if (room_selector.disabled === false){

        seccion2.style.display = "block"
        selected_rooms = rooms_ids.select("Room").toArray().flat()
    
        if (daily_room_selector.children.length === 1 || daily_room_selector.children.length === 0){
            selected_rooms.forEach(function(room) {
                    var newOption = document.createElement("option");
                    newOption.value = room;
                    newOption.text = room[0].toUpperCase() + room.slice(1).toLowerCase();
                    daily_room_selector.appendChild(newOption);
            
            })
        } 
    }

    // Impedimos que se puedan seleccionar más habitaciones
    room_selector.disabled = true;
    window.location.href = "#daily-routines";
});




/*CODIGO PARA SECCIÓN DOS*/

var count_daily = 1

const validarHoras = function(element){
    const [hora, minuto] = element.value.split(":")
    if (hora.length != 2 || minuto.length != 2){
        element.value=""
        Swal.fire({
            title: "Error!",
            text: "Times must be in HH:MM format.",
            icon: "error",
            confirmButtonText: 'Ok'
        }).then(()=>{setTimeout(()=>{element.focus()}, 500)})
        
        return false
    }
    if ((hora > 23 || minuto > 59) || (hora < 0 || minuto < 0)){
        Swal.fire({
            title: "Error!",
            text: "The times must be from 00:00 to 23:59.",
            icon: "error",
            confirmButtonText: 'Ok'
        }).then(()=>{setTimeout(()=>{
            element.value=""
            element.focus()
        }, 300)})
        
        return false
    }

    return true
}

const convertToSeconds = function(hora){
    const [h, m] = hora.split(":")
    return h*3600 + m*60
}

const start_daily = document.querySelector("#startTime")
const end_daily = document.querySelector("#endTime")

const reset_daily = document.querySelector("#reset-daily")
const add_activity = document.querySelector("#add-activity")
const add_daily = document.querySelector("#add-daily")
const complete_daily = document.querySelector("#complete-daily")


end_daily.addEventListener("keyup", function(e) {
    input_char = end_daily.value 
    if (input_char.length === 2){
        end_daily.value += ":"
    }
    if (input_char.length === 6){
        // eliminar última letra
        end_daily.value = end_daily.value.slice(0, -1)
    }
})

end_daily.addEventListener("keydown", function(e){
    if (e.key === "Enter"){
        e.preventDefault()
        add_activity.click()
    }
})

daily_room_selector.addEventListener("keydown", function(e) {
    if (e.key === "Enter"){
        e.preventDefault()
        add_activity.click()
    }
})

const downloadCSV = (data) => {
    columnas = data.listColumns()
    filas = data.toArray()
    const csvContent = "data:text/csv;charset=utf-8," + columnas.join(",") + "\n" + filas.map(row => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "daily_routines.csv");
    document.body.appendChild(link);
    link.click();
}

// const downloadButton = document.querySelector("#download-button");
// downloadButton.addEventListener("click", function(e) {
//     downloadCSV(data);
// });

reset_daily.addEventListener("click", function(e) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will restart all the daily routines if you accept",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, restart it',
        cancelButtonText: 'No, keep it',
    }).then((result) => {
        if (result.isConfirmed) {
            count_daily = 1
            daily_routines = new DataFrame({}, ["Day", "Start-Time", "End-Time", "Room"]);
            document.querySelector("#table-daily-routines").innerHTML = ""
            start_daily.value = "00:00"
            end_daily.value = ""
            end_daily.removeAttribute("readonly")

            seccion3.style.display = "none"
            daily_room_selector.disabled = false;
            const definedDays = document.querySelector("#defined-days")
            document.querySelectorAll(".dragable-day").forEach(function(day) {
                definedDays.removeChild(day)
            })

            document.querySelectorAll('#calendar-container td').forEach(dayCell => {
                if (dayCell.id.startsWith('day-')) {
                    dayCell.style.backgroundColor = ''; // Quita el color de fondo
                    // También puedes eliminar otros estilos que hayas aplicado (e.g., texto, bordes)
                }
            });

            // Resetear la variable JSON assignedRoutines
            assignedRoutines = {};
        }
    })
})

add_activity.addEventListener("click", function(e) {
    if (validarHoras(start_daily) && validarHoras(end_daily)){
        if (convertToSeconds(start_daily.value) >= convertToSeconds(end_daily.value)){
            Swal.fire({
                title: 'Error!',
                text: "The start time cannot be greater than the end time.",
                icon: 'error',
                confirmButtonText: 'Ok'
            }).then(() => {setTimeout(()=>{
                end_daily.value=""
                end_daily.focus()
            }, 500)})
           
            return
        }
        if (daily_room_selector.value === ""){
            Swal.fire({
                title: 'Error!',
                text: "You have to select a room",
                icon: 'error',
                confirmButtonText: 'Ok'
            }).then(() => {setTimeout(()=>{daily_room_selector.focus()}, 500)})
            
            return
        }

        if (end_daily.hasAttribute("readonly")){
            window.alert("Day completed.")
            return
        }

        if (end_daily.value != "23:59"){
            daily_routines = daily_routines.push({"Day": count_daily,  "Start-Time": start_daily.value, "End-Time": end_daily.value, "Room": daily_room_selector.value})
            start_daily.value = end_daily.value
            end_daily.value = ""

        } else {
            daily_routines = daily_routines.push({"Day": count_daily,  "Start-Time": start_daily.value, "End-Time": end_daily.value, "Room": daily_room_selector.value})
            count_daily++
            start_daily.value="00:00"
            end_daily.value=""
            const defined_days = document.querySelector("#defined-days")
            const newContent = document.createElement("div")
            newContent.textContent = `routine day ${count_daily-1}`
            newContent.id = `routine-day-${count_daily-1}`
            newContent.classList.add("dragable-day") // Add the class "dragable-day"
            newContent.style.backgroundColor = colores_routines[count_daily-1]
            // Añadimos swal para mostrar la tabla tanto si hacemos click, como si dejamos el ratón dos segundos encima

            let hoverTimer;

            newContent.addEventListener("click", function(e) {
                count_daily = parseInt(newContent.textContent.split(" ")[2])
                show_table_daily(daily_routines)
                document.querySelector("#table-daily-routines").querySelector("img").remove()
                show_html = document.querySelector("#table-daily-routines").outerHTML
                clearTimeout(hoverTimer);
                Swal.fire({
                    title: `Daily routine ${count_daily}`,
                    html: show_html,
                    confirmButtonText: 'Ok'
                }).then(()=>{document.querySelector("#table-daily-routines").querySelector("img").remove()});
            })

            newContent.addEventListener("mouseover", function() {
                
                hoverTimer = setTimeout(function() {
                    count_daily = parseInt(newContent.textContent.split(" ")[2])
                    show_table_daily(daily_routines)
                    document.querySelector("#table-daily-routines").querySelector("img").remove()
                    show_html = document.querySelector("#table-daily-routines").outerHTML
                    Swal.fire({
                        title: `Daily routine ${count_daily}`,
                        html: show_html,
                        confirmButtonText: 'Ok'
                    });
                }, 2000); // 2000 milisegundos = 2 segundos
            });

            newContent.addEventListener("mouseout", function() {
                clearTimeout(hoverTimer);
            });

            newContent.addEventListener("dragstart", function(e) {
                clearTimeout(hoverTimer);
            })

            newContent.addEventListener("dragend", function(e) {
                clearTimeout(hoverTimer);
            })

            newContent.addEventListener("dragover", function(e) {
                clearTimeout(hoverTimer);
            })

            

            defined_days.insertBefore(newContent, defined_days.querySelector("button"))
        }
        
        show_table_daily(daily_routines)
    }
})

complete_daily.addEventListener("click", function(e) {
    if (daily_routines.count() === 0){
        end_daily.focus()
        Swal.fire({
            title: 'Error!',
            text: "You have to assing at least one daily activity",
            icon: 'error',
            confirmButtonText: 'Ok'
        })
        return
    }

    if (daily_room_selector.disabled === false){
        seccion3.style.display = "block"
        selected_rooms = rooms_ids.select("Room").toArray().flat()
        } 

    if (start_daily.value != "00:00" || end_daily.value != ""){
        end_daily.focus()
        Swal.fire({
            title: 'Error!',
            text: "You have not finished the daily routine, you have to introduce the last interval as 23:59",
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    } else {
        daily_room_selector.disabled = true;
        start_daily.value=""
        end_daily.value=""
        start_daily.setAttribute("readonly", "readonly")
        end_daily.setAttribute("readonly", "readonly")
        
        Swal.fire({
            title: 'Daily routine completed!',
            text: "Do you want to download a csv with your daily routines?",
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Yes, download it',
            cancelButtonText: 'No, thanks',
        }).then((result) => {
            if (result.isConfirmed) {
                downloadCSV(daily_routines);
            }
        }).finally(() => {
            setTimeout(()=>{window.location.href = "#schedule-routines"}, 500)
        });
        // const respuesta = window.confirm("Do you want to download a csv with your daily routines?")
        // if (respuesta){
        //     downloadCSV(daily_routines);
        // }
        dragables = document.querySelectorAll(".dragable-day")
    
        dragables.forEach((dragable) => {
            dragable.draggable = true
            dragable.addEventListener("click", function(e) {
                count_daily = parseInt(dragable.textContent.split(" ")[2])
                show_table_daily(daily_routines)
                // move with a scroll to #table-daily-routines
                window.location.href = "#daily-routines"
            })
            dragable.addEventListener("dragstart", function(e) {
                e.dataTransfer.setData("text/plain", dragable.id);
            })
        })
    }
})


/*CODIGO PARA SECCIÓN CALENDARIO*/

// Automatizar creación de calendario
const getCalendarArray = function(year, month){
    const firstDay = new Date(year, month - 1, 1).getDay();
    const lastDate = new Date(year, month, 0).getDate();
    const weeks = Math.ceil((firstDay + lastDate) / 7);
    const calendar = [];
    let date = 1;
    for (let i = 0; i < weeks; i++) {
        calendar[i] = [];
        for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
            calendar[i][j] = '';
        } else if (date > lastDate) {
            calendar[i][j] = '';
            date++;
        } else {
            calendar[i][j] = date++;
        }
        }
    }
    return calendar;
}

const DOMCalendar = function(year, month){
    const months_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const calendarArray = getCalendarArray(year, month);
    const tbody = document.querySelector('#calendar-container');
    tbody.innerHTML = '';
    const title = document.createElement('h3');
    title.textContent = `${year}, ${months_names[month-1]}`;
    tbody.appendChild(title);
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(function(day){
        const th = document.createElement('th');
        th.textContent = day;
        tbody.appendChild(th);
    })
    for (let i = 0; i < calendarArray.length; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < calendarArray[i].length; j++) {
            const td = document.createElement('td');
            td.textContent = calendarArray[i][j];
            if (td.textContent != '') {
                td.id = `day-${calendarArray[i][j]}`
            }
            tr.appendChild(td);
            }
        tbody.appendChild(tr);
    }

    // Después de generar el calendario, restaura los colores basándote en assignedRoutines
    for (let date in assignedRoutines) {
        if (assignedRoutines.hasOwnProperty(date)) {
            const dateInfo = date.split('-');
            const routineYear = dateInfo[0];
            const routineMonth = dateInfo[1];
            const routineDay = dateInfo[2];

            // Si el año y el mes coinciden con la fecha actual del calendario
            if (routineYear == year && routineMonth == month) {
                const dayCell = document.getElementById(`day-${routineDay}`);
                if (dayCell) {
                    // Aplica el color guardado en assignedRoutines a la celda correspondiente
                    dayCell.style.backgroundColor = colores_routines[assignedRoutines[`${routineYear}-${routineMonth}-${routineDay}`]["typeDate"]]; // Asegúrate de que 'color' es una propiedad guardada en assignedRoutines
                }
            }
        }
    }
}

function addDraggableEvents() {
    document.querySelectorAll('.dragable-day').forEach(dragable => {
        dragable.addEventListener('dragstart', dragStart);
    });
}

function addDropEvents() {
    document.querySelectorAll('#calendar-container td').forEach(dayCell => {
        if (dayCell.id.startsWith('day-')) {
            dayCell.addEventListener('drop', drop);
            dayCell.addEventListener('dragover', (event) => event.preventDefault()); // Necesario para permitir el drop
            dayCell.addEventListener("dblclick", dayDoubleClick); // Manejar doble click en cada celda del día
        }
    });
}

function dayDoubleClick(e) {
    const dayCell = e.target;
    if (dayCell.style.backgroundColor != '') {
        dayCell.style.backgroundColor = ''; // Quita el color de fondo
        delete assignedRoutines[`${year_selector.value}-${month.value}-${dayCell.textContent}`];
    }
}

// Función para manejar el inicio del arrastre
function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
}


function updateCalendar(year, month) {
    DOMCalendar(year, month);
    addDraggableEvents(); // Vuelve a aplicar eventos dragstart a los dragables
    addDropEvents();      // Vuelve a aplicar eventos drop a las celdas del calendario
}

// Llamar a updateCalendar inicialmente

// Obtener fecha actual
const currentDate = new Date();
const actualYear = currentDate.getFullYear();
const actualMonth = currentDate.getMonth() + 1;

updateCalendar(actualYear, actualMonth);

const year_selector = document.querySelector("#year")
const month_selector = document.querySelector("#month")

year_selector.value = actualYear
month_selector.value = actualMonth

year_selector.addEventListener("change", function(e) {
    year_value = year_selector.value
    month_value = month_selector.value
    updateCalendar(year_value, month_value)
})

month_selector.addEventListener("change", function(e) {
    year_value = year_selector.value
    month_value = month_selector.value
    updateCalendar(year_value, month_value)
})



// Función para manejar la caída
function drop(event) {
    event.preventDefault();
    const dragableDayId = event.dataTransfer.getData("text");
    const dragableDayElement = document.getElementById(dragableDayId);
    const routineName = dragableDayElement.textContent;
    const dayCell = event.target;
    const date = dayCell.textContent;

    // Cambiar el color de la celda al color del draggable
    const color = dragableDayElement.style.backgroundColor;
    dayCell.style.backgroundColor = color

    // Agregar la información al objeto JSON
    DayOfRoutine = routineName.split(" ")[2]
    aux = daily_routines.filter(row => row.get("Day") == DayOfRoutine)
    starts = aux.select("Start-Time").toArray().flat()
    ends = aux.select("End-Time").toArray().flat()
    hours_array = starts.map((start, index) => [start, ends[index]])
    rooms_array = aux.select("Room").toArray().flat()
    assignedRoutines[`${year_selector.value}-${month.value}-${date}`] = {
        typeDate: DayOfRoutine,
        intervals: hours_array,
        rooms: rooms_array
    };
}

convertToDateTime = function(date){
    const [year, month, day] = date.split("-")
    return new Date(year, month-1, day)
}

getArrayNativeDates = function(dates){
    return dates.map(date => convertToDateTime(date))
}

reconvertToDateString = function(date){
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}


const export_routines = document.querySelector("#export-routines")
export_routines.addEventListener("click", function(e) {
    Swal.fire({
        title: "Succesful",
        text: "The routines have been scheduled successfully",
        icon: "success",
        confirmButtonText: 'Ok'
    }).then(() => {
        // Order the object by date
        const orderedRoutines = {};
        getArrayNativeDates(Object.keys(assignedRoutines)).sort((a,b)=>a-b).forEach(function(key) {
            date_string = reconvertToDateString(key)
            orderedRoutines[date_string] = assignedRoutines[date_string];
        });
        const routines = JSON.stringify(orderedRoutines, null, 5);
        const blob = new Blob([routines], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "assigned_routines.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    })
})

const reset_calendar = document.querySelector("#reset-calendar")
reset_calendar.addEventListener("click", function(e) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will restart all the calendar if you accept",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, restart it',
        cancelButtonText: 'No, keep it',
    }).then((result) => {
        if (result.isConfirmed) {
            document.querySelectorAll('#calendar-container td').forEach(dayCell => {
                if (dayCell.id.startsWith('day-')) {
                    dayCell.style.backgroundColor = ''; // Quita el color de fondo
                    // También puedes eliminar otros estilos que hayas aplicado (e.g., texto, bordes)
                }
            });
            assignedRoutines = {};
        }
    })
})




