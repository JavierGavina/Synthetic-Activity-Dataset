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



document.querySelectorAll(".box").forEach((box) => {

    
    box.addEventListener("mouseover", () => {
        element_id = "title-" + box.id.replace("-box", "")

        const typewriter = new Typewriter(`#${element_id}`, {
            loop: true,
          });
        
      
        typewriter.typeString(assign_text(element_id))
              .pauseFor(1500)
              .deleteAll()
              .pauseFor(500)
              .start();
    })


    box.addEventListener("mouseleave", () => {
        element_id = "title-" + box.id.replace("-box", "")
        document.querySelector(`#${element_id}`).textContent = assign_text(element_id)
    })

    
})


const assign_text = (element_id) => {
    switch (element_id){
        case "title-room-assignment":
            return "Room Assignment";
        case "title-definition":
            return "Routine Definition";
        case "title-simulation":
            return "Routine Simulation";
        case "title-user-guide":
            return "User Guide";
    }
}