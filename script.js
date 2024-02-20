// This function creates an <iframe> (and YouTube player) after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('video-box', {
        height: '420',
        width: '560',
        videoId: 'rur1-0Pibx0',
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    const iframe = document.getElementById('video-box');
    iframe.style.transition = "transform 0.3s ease";

    iframe.addEventListener('mouseover', function() {
        iframe.style.transform = "scale(1.5)";
        event.target.playVideo(); // Play video
    });

    iframe.addEventListener('mouseleave', function() {
        iframe.style.transform = "scale(1)";
        event.target.pauseVideo(); // Pause video
    });
}

const room_assigment = document.querySelector('#room-assignment-box');
const routines_definition = document.querySelector('#definition-box');
const routines_simulation = document.querySelector('#simulation-box');
const user_guide = document.querySelector("#user-guide-box")

routines_definition.addEventListener('click', function() {
    window.location.href = "./pages/routines.html";
});

routines_simulation.addEventListener('click', function() {
    window.location.href = "./pages/labelmap.html";
});

user_guide.addEventListener("click", function(){
    window.location.href = "./pages/user-guide.html"
})

room_assigment.addEventListener('click', function() {
    window.location.href = "./pages/room-assignment.html";
});
