var DataFrame = dfjs.DataFrame;

var rooms_ids = new DataFrame({}, ["Room", "ID-Room"]);
var daily_routines = new DataFrame({}, ["Start-Time", "End-Time", "Room"]);
var weekly_routines = new DataFrame({}, ["Weekly-Day", "Proportion-Month", "Start-Time", "End-Time", "Room"]);

const seccion2 = document.querySelector("#daily-routines")
const seccion3 = document.querySelector("#weekly-routines")
seccion2.style.display = "none"
seccion3.style.display = "none"

room_selector = document.querySelector(".room-controls")
daily_room_selector = document.querySelector("#room-daily")
weekly_room_selector = document.querySelector("#room-weekly")
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
            values: [df.select("Start-Time").toArray().flat(),
                     df.select("End-Time").toArray().flat(),
                     df.select("Room").toArray().flat()],

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
    daily_routines = new DataFrame({}, ["Start-Time", "End-Time", "Room"]);
    weekly_routines = new DataFrame({}, ["Weekly-Day", "Proportion-Month", "Start-Time", "End-Time", "Room"]);
    document.querySelector("#table-rooms").innerHTML = ""
    document.querySelector("#table-daily-routines").innerHTML = ""
    document.querySelector("#table-weekly-routines").innerHTML = ""
    document.querySelector("#startTime").value = ""
    document.querySelector("#endTime").value = ""
    document.querySelector("#startTime").removeAttribute("readonly")
    document.querySelector("#endTime").removeAttribute("readonly")
    count = 0

    room_selector.disabled = false;

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
                    weekly_room_selector.appendChild(newOption.cloneNode(true)); /*BORRAR*/
            
            })
        } 
    }

    // Impedimos que se puedan seleccionar más habitaciones
    room_selector.disabled = true;
    window.location.href = "#daily-routines";
});




/*CODIGO PARA SECCIÓN DOS*/

const validarHoras = function(element){
    const [hora, minuto] = element.value.split(":")
    if (hora.length != 2 || minuto.length != 2){
        element.focus()
        window.alert("Las hora tienen que tener el formato HH:MM")
        return false
    }
    if ((hora > 23 || minuto > 59) || (hora < 0 || minuto < 0)){
        element.focus()
        window.alert("Las horas tienen que ir desde 00:00 hasta 23:59")
        return false
    }

    return true
}

const start_daily = document.querySelector("#startTime")
const end_daily = document.querySelector("#endTime")

const add_daily = document.querySelector("#add-daily")
const reset_daily = document.querySelector("#reset-daily")
const complete_daily = document.querySelector("#complete-daily")

add_daily.addEventListener("click", function(e) {
    if (validarHoras(start_daily) && validarHoras(end_daily)){
        if (daily_room_selector.value === ""){
            daily_room_selector.focus()
            window.alert("Tienes que seleccionar una habitación")
            return
        }
        daily_routines = daily_routines.push({ "Start-Time": start_daily.value, "End-Time": end_daily.value, "Room": daily_room_selector.value})
        show_table_daily(daily_routines)
        start_daily.value = end_daily.value
        end_daily.value = ""
        start_daily.setAttribute("readonly", "readonly")
    }
})

reset_daily.addEventListener("click", function(e) {
    daily_routines = new DataFrame({}, ["Start-Time", "End-Time", "Room"]);
    weekly_routines = new DataFrame({}, ["Weekly-Day", "Proportion-Month", "Start-Time", "End-Time", "Room"]);
    document.querySelector("#table-daily-routines").innerHTML = ""
    document.querySelector("#table-weekly-routines").innerHTML = ""
    start_daily.value = ""
    end_daily.value = ""
    start_daily.removeAttribute("readonly")
    end_daily.removeAttribute("readonly")
    seccion3.style.display = "none"
    daily_room_selector.disabled = false;
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
    window.location.href = "#weekly-routines";
})


/*CODIGO PARA SECCIÓN TRES*/





