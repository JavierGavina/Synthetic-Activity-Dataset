var DataFrame = dfjs.DataFrame;

var rooms_ids = new DataFrame({}, ["Room", "ID-Room"]);
var daily_routines = new DataFrame({}, ["Start-Time", "End-Time", "Room"]);
var weekly_routines = new DataFrame({}, ["Weekly-Day", "Proportion-Month", "Start-Time", "End-Time", "Room"]);

const seccion2 = document.querySelector("#daily-routines")
seccion2.style.display = "none"

room_selector = document.querySelector(".room-controls")
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
    var select = document.querySelector(".room-controls");
    
    options.forEach(function(option) {
        var newOption = document.createElement("option");
        newOption.value = option;
        newOption.text = option;
        select.appendChild(newOption);
    });

    seccion2.style.display = "none"
    seccion2.querySelectorAll("option").forEach(function(option) {
        if (option.value != ""){
            option.remove()
        }
    })

    /*RESTART ALL DATAFRAMES, TABLES AND COUNTERS*/
    rooms_ids = new DataFrame({}, ["Room", "ID-Room"]);
    daily_routines = new DataFrame({}, ["Start-Time", "End-Time", "Room"]);
    document.querySelector("#table-rooms").innerHTML = ""
    document.querySelector("#table-daily-routines").innerHTML = ""
    document.querySelector("#startTime").value = ""
    document.querySelector("#endTime").value = ""
    document.querySelector("#startTime").removeAttribute("readonly")
    count = 0

    room_selector.disabled = false;

    // Restaurar evento finish_room
}) 

finish_room.addEventListener("click", function(e) {
    if (room_selector.disabled === false){

        seccion2.style.display = "block"
        rooms = document.querySelector("#room-daily")
        selected_rooms = rooms_ids.select("Room").toArray().flat()
        console.log(rooms.children.length)
        if (rooms.children.length === 0){
            selected_rooms.forEach(function(room) {
                    var newOption = document.createElement("option");
                    newOption.value = room;
                    newOption.text = room[0].toUpperCase() + room.slice(1).toLowerCase();
                    rooms.appendChild(newOption);
            
            })
        } 
    }

    // Impedimos que se puedan seleccionar más habitaciones
    room_selector.disabled = true;
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

const start = document.querySelector("#startTime")
const end = document.querySelector("#endTime")

const add_daily = document.querySelector("#add-daily")
const reset_daily = document.querySelector("#reset-daily")
const complete_daily = document.querySelector("#complete-daily")

add_daily.addEventListener("click", function(e) {
    if (validarHoras(start) && validarHoras(end)){
        daily_routines = daily_routines.push({ "Start-Time": start.value, "End-Time": end.value, "Room": rooms.value})
        show_table_daily(daily_routines)
        start.value = end.value
        end.value = ""
        start.setAttribute("readonly", "readonly")
    }
})

reset_daily.addEventListener("click", function(e) {
    daily_routines = new DataFrame({}, ["Start-Time", "End-Time", "Room"]);
    document.querySelector("#table-daily-routines").innerHTML = ""
    start.value = ""
    end.value = ""
    start.removeAttribute("readonly")
})








