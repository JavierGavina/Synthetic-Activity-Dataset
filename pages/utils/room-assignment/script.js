var DataFrame = dfjs.DataFrame;

var rooms_ids = new DataFrame({}, ["Room", "ID-Room"])

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

finish_button = document.querySelector("#finish-rooms-button")
reset_button = document.querySelector("#reset")
reset_button.style.backgroundColor = "#DC1B1B"
reset_button.addEventListener("mouseover", function(e){
    reset_button.style.backgroundColor = "#831414"
})
reset_button.addEventListener("mouseout", function(e){
    reset_button.style.backgroundColor = "#DC1B1B"
})

finish_button.addEventListener("click", function(e){
    if (rooms_ids.count() === 0){
        
        Swal.fire({
            title: 'Error!',
            text: "You have to assign at least one room",
            icon: 'error',
            confirmButtonText: 'Ok'
        }).then(() => {setTimeout(()=>{room_selector.focus()}, 500)})
        return
    }
    Swal.fire({
        title: "Success!",
        text: "Rooms have been assigned and will be downloaded as a JSON file",
        icon: "success",
        confirmButtonText: "Ok"
    }).then(()=>{
        setTimeout(()=>{
            download_dictionaryRooms(rooms_ids)}, 500)
        setTimeout(()=>{
            window.location.href = "./routines.html"
        }, 2000)
    })
})

const download_dictionaryRooms = (df) => {
    const rooms = df.toArray()
    json_out = {}
    rooms.forEach(room => {
        json_out[room[0]] = room[1]
    })
    const rooms_json = JSON.stringify(json_out, null, 2)
    const blob = new Blob([rooms_json], {type: "application/json"})
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "dictionary_rooms.json"
    a.click()
    URL.revokeObjectURL(url)
}


reset_button.addEventListener("click", function(e){
    Swal.fire({
        title: 'Are you sure?',
        text: "This will delete all the rooms assigned",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            var options = rooms_ids.select("Room").toArray().flat();
            
            options.forEach(function(option) {
                var newOption = document.createElement("option");
                newOption.value = option;
                newOption.text = option;
                room_selector.appendChild(newOption);
            });

            rooms_ids = new DataFrame({}, ["Room", "ID-Room"])
            count = 0
            show_table(rooms_ids)

            Swal.fire('Deleted!', 'All rooms have been deleted', 'success')
        }
    })
})