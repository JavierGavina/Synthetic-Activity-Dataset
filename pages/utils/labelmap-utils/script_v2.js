/*VARIABLES COLOR*/
const globalColorsLight = {
    prefered_background_color: "#f0f0f0",
    prefered_secondary_background_color: "#ffffff",
    prefered_text_color: "#000",
    select_border_color: "#4e4e4ea4",
    select_background_color: "#fffefe",
    prefered_fill_plot: "#f0f0f0"
}

const globalColorsDark = {
    prefered_background_color : "#0f0f0f",
    prefered_secondary_background_color : "#3d3d3d",
    prefered_text_color : "#fff",
    select_border_color : "#dfdfdfce",
    select_background_color : "#4a4949",
    prefered_fill_plot: "#1A1A1A",
}


/*ANIMACIÓN COLOR*/
const prefersDarkColorScheme = () =>
        window &&
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches


        

/*TODAS LAS VARIABLES GLOBALES*/
var json = {}; // JOINED DATA

var DataFrame = dfjs.DataFrame;

var labelMap = new DataFrame({}, ["Year", "Month", "Day", "Sequence"])
var dictionary;
var dictionary_inverse
var daily_activities;
var assigned_activities;

// Objeto para mantener el estado de los archivos cargados
const filesLoaded = {
    "dictionary_rooms.json": false,
    "daily_activities.json": false,
    "assigned_activities.json": false
}

