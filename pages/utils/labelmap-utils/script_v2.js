

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
    14: '#ff9896', // kitchen
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

/*TODAS LAS VARIABLES GLOBALES*/
var json = {}; // JOINED DATA

var DataFrame = dfjs.DataFrame;

var labelMap = new DataFrame({}, ["Year", "Month", "Day", "Sequence"])
var dictionary;
var dictionary_inverse
var daily_routines;
var assigned_routines;

// Objeto para mantener el estado de los archivos cargados
const filesLoaded = {
    "dictionary_rooms.json": false,
    "daily_routines.json": false,
    "assigned_routines.json": false
}

// Objeto para almacenar el contenido de los archivos cargados
const fileContents = {
    "dictionary_rooms.json": null,
    "daily_routines.json": null,
    "assigned_routines.json": null
};


/*OCULTAR INICIALMENTE LAS SECCIONES*/
visualization_labelmap_section = document.querySelector('#visualization-labelmap');
labelmap_section = document.querySelector('#labelmap');

visualization_labelmap_section.style.display = 'none';
labelmap_section.style.display = 'none';



/*ANIMACIONES QUE COMPARTEN TODOS LOS DRAGABLES*/
document.querySelectorAll(".drag-area").forEach((dragArea) => {
    
    const handleDragOver = function(e) {
        e.preventDefault();
        this.classList.add("dragover");
    };
    
    const handleDragLeave = function(e) {
        this.classList.remove("dragover");
    };
    
    const handleDrop = function(e) {
        e.preventDefault();
        this.classList.remove("dragover");
        handleFileUpload(e, this);
    };
    
    const handleClick = function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.onchange = function(e) {
            handleFileUpload(e, dragArea);
        };
        fileInput.click();
    };
    
    addEventListeners(dragArea)
    
    function addEventListeners(dragArea) {
        dragArea.addEventListener("dragover", handleDragOver);
        dragArea.addEventListener("dragleave", handleDragLeave);
        dragArea.addEventListener("drop", handleDrop);
        dragArea.addEventListener("click", handleClick);
    }

    function removeEventListeners(dragArea) {
        dragArea.removeEventListener("dragover", handleDragOver);
        dragArea.removeEventListener("dragleave", handleDragLeave);
        dragArea.removeEventListener("drop", handleDrop);
        dragArea.removeEventListener("click", handleClick);
    }

    function resetDragArea(dragArea) {
        dragArea.innerHTML = "Drag files here or click to select";
        addEventListeners(dragArea);
    }
    
    function handleFileUpload(e, dragArea) {
        const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
        if (files.length > 0) {
            const file = files[0]; // Si se selecciona más de uno, solo se toma el primero
            const expectedFileName = dragArea.getAttribute("nameFile"); // Obtiene el nombre de fichero esperado sin extension
            const expectedFileBaseName = expectedFileName.replace('.json', ''); // Remove the extension for matching
            
            // Crea una expresión regular que coincida con el nombre del fichero y una secuencia opcional de espacio y número entre paréntesis
            const regexPattern = new RegExp(`^${expectedFileBaseName}( \\(\\d+\\))?\\.json$`);
            
            if (regexPattern.test(file.name)) {
                displayImage(dragArea);
                filesLoaded[expectedFileName] = true;
                readFileContent(file, expectedFileName);
            } else {
                Swal.fire({
                    title: 'Invalid JSON',
                    text: `The file must be "${expectedFileName}". Please, select the correct file.`,
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
        }
    }
    
    function displayImage(dragArea) {
        // Remueve los eventos
        removeEventListeners(dragArea);
        
        // Añade la imagen al dragArea
        const img = document.createElement('img');
        img.src = '../../imgs/json-icon.png';
        img.alt = 'JSON File Icon';
        img.style.width = '100px'; // Establece el tamaño de la imagen
        dragArea.innerHTML = ''; // Limpia cualquier contenido anterior
        dragArea.appendChild(img);
        
        dragArea.addEventListener("dblclick", function() {
            resetDragArea(dragArea);
            filesLoaded[dragArea.getAttribute("nameFile")] = false;
        });
    }
});


function readFileContent(file, fileName) {
    const reader = new FileReader();
    reader.onload = (e) => {
        fileContents[fileName] = JSON.parse(e.target.result) // Almacena el contenido del archivo
        
        // Verifica si todos los archivos han sido cargados antes de procesar
        if (checkAllFilesLoaded()) {
            processAllFiles();
        }
    };
    reader.onerror = (e) => {
        Swal.fire({
            title: 'Error',
            text: `An error occurred while reading the file. \n ${e}`,
            icon: 'error',
            confirmButtonText: 'OK'
        })
    };
    reader.readAsText(file); // Lee el archivo como texto
}

function checkAllFilesLoaded() {
    return Object.values(filesLoaded).every(isLoaded => isLoaded)
}

function processAllFiles(){
    if (checkAllFilesLoaded()){
        Object.keys(fileContents).forEach((fileName) => {
            const fileContent = fileContents[fileName];
            if (fileContent){
                if (fileName == "dictionary_rooms.json"){
                    dictionary = fileContent;
                    dictionary_inverse = Object.fromEntries(Object.entries(dictionary).map(([key, value]) => [value, key]));
                } else if (fileName == "daily_routines.json"){
                    daily_routines = fileContent;
                } else {
                    assigned_routines = fileContent;
                }
            }
    })
    
        assigned_routines.forEach((instance)=>{
        daily_routines.forEach((routine)=>{
            if (routine["typeDate"] == instance["typeDate"]){
                json[instance["date"]] = {"typeDate": parseInt(instance["typeDate"]),
                                          "intervals": routine["intervals"],
                                          "rooms": routine["rooms"]}
                }
            })
        })
        Swal.fire({
            title: 'Files loaded successfully',
            text: 'The files have been loaded successfully. Click on "Continue" to visualize the labelmap',
            icon: 'success',
            confirmButtonText: 'Continue'
        }).then(()=>{
            setTimeout(() => {
                visualization_labelmap_section.style.display = 'block';
                labelmap_section.style.display = 'block';
                labelMap = getLabelmap(json);
                visualization_labelmap_section.style.display = 'block';
                labelmap_section.style.display = 'block';

                window.location.href = "#visualization-labelmap";
                showPlot();
            }, 500);
        }).finally(()=>{
            setTimeout(()=>{
                Swal.fire({
                    title: "Download the joined data?",
                    text: "Do you want to download the joined data?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, download it",
                    cancelButtonText: "No, thanks"
                }).then((result) => {
                    if (result.isConfirmed){
                        downloadJSON(json);
                    }
                })
            }, 1000)
        })
    };
}

downloadJSON = (json) => {
    content = JSON.stringify(json, null, 5)
    const blob = new Blob([content], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "joined_data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


const convertToMinutes = function(hour){ 
    return parseInt(hour.split(':')[0])*60 + parseInt(hour.split(':')[1]);
}

const convertToHour = function(minutes){
    let hours = Math.floor(minutes/60);
    let mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

const aleatorizeIntervals = (intervals) => {
    threshold = document.querySelector("#threshold").value
    let new_intervals = [];
    first_interval = 0;
    for (let i = 0; i < intervals.length; i++){
        // randomization from -threshold to +threshold
        let random = Math.floor(Math.random() * (threshold*2 + 1)) - threshold;
        var [start, end] = intervals[i];
        if (i == 0){
            end = convertToHour(convertToMinutes(end) + random);
            new_intervals.push(["00:00", end]);
        } else {
            start = new_intervals[i-1][1];
            if (i == intervals.length - 1){
                end = "23:59";
            } else {
                end = convertToHour(convertToMinutes(end) + random);
            }
            new_intervals.push([start, end]);
        }
    }
    return new_intervals
}

const getLabelmap = (json) => {
    dates_labelmap = Object.keys(json);
    dates_labelmap.forEach((date) => {
        let sequence = [];
        let [year, month, day] = date.split('-');
        aleatorizeIntervals(json[date].intervals).forEach((interval, index) => {
            init = convertToMinutes(interval[0]);
            end = convertToMinutes(interval[1]);
            room = dictionary[json[date].rooms[index]];
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

// Cada vez que cambiamos el threshold, volvemos a obtener el labelmap y mostramos el plot
threshold_input.addEventListener("change", () => {
    labelMap = new DataFrame({}, ["Year", "Month", "Day", "Sequence"])
    labelMap = getLabelmap(json);
    showPlot();
})


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
        z: sequences.flat(),
        text: sequences.flat().map(room => dictionary_inverse[room]),
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

const downloadCSVButton = document.querySelector('#download-labelmap');

downloadCSVButton.addEventListener('click', () => {
    Swal.fire({
        title: "Download activities dataset",
        text: "Do you confirm to download the activity dataset simulated?",
        showCancelButton: true,
        confirmButtonText: 'Yes, download it',
        cancelButtonText: 'No, maybe later',
    }).then((result) => {
        if(result.isConfirmed){
            downloadCSV(labelMap);
        }
    })
})
