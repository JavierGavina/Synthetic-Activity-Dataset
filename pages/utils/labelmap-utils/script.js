/*GLOBALIZAR VARIABLE JSON*/
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

threshold_input.addEventListener("change", () => {
    threshold_output.textContent = parseInt(threshold_input.value);

}



