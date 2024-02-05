const routines_definition = document.querySelector('#definition-box');
const routines_simulation = document.querySelector('#simulation-box');
routines_definition.addEventListener('click', function() {
    window.location.href = "./pages/routines.html"
})
routines_simulation.addEventListener('click', function() {
    window.location.href = "./pages/labelmap.html"
})
