var DataFrame = dfjs.DataFrame;

var rooms_ids = new DataFrame({}, ["Room", "ID-Room"]);
var daily_routines = new DataFrame({}, ["Start-Time", "End-Time", "Room"]);

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

    rooms_ids = new DataFrame({}, ["Room", "ID-Room"]);
    document.querySelector("#table-rooms").innerHTML = ""
    count = 0
}) 

finish_room.addEventListener("click", function(e) {
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
});


const validarHoras = function(string){
    const [hora, minuto] = string.split(":")
    if (hora.length != 2 || minuto.length != 2){
        
        return false
    }
    if (hora > 23 || minuto > 59){
        return false
    }
    
    if (hora < 0 || minuto < 0){
        return false
    }

    return true
}

const start = document.querySelector("#startTime")
const end = document.querySelector("#endTime")

const add_daily = document.querySelector("#add-daily")
add_daily.addEventListener("click", function(e) {
    if (validarHoras(start.value) && validarHoras(end.value)){
        daily_routines = daily_routines.push({ "Start-Time": start.value, "End-Time": end.value, "Room": rooms.value})
        show_table_daily(daily_routines)
        start.value = end.value
        end.value = ""
        start.setAttribute("readonly", "readonly")

    } else {
        alert("Horas no válidas")
    }
})







