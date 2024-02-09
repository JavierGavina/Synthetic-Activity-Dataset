const routines_definition = document.querySelector('#definition-box');
const routines_simulation = document.querySelector('#simulation-box');

routines_definition.addEventListener('click', function() {
    window.location.href = "./pages/routines.html";
});

routines_simulation.addEventListener('click', function() {
    window.location.href = "./pages/labelmap.html";
});

document.addEventListener('DOMContentLoaded', (event) => {
    
    const introVideo = document.getElementById('intro-video');

    function playVideo() {
        introVideo.play()
            .catch(error => console.error("Error trying to play the video:", error));
        introVideo.style.transform = "scale(1.5)";
    }

    function stopVideo() {
        introVideo.pause();
        introVideo.style.transform = "scale(1)";
    }

    // Mute the video by default to allow it to play on hover
    introVideo.muted = true;
    introVideo.addEventListener('mouseover', playVideo);
    introVideo.addEventListener('mouseleave', stopVideo);

    // introVideo.addEventListener('click', function() {
    //     // Toggle mute state on click
    //     introVideo.muted = !introVideo.muted;

    //     if (introVideo.paused) {
    //         introVideo.play()
    //             .catch(error => console.error("Error trying to play the video:", error));
    //         // Remove the mouseover listener to prevent it from playing on hover after a click
    //         introVideo.removeEventListener('mouseover', playVideo);
    //     } else {
    //         introVideo.pause();
    //         // Add the mouseover listener back after pausing with a click
    //         introVideo.addEventListener('mouseover', playVideo);
    //     }
    // });
});