// Objeto para almacenar el contenido de los archivos cargados
const fileContents = {
    "dictionary_rooms.json": null,
    "daily_activities.json": null,
    "assigned_activities.json": null
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
        // Remove event listeners
        removeEventListeners(dragArea);
    
        // Clear any previous content
        dragArea.innerHTML = '';
    
        // Create a container for the image and cancel icon
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.display = 'inline-block';
    
        // Add the image to the dragArea
        const img = document.createElement('img');
        img.src = '../imgs/json-icon.png';
        img.alt = 'JSON File Icon';
        img.style.width = '100px';
        container.appendChild(img);
    
        // Create and add the cancel icon
        const cancelIcon = document.createElement('img');
        cancelIcon.src = '../imgs/cancelar.png'; // Path to your cancel icon image
        cancelIcon.alt = 'Cancel';
        cancelIcon.style.position = 'absolute';
        cancelIcon.style.top = '0';
        cancelIcon.style.right = '0';
        cancelIcon.style.width = '20px'; // Adjust size as needed
        cancelIcon.style.cursor = 'pointer';
        cancelIcon.addEventListener('click', function() {
            resetDragArea(dragArea);
            filesLoaded[dragArea.getAttribute("nameFile")] = false;
        });

        cancelIcon.addEventListener('mouseover', function() {
            // appear a message below the image that says "Click to remove"
            const message = document.createElement('p');
            message.textContent = 'Click to remove';
            message.style.position = 'absolute';
            message.style.bottom = '0';
            message.style.left = '50%';
            message.style.transform = 'translateX(-50%)';
            message.style.fontSize = '12px';
            message.style.color = '#fff';
            message.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            message.style.padding = '5px';
            container.appendChild(message);
        });

        cancelIcon.addEventListener('mouseout', function(e) {
            // remove the message
            container.removeChild(container.lastChild);
        });

        cancelIcon.addEventListener('click', function(e) {
            resetDragArea(dragArea);
            filesLoaded[dragArea.getAttribute("nameFile")] = false;
            e.stopPropagation();
        });
    
        // Append both image and cancel icon to the container, then the container to the dragArea
        container.appendChild(cancelIcon);
        dragArea.appendChild(container);
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
                } else if (fileName == "daily_activities.json"){
                    daily_activities = fileContent;
                } else {
                    assigned_activities = fileContent;
                }
            }
        })
    
        assigned_activities.forEach((instance)=>{
        daily_activities.forEach((daily)=>{
            if (daily["typeDate"] == instance["typeDate"]){
                json[instance["date"]] = {"typeDate": parseInt(instance["typeDate"]),
                                          "intervals": daily["intervals"],
                                          "rooms": daily["rooms"]}
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
                labelMap = getLabelmapWithEmptyRows(json);
                visualization_labelmap_section.style.display = 'block';
                labelmap_section.style.display = 'block';

                window.location.href = "#visualization-labelmap";
                showPlot();
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                    showPlot();
                });
            }, 500);
        }).finally(()=>{
            setTimeout(()=>{
                Swal.fire({
                    title: "Download the joined data?",
                    text: "Do you want to download the joined data?",
                    icon: "info",
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

const convertToSeconds = function(hora){
    const [h, m] = hora.split(":")
    return h*3600 + m*60
}    

const convertToMinutes = function(hour){
    const [h, m] = hour.split(":")
    return parseInt(h)*60 + parseInt(m);
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

const probability_data_drop = () => {
    let na_rate = Number(document.querySelector('#na').value);
    return Math.random() > na_rate;
}

const kill_battery = (sequence) => {
    const [morning, evening] = estimate_hour_random();
    if (Math.random() < drop_rate_morning_ev.value){
        for (let i = 0; i < convertToMinutes(morning); i++){
            sequence[i] = undefined;
        }
    }

    if (Math.random() < drop_rate_morning_ev.value){
        for (let i = convertToMinutes(evening); i < 1440; i++){
            sequence[i] = undefined;
        }
    } 

    return sequence
}


// Crear una función que cree un array de fechas desde la primera fecha hasta la última
const getDates = (start, stop) => {
    let startDate = new Date(start.split('-')[0], start.split('-')[1]-1, start.split('-')[2]);
    let stopDate = new Date(stop.split('-')[0], stop.split('-')[1]-1, stop.split('-')[2]);
    let dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    // convertir a string
    string_date = dateArray.map(date => `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
    return string_date;
}

const get_randomized_to_drop = () => {
    const to_drop = document.querySelector("#consecutive-drop").value;
    if (to_drop==0) return 0;
    return Math.floor(Math.random() * to_drop);
}

const drop_consecutive_na_sequence = (sequence) => {
    if (document.querySelector("#consecutive-drop").value > 0){
        new_sequence = []
        sequence.forEach((room, index) => {
            if (room == undefined && index > new_sequence.length-1){
                end_index = Math.min(index + get_randomized_to_drop(), sequence.length);
                for (let i = index; i < end_index; i++){
                    new_sequence.push(undefined);
                }
            } else {
                if (room != undefined && index > new_sequence.length) new_sequence.push(room);
            }
        })
        
        return new_sequence
    } else {
        return sequence
    }
}

const getLabelmap = (json) => {
    dates_labelmap = Object.keys(json);
    dates_labelmap.forEach((date) => {
        if (Math.random() > drop_day_rate.value){
            let sequence = [];
            let [year, month, day] = date.split('-');
            aleatorizeIntervals(json[date].intervals).forEach((interval, index) => {
                init = convertToMinutes(interval[0]);
                end = convertToMinutes(interval[1]);
                room = dictionary[json[date].rooms[index]];
                for (let i = init; i < end; i++){
                    probability_data_drop() ? sequence.push(room): sequence.push(undefined);
                }
            })
            sequence = drop_consecutive_na_sequence(sequence);
            if (drop_rate_morning_ev.value > 0) sequence = kill_battery(sequence);
            labelMap = labelMap.push({Year: parseInt(year), Month: parseInt(month), Day: parseInt(day), Sequence: sequence})
        }
    })

    return labelMap
}

const getLabelmapWithEmptyRows = (json) => {
    
    dates_labelmap = Object.keys(json);
    first_date = dates_labelmap[0]
    last_date = dates_labelmap[dates_labelmap.length-1]
    for (date of getDates(first_date, last_date)){
        let [year, month, day] = date.split('-');
        let sequence = [];
        if (dates_labelmap.includes(date)){
            if (Math.random() > drop_day_rate.value){
                aleatorizeIntervals(json[date].intervals).forEach((interval, index) => {
                    init = convertToMinutes(interval[0]);
                    end = convertToMinutes(interval[1]);
                    room = dictionary[json[date].rooms[index]];
                    for (let j = init; j < end; j++){
                        probability_data_drop() ? sequence.push(room): sequence.push(undefined);
                    }
                })
            }
            else {
                for (let i = 0; i < 1440; i++){
                    sequence.push(undefined);
                }
            }
        } else {
            for (let i = 0; i < 1440; i++){
                sequence.push(undefined);
            }
        }
        sequence = drop_consecutive_na_sequence(sequence);
        if (drop_rate_morning_ev.value > 0) sequence = kill_battery(sequence);
        labelMap = labelMap.push({Year: parseInt(year), Month: parseInt(month), Day: parseInt(day), Sequence: sequence})
    }

    return labelMap
}

const downloadCSV = (data) => {
    columnas = data.listColumns()
    filas = data.toArray()
    const csvContent = "data:text/csv;charset=utf-8," + columnas.join(",") + "\n" + filas.map(row => row.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "activities-simulation.csv");
    document.body.appendChild(link);
    link.click();
}


/*CÓDIGO PARA LA SECCIÓN DE VISUALIZACIÓN*/
var show_empty_rows = true;
const show_button = document.querySelector('#show-rows');
const drop_button = document.querySelector('#drop-rows');
const na_rate = document.querySelector('#na');
const consecutive_drop = document.querySelector('#consecutive-drop');
const drop_day_rate = document.querySelector("#drop-day")
const time_morning = document.querySelector("#morning-input")
const time_evening = document.querySelector("#evening-input")
const reset_button = document.querySelector("#reset-hour")
const time_variability_morning_ev = document.querySelector("#time-mornings-evenings-slider")
const drop_rate_morning_ev = document.querySelector("#drop-mornings-evenings-slider")

const update_labelmap_and_plot = () => {
    labelMap = new DataFrame({}, ["Year", "Month", "Day", "Sequence"])
    show_empty_rows ? labelMap = getLabelmapWithEmptyRows(json) : labelMap = getLabelmap(json);
    showPlot();
}    

// THRESHOLD
threshold_input = document.querySelector('#threshold');

// Cada vez que cambiamos el threshold, volvemos a obtener el labelmap y mostramos el plot
threshold_input.addEventListener("change", () => {
    update_labelmap_and_plot();
})

show_button.addEventListener("change", () => {
    show_empty_rows = !show_empty_rows;
    update_labelmap_and_plot();
})    

drop_button.addEventListener("change", () => {
    show_empty_rows = !show_empty_rows;
    update_labelmap_and_plot();
})    

na_rate.addEventListener("change", () => {
    update_labelmap_and_plot();
})    

consecutive_drop.addEventListener("change", () => {
    update_labelmap_and_plot();
})

drop_day_rate.addEventListener("change", ()=>{
    update_labelmap_and_plot()
})

time_morning.addEventListener("keyup", () => {
    if (time_morning.value.length == 2){
        time_morning.value += ":";
    }
    if (time_morning.value.length == 5){
        if (isValidHour(time_morning.value)){
            time_morning.blur();
            time_morning.setAttribute("readonly", true);
            time_evening.removeAttribute("readonly");
            time_evening.focus();
        }
    }
})


time_evening.addEventListener("keyup", () => {
    if (time_evening.value.length == 2){
        time_evening.value += ":";
    }
    if (time_evening.value.length == 5){
        if (isValidHour(time_evening.value) && 
        isGreaterThan(time_evening.value, time_morning.value)){
            time_evening.blur();
            time_evening.setAttribute("readonly", true);
            document.querySelectorAll(".sliders-times").forEach((element) => {
                element.style.display = "flex";
            })
        }
    }
})

reset_button.addEventListener("click", () => {
    time_morning.value = ""
    time_evening.value = ""
    time_morning.focus()
    if (time_morning.hasAttribute("readonly")) time_morning.removeAttribute("readonly")
    time_evening.setAttribute("readonly", true)
    document.querySelectorAll(".sliders-times").forEach((element) => {
        element.style.display = "none";
    })
    time_variability_morning_ev.value = 0;
    drop_rate_morning_ev.value = 0;
    update_labelmap_and_plot();

})

document.querySelectorAll(".inputs-times").forEach((element) => {
    element.addEventListener("focus", (e)=> {
        element.placeholder=""
    })
    element.addEventListener("blur", (e)=> {
        element.placeholder="HH:MM"
    })
})

document.querySelectorAll(".sliders-times").forEach((element) => {
    element.style.display = "none";
})

const estimate_hour_random = () => {
    const morning = convertToMinutes(time_morning.value);
    const evening = convertToMinutes(time_evening.value);
    const variance = time_variability_morning_ev.value;
    const randomness = Math.floor(Math.random() * (variance*2 + 1)) - variance;
    const [t0, t1] = [convertToHour(morning + randomness), 
                      convertToHour(evening + randomness)]
    return [t0, t1];
}

time_variability_morning_ev.addEventListener("change", () => {
    update_labelmap_and_plot();
})

drop_rate_morning_ev.addEventListener("change", () => {
    update_labelmap_and_plot();
})


                    

const isValidHour = function(hora){
    const [h, m] = hora.split(":")
    if ((h.length==2 && m.length==2) && 
    (h>=0 && h<=23) && (m>=0 && m<=59)) return true
    
    Swal.fire({
        title: "Invalid hour",
        text: "The hour must be in the format HH:MM and must be a valid hour",
        icon: "error",
        confirmButtonText: 'OK'
    }).then(()=>{
        setTimeout(()=>{
            time_morning.value = ""
            time_morning.focus()
        }, 1000)
    })
}

const isGreaterThan = (hour1, hour2) => {
    if (convertToMinutes(hour1) > convertToMinutes(hour2)) return true;
    Swal.fire({
        title: "Invalid evening hour",
        text: "The evening hour must be greater than the morning hour",
        icon: "error",
        confirmButtonText: 'OK'
    }).then(()=>{
        setTimeout(()=>{
            time_evening.value = ""
            time_evening.focus()
        }, 500)
    })
    return false;
}

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
        font: {
            family: 'Arial',
            size: 12,
            color: prefersDarkColorScheme() ? globalColorsDark.prefered_text_color : globalColorsLight.prefered_text_color,
            title: {
                font: {
                    size: 16,
                    color: prefersDarkColorScheme() ? globalColorsDark.prefered_text_color : globalColorsLight.prefered_text_color
                }
            },
            xaxis: {
                title: {
                    font: {
                        size: 14,
                        color: prefersDarkColorScheme() ? globalColorsDark.prefered_text_color : globalColorsLight.prefered_text_color
                    }
                }
            },
            yaxis: {
                title: {
                    font: {
                        size: 14,
                        color: prefersDarkColorScheme() ? globalColorsDark.prefered_text_color : globalColorsLight.prefered_text_color
                    }
                }
            },

            xtickfont: {
                size: 10,
                color: prefersDarkColorScheme() ? globalColorsDark.prefered_text_color : globalColorsLight.prefered_text_color
            },
            ytickfont: {
                size: 10,
                color: prefersDarkColorScheme() ? globalColorsDark.prefered_text_color : globalColorsLight.prefered_text_color
            }
        },
    };
    
    Plotly.newPlot(new_div, data, layout);
    parent.replaceChild(new_div, existent);
    document.querySelector(".main-svg")
            .style.backgroundColor = prefersDarkColorScheme() ? globalColorsDark.prefered_fill_plot :
                                                                globalColorsLight.prefered_fill_plot;
}

const downloadCSVButton = document.querySelector('#download-labelmap');

downloadCSVButton.addEventListener('click', () => {
    Swal.fire({
        title: "Download activities dataset",
        text: "Do you confirm to download the activity dataset simulated?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: 'Yes, download it',
        cancelButtonText: 'No, maybe later',
    }).then((result) => {
        if(result.isConfirmed){
            downloadCSV(labelMap);
        }
    })
})
