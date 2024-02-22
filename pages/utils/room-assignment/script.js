var DataFrame = dfjs.DataFrame;

const globalColorsLight = {
    prefered_background_color: "#f0f0f0",
    prefered_secondary_background_color: "#ffffff",
    prefered_text_color: "#000",
    select_border_color: "#4e4e4ea4",
    select_background_color: "#fffefe"
}

const globalColorsDark = {
    prefered_background_color : "#0f0f0f",
    prefered_secondary_background_color : "#3d3d3d",
    prefered_text_color : "#fff",
    select_border_color : "#dfdfdfce",
    select_background_color : "#4a4949"
}

/*ANIMACIÓN COLOR*/
const prefersDarkColorScheme = () =>
        window &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
        

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
    document.querySelector("footer").style.position = "relative"

    selectedOption.remove()
    if (defaultOption) {
        defaultOption.remove()
    }

})

// Event listener for preferred color scheme change
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    show_table(rooms_ids);
});



const show_table = (df)=>{
    table = document.querySelector("#table-rooms")
    var data = [{
        type: 'table',
        header: {
            values: df.listColumns(),
            align: 'center',
            line: {width: 1, 
                   color: prefersDarkColorScheme() ? globalColorsLight.prefered_background_color :
                                                     globalColorsDark.prefered_background_color},
            fill: {color: prefersDarkColorScheme() ? "#9A9A9A" : "#EFEEEE"},
            font: {family: 'Arial', size: 13,
                   color: prefersDarkColorScheme() ? globalColorsDark.prefered_text_color :
                                                     globalColorsLight.prefered_text_color}
        },
        cells: {
            values: [df.select("Room").toArray().flat(),
                     df.select("ID-Room").toArray().flat()],
            align: 'center',
            line: {color: prefersDarkColorScheme() ? globalColorsLight.prefered_background_color :
                                                     globalColorsDark.prefered_background_color ,
                   width: 1},
            fill: prefersDarkColorScheme() ? {color: globalColorsDark.prefered_secondary_background_color} :
                                                {color: globalColorsLight.prefered_secondary_background_color},
            font: {family: 'Arial', size: 12,
                   color: prefersDarkColorScheme() ? globalColorsDark.prefered_text_color :
                                                     globalColorsLight.prefered_text_color
            } 
        }
    }];
    
    
    var layout = {
        title: {
            text: "Rooms Assigned",
            font: {
                family: 'Arial',
                size: 20,
                color: prefersDarkColorScheme() ? globalColorsDark.prefered_text_color : 
                                                  globalColorsLight.prefered_text_color
            }
        },
        paper_bgcolor: prefersDarkColorScheme() ? globalColorsDark.prefered_secondary_background_color : 
                                                  globalColorsLight.prefered_secondary_background_color,
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
            document.querySelector("#table-rooms").innerHTML = ""
            document.querySelector("footer").style.position = "absolute"

            Swal.fire('Deleted!', 'All rooms have been deleted', 'success')
        }
    })
})