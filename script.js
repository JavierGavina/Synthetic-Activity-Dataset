var DataFrame = dfjs.DataFrame;

var rooms_ids = new DataFrame({}, ["Room", "ID-Room"]);

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

const reset = document.querySelector("#reset")
reset.addEventListener("click", function(e) {
    var options = rooms_ids.select("Room").toArray().flat();
    var select = document.querySelector(".room-controls");
    
    options.forEach(function(option) {
        var newOption = document.createElement("option");
        newOption.value = option;
        newOption.text = option;
        select.appendChild(newOption);
    });

    rooms_ids = new DataFrame({}, ["Room", "ID-Room"]);
    document.querySelector("#table-rooms").innerHTML = ""
    count = 0
}) 



