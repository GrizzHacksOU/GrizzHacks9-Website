const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const trackTitle = document.getElementById("trackTitle")

/* Track list */
const tracks = [
    {title: "Placeholder 1", src: "audios/placeholder.mp3"},
    {title: "Placeholder 2", src: "audios/placeholder2.mp3"}
]

let currentIndex = 0;


function loadTrack(index) {
    currentIndex = (index + tracks.length) % tracks.length; // `+ tracks.length` to prevent negative index
    let currentTrack = tracks[currentIndex];
    audio.src = currentTrack.src;
    trackTitle.textContent = currentTrack.title;
    audio.play();
}


/* Prev button */
prevBtn.addEventListener('click', () => {
    if (audio.currentTime <= 1) {
        loadTrack(currentIndex-1);
    } else {
        audio.currentTime = 0;
    }
})

/* Play button */
audio.addEventListener('play', () => playBtn.textContent = 'Pause');
audio.addEventListener('pause', () => playBtn.textContent = 'Play');
audio.addEventListener('ended', () => loadTrack(currentIndex+1))

playBtn.addEventListener('click', () => {
    if (audio.paused) audio.play();
    else audio.pause();
});

/* Next button */
nextBtn.addEventListener('click', () => {
    loadTrack(currentIndex+1);
})