/*DEFINICIÓN DE CONSTANTES*/
const dictionary = {
    "room": 1,
    "living-room":2,
    "tv-room":3,
    "dining-room":4,
    "garden":5,
    "terrace":6,
    "therapy":7,
    "gym":8,
    "corridors":9,
    "bathroom":10,
    "bedroom":11,
    "garage":12,
    "pool":13,
}

const colorPalette = {
    1: '#1f77b4', // room
    2: '#ff7f0e', // living-room
    3: '#2ca02c', // tv-room
    4: '#d62728', // dining-room
    5: '#9467bd', // garden
    6: '#8c564b', // terrace
    7: '#e377c2', // therapy
    8: '#7f7f7f', // gym
    9: '#bcbd22', // corridors
    10: '#17becf', // bathroom
    11: '#aec7e8', // bedroom
    12: '#ffbb78', // garage
    13: '#98df8a', // pool
};

colorScale = [
    [0, '#1f77b4'], // room
    [1/8, '#ff7f0e'], // living-room
    [2/8, '#2ca02c'], // tv-room
    [3/8, '#d62728'], // dining-room
    [4/8, '#9467bd'], // garden
    [5/8, '#8c564b'], // terrace
    [6/8, '#e377c2'], // therapy
    [7/8, '#7f7f7f'], // gym
    [8/8, '#bcbd22'] // corridors
    // [9/13, '#17becf'], // bathroom
    // [10/13, '#aec7e8'], // bedroom
    // [11/13, '#ffbb78'], // garage
    // [12/13, '#98df8a'], // pool
    // [1, '#ff7f0e'], // living-room
]

const mapValueToColor = (value) => {
    return colorPalette[value] || '#000000'; // Devuelve un color negro si el valor no está definido
};

/*GLOBALIZAR VARIABLE JSON*/


var DataFrame = dfjs.DataFrame;

var labelMap = new DataFrame({}, ["Year", "Month", "Day", "Sequence"])

/*OCULTAR INICIALMENTE LAS SECCIONES*/
visualization_labelmap_section = document.querySelector('#visualization-labelmap');
labelmap_section = document.querySelector('#labelmap');

// visualization_labelmap_section.style.display = 'none';
// labelmap_section.style.display = 'none';

/*ANIMACIONES ZONA DRAGABLE*/
dragArea = document.querySelector('#drag-area');
// Evento para cuando un archivo está siendo arrastrado sobre el área
dragArea.addEventListener('dragover', (event) => {
event.preventDefault();
dragArea.classList.add('dragover');
});

// Evento para cuando un archivo sale del área
dragArea.addEventListener('dragleave', () => {
    dragArea.classList.remove('dragover');
});

// Evento para cuando un archivo es soltado en el área
dragArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dragArea.classList.remove('dragover');
    const files = event.dataTransfer.files;
    processFile(files[0]); // Procesa el primer archivo soltado
});

// Evento para cuando se hace clic en el área de arrastre
dragArea.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.accept = '.json';
    fileInput.type = 'file';
    fileInput.click();
    fileInput.addEventListener('change', () => {
        processFile(fileInput.files[0]);
    });
});

const downloadDictionaryRooms = (dictionary) => {
    const dictionary_export = JSON.stringify(dictionary);
    const blob = new Blob([dictionary_export], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dictionary_export.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/*FUNCION PARA PROCESAR EL ARCHIVO JSON*/
const processFile = (file) => {
    // Comprobar que el archivo es un json
    if (file.type != 'application/json') {
        alert('The file must be a JSON');
        return;
    }
    // Leer el archivo como texto
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = readerEvent => {
        const content = readerEvent.target.result;
        try {
            const json = JSON.parse(content);
            visualization_labelmap_section.style.display = 'block';
            labelmap_section.style.display = 'block';
            labelMap = getLabelmap(json);
            if (window.confirm("Do you want to download the dictionary of rooms?")){
                downloadDictionaryRooms(dictionary);
            }
            showPlot();

        } catch (error) {
            alert(error)
            alert('The JSON file is not valid');
        }
    };
    reader.onerror = () => {
        alert('Error while reading the file');
    };
}

const convertToMinutes = function(hour){ 
    return parseInt(hour.split(':')[0])*60 + parseInt(hour.split(':')[1]);
}

const getLabelmap = (json, threshold=0) => {
    dates_labelmap = Object.keys(json);
    dates_labelmap.forEach((date) => {
        let sequence = [];
        let [year, month, day] = date.split('-');
        json[date].intervals.forEach((interval, index) => {
            init = convertToMinutes(interval[0]);
            end = convertToMinutes(interval[1]);
            room = json[date].rooms[index];
            for (let i = init; i < end; i++){
                sequence.push(room);
            }
        })
        labelMap = labelMap.push({Year: parseInt(year), Month: parseInt(month), Day: parseInt(day), Sequence: sequence})
    })
    return labelMap
}

const downloadCSV = (data) => {
    columnas = data.listColumns()
    filas = data.toArray()
    const csvContent = "data:text/csv;charset=utf-8," + columnas.join(",") + "\n" + filas.map(row => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "labelmap.csv");
    document.body.appendChild(link);
    link.click();
}


/*CÓDIGO PARA LA SECCIÓN DE VISUALIZACIÓN*/

// THRESHOLD

threshold_input = document.querySelector('#threshold');
threshold_output = document.querySelector('#threshold-value');

const getArrayDates = (df) => {
    let dates = df.select("Year", "Month", "Day").toArray().map(row => new Date(parseInt(row[0]), parseInt(row[1])-1, parseInt(row[2])));
    return dates
}


const getArraySequences = (df) => {
    let sequences = df.select("Sequence").toArray().map(row => row[0]);
    return sequences
}


const showPlot = () => {
    parent = document.querySelector('.visualization-labelmap-div-2');
    existent = document.querySelector('#labelmap-div');
    new_div = document.createElement('div');
    new_div.id = 'labelmap-div';

    dates = getArrayDates(labelMap);
    sequences = getArraySequences(labelMap);

    console.log(sequences)
    // crear array de 1 a 1440 que se repita por cada fecha
    array_mins = []
    for (let i = 0; i < dates.length; i++){
        for (let j=1; j<1440; j++){
            array_mins.push(j);
        }
    }

    array_days = []
    for (let i=0; i<dates.length; i++){
        for (let j=1; j<1440; j++){
            array_days.push(dates[i]);
        }
    }

    // Process the data for Plotly
    let trace = {
        type: 'heatmap',
        x: array_mins,
        y: array_days,
        z: sequences.flat().map(room => dictionary[room]), // 2D array
        text: sequences.flat(),
        colorscale: "Viridis",
        showscale: false,
    };
    
    let data = [trace];
    
    let layout = {
        title: 'Daily Room Activity',
        xaxis: { title: 'Minute of Day' },
        yaxis: { title: 'Day' },
    };
    
    Plotly.newPlot(new_div, data, layout);
    
    parent.replaceChild(new_div, existent);
    
}



// threshold_input.addEventListener("change", () => {
//     threshold_output.textContent = parseInt(threshold_input.value);

// })


// threshold_input.addEventListener("onclick", () => {
//     threshold_output.textContent = parseInt(threshold_input.value);
// })

