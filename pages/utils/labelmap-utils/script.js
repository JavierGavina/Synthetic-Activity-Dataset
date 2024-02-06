/*GLOBALIZAR VARIABLE JSON*/

var DataFrame = dfjs.DataFrame;

var labelMap = new DataFrame({}, ["Year", "Month", "Day", "Sequence"])

/*OCULTAR INICIALMENTE LAS SECCIONES*/
visualization_labelmap_section = document.querySelector('#visualization-labelmap');
labelmap_section = document.querySelector('#labelmap');

visualization_labelmap_section.style.display = 'none';
labelmap_section.style.display = 'none';

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



/*FUNCION PARA PROCESAR EL ARCHIVO JSON*/
const processFile = (file) => {
    // Comprobar que el archivo es un json
    if (file.type != 'application/json') {
        alert('El archivo debe ser un JSON');
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

        } catch (error) {
            alert(error)
            alert('El archivo no es un JSON válido');
        }
    };
    reader.onerror = () => {
        alert('Error al leer el archivo');
    };
}

const convertToMinutes = function(hour){
    return hour.split(':')[0]*60 + hour.split(':')[1];
}

const getLabelmap = (json) => {
    dates_labelmap = Object.keys(json);
    dates_labelmap.forEach((date) => {
        let sequence = [];
        let [year, month, day] = date.split('-');
        
        init = convertToMinutes(json[date].start_time);
        end = convertToMinutes(json[date].end_time);
        room = json[date].room;
        for (let i = init; i < end; i++){
            sequence.push(room);
        }

        labelMap = new DataFrame({
            "Year": year,
            "Month": month,
            "Day": day,
            "Sequence": sequence
        });
    })

    window.alert(labelMap.show(5))

}






