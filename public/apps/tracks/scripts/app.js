const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const trackTitle = document.getElementById("trackTitle")
const progressBar = document.getElementById("progressBar")
const progressContainer = document.getElementById("progressContainer")
const currentTimeLabel = document.getElementById("currentTime")
const durationLabel = document.getElementById("duration");

/* Track list */
const tracks = [
    {title: "Placeholder 1", src: "audios/placeholder.mp3"},
    {title: "Placeholder 2", src: "audios/placeholder2.mp3"}
]

let currentIndex = 0;

/* --- FUNCTIONS --- */
// Function to load next track
function loadTrack(index) {
    currentIndex = (index + tracks.length) % tracks.length; // `+ tracks.length` to prevent negative index
    let currentTrack = tracks[currentIndex];
    audio.src = currentTrack.src;
    trackTitle.textContent = currentTrack.title;
    audio.play();
}

// Function to format duration into readable timestamp
function formatTime(seconds) {
    const minute = Math.floor(seconds / 60);
    const second = Math.floor(seconds % 60);
    return `${minute}:${second < 10 ? '0' : ''}${second}`; // if <10 seconds, add a 0 before the sec, otherwise add nun
}


/* --- AUDIO PLAYER LOGIC --- */
// Set duration label according to track
audio.addEventListener('loadedmetadata', () => {
    durationLabel.textContent = formatTime(audio.duration);
})

// Switch next track when this track ends
audio.addEventListener('ended', () => loadTrack(currentIndex+1))

// Update progress bar and current time label
let lastSecond = 0;
audio.addEventListener('timeupdate', () => {
    const currentSecond = Math.floor(audio.currentTime); // Get rounded down current second

    if (currentSecond !== lastSecond) {
        lastSecond = currentSecond; // Update the last second
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + "%";
        currentTimeLabel.textContent = formatTime(audio.currentTime);
    }
})

// Set progress to mouse click
progressContainer.addEventListener('click', (e) => {
    const containerWidth = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / containerWidth) * duration;
    audio.play();
})


/* Prev button logic */
prevBtn.addEventListener('click', () => {
    if (audio.currentTime <= 1) {
        loadTrack(currentIndex-1);
    } else {
        audio.currentTime = 0;
    }
})


/* Play button logic */
playBtn.addEventListener('click', () => {
    if (audio.paused) audio.play();
    else audio.pause();
});
audio.addEventListener('play', () => playBtn.textContent = 'Pause'); // Btn text changes based on audio's status
audio.addEventListener('pause', () => playBtn.textContent = 'Play');


/* Next button logic */
nextBtn.addEventListener('click', () => {
    loadTrack(currentIndex+1);
})