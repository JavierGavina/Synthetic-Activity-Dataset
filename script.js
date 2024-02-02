var DataFrame = dfjs.DataFrame;

var rooms_ids = new DataFrame({}, ["Room", "ID-Room"]);
var daily_routines = new DataFrame({}, ["Day", "Start-Time", "End-Time", "Room"]);

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
    table = document.querySelector("#table-daily-routines")
    aux = df.filter(row => row.get("Day")==count_daily)
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
            values: [aux.select("Day").toArray().flat(),
                     aux.select("Start-Time").toArray().flat(),
                     aux.select("End-Time").toArray().flat(),
                     aux.select("Room").toArray().flat()],

            align: 'center',
            line: {color: 'black', width: 1},
            font: {family: 'Arial', size: 11, color: ['black']}
        }
    }];
    
    var layout = {
        title: `Routines Day ${count_daily}`,
        height: 400,
        width: 600
    };
    
    Plotly.newPlot(table, data, layout);
    document.querySelector(".routine-assignment").replaceChild(table, document.querySelector("#table-daily-routines"))
    
}

const reset = document.querySelector("#reset")
const finish_room = document.querySelector("#finish-rooms-button")

reset.addEventListener("click", function(e) {
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


    // Restaurar evento finish_room
}) 

finish_room.addEventListener("click", function(e) {
    if (rooms_ids.count() === 0){
        room_selector.focus()
        window.alert("Tienes que asignar al menos una habitación")
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
        element.focus()
        window.alert("Las hora tienen que tener el formato HH:MM")
        return false
    }
    if ((hora > 23 || minuto > 59) || (hora < 0 || minuto < 0)){
        element.value=""
        element.focus()
        window.alert("Las horas tienen que ir desde 00:00 hasta 23:59")
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
        if (end_daily.hasAttribute("readonly")){
            add_daily.click()
        } else {
            add_activity.click()
        }
    }
})

daily_room_selector.addEventListener("keydown", function(e) {
    if (e.key === "Enter"){
        e.preventDefault()
        if (end_daily.hasAttribute("readonly")){
            add_daily.click()
        } else {
            add_activity.click()
        }
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
})

add_activity.addEventListener("click", function(e) {
    if (validarHoras(start_daily) && validarHoras(end_daily)){
        if (convertToSeconds(start_daily.value) > convertToSeconds(end_daily.value)){
            end_daily.value=""
            end_daily.focus()
            window.alert("La hora de inicio no puede ser mayor a la hora de fin")
            return
        }
        if (daily_room_selector.value === ""){
            daily_room_selector.focus()
            window.alert("Tienes que seleccionar una habitación")
            return
        }

        if (end_daily.hasAttribute("readonly")){
            window.alert("Dia completo")
            return
        }

        if (end_daily.value != "23:59"){
            daily_routines = daily_routines.push({"Day": count_daily,  "Start-Time": start_daily.value, "End-Time": end_daily.value, "Room": daily_room_selector.value})
            start_daily.value = end_daily.value
            end_daily.value = ""

        } else {
            end_daily.setAttribute("readonly", "readonly")
            daily_routines = daily_routines.push({"Day": count_daily,  "Start-Time": start_daily.value, "End-Time": end_daily.value, "Room": daily_room_selector.value})
        }
        
        show_table_daily(daily_routines)
    }
})



add_daily.addEventListener("click", function(e) {
    if (daily_routines.count() === 0){
        end_daily.focus()
        window.alert("Tienes que asignar al menos una actividad diaria")
        return
    }
    if (end_daily.value != "23:59"){
        end_daily.focus()
        window.alert("Tienes que asignar al menos una actividad")
        return
    }
    count_daily++
    start_daily.value="00:00"
    end_daily.value=""
    end_daily.removeAttribute("readonly")
    const defined_days = document.querySelector("#defined-days")
    const newContent = document.createElement("div")
    newContent.textContent = `routine day ${count_daily-1}`
    newContent.id = `routine-day-${count_daily-1}`
    newContent.classList.add("dragable-day") // Add the class "dragable-day"
    defined_days.appendChild(newContent)
})



complete_daily.addEventListener("click", function(e) {
    if (daily_routines.count() === 0){
        start_daily.focus()
        window.alert("Tienes que asignar al menos una rutina diaria")
        return
    }

    if (daily_room_selector.disabled === false){
        seccion3.style.display = "block"
        selected_rooms = rooms_ids.select("Room").toArray().flat()
        } 
    
    daily_room_selector.disabled = true;
    start_daily.value=""
    end_daily.value=""
    start_daily.setAttribute("readonly", "readonly")
    end_daily.setAttribute("readonly", "readonly")
    window.location.href = "#schedule-container";
    const respuesta = window.confirm("¿Deseas descargar un csv con las rutinas diarias?")
    if (respuesta){
        downloadCSV(daily_routines);
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
}

DOMCalendar(2024, 2)

const year_selector = document.querySelector("#year")
const month_selector = document.querySelector("#month")

year_selector.addEventListener("change", function(e) {
    year_value = year_selector.value
    month_value = month_selector.value
    DOMCalendar(year_value, month_value)
})

month_selector.addEventListener("change", function(e) {
    year_value = year_selector.value
    month_value = month_selector.value
    DOMCalendar(year_value, month_value)
})
