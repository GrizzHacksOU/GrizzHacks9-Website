const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const trackTitle = document.getElementById("trackTitle")
const progressBar = document.getElementById("progressBar")
const progressContainer = document.getElementById("progressContainer")
const currentTimeLabel = document.getElementById("currentTime")
const durationLabel = document.getElementById("duration");
const trackList = document.getElementById("trackList");
const trackSortBtn = document.getElementById("trackSortBtn")

/* Track list */
const originalTracks = [
    {title: "AI/ML",        src: "audios/placeholder.mp3"},
    {title: "Social Good",  src: "audios/placeholder2.mp3"},
    {title: "FinTech",      src: "audios/placeholder3.mp3"}
];
let currentIndex = 0;
let tracks = [...originalTracks];

const trackSortStates = ["Tracks", "Tracks ▲", "Tracks ▼"];
let currentTrackState = 0;


/* ==== FUNCTIONS ==== */

/**
 * Return the current step with cycling taken into consideration
 * @param {number} current the starting position
 * @param {number} length the number of positions in the cycle
 * @param {number} step [step=0] how many positions to move, negative moves backwards
 * @returns the wrapped index
 */
function cycle(current, length, step=0) {
    return (current + step + length) % length;
}

/** 
 * Load track in next index if nothing is passed, otherwise load track at the specified index
 * */
function loadTrack(index = currentIndex+1) {
    currentIndex = cycle(index, tracks.length)
    
    let currentTrack = tracks[currentIndex];
    audio.src = currentTrack.src;
    trackTitle.textContent = currentTrack.title;
    progressBar.style.width = "0%";
    audio.play();

    playBtn.disabled = false;
    prevBtn.disabled = false;
    nextBtn.disabled = false;
}

/**
 * Format .duration property into readable timestamp 
 * */ 
function formatTime(seconds) {
    const minute = Math.floor(seconds / 60);
    const second = Math.floor(seconds % 60);
    return `${minute}:${second < 10 ? '0' : ''}${second}`; // if <10 seconds, add a 0 before the sec, otherwise add nun
}

/**
 * Render the playlist, especially at the beginning and after a sort
 */
function renderPlaylist() {
    trackList.replaceChildren();
    
    tracks.forEach((track, index) => {
        const li = document.createElement("li");

        const btn = document.createElement("button");
        btn.textContent = track.title;
        btn.classList.add("trackBtn");
        btn.addEventListener('click', () => {
            loadTrack(index); // When the button is clicked, it plays the song
        });

        li.appendChild(btn);
        trackList.appendChild(li); // Put the button inside container
    })
}

renderPlaylist(); // First call to render upon page load


/* ==== PLAYLIST LOGIC ==== */

// trackSort button logic
trackSortBtn.addEventListener('click', () => {
    currentTrackState = cycle(currentTrackState, trackSortStates.length, 1);
    trackSortBtn.textContent = trackSortStates[currentTrackState];
    
    // Save the current playing song to rewire the index after sorting
    const playing = tracks[currentIndex]; 

    switch (currentTrackState) {
        case 0:
            tracks = [...originalTracks];
            break;
    
        case 1: // Sort A -> Z
            tracks.sort((a,b) => a.title.localeCompare(b.title));
            break;

        case 2: // Sort Z -> A
            tracks.sort((a,b) => b.title.localeCompare(a.title));
            break;
        
        default:
            break;
    }

    // Rewire current index to the new index of currently playing song
    currentIndex = tracks.indexOf(playing);

    renderPlaylist();
})



/* ==== AUDIO PLAYER LOGIC ==== */

// Set duration label according to track
audio.addEventListener('loadedmetadata', () => {
    currentTimeLabel.textContent = "0:00"
    durationLabel.textContent = formatTime(audio.duration);
})

// Switch next track when this track ends
audio.addEventListener('ended', () => loadTrack())

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


/* ==== SONG CONTROLS LOGIC ==== */

// Prev button logic
prevBtn.addEventListener('click', () => {
    if (audio.currentTime <= 1) {
        loadTrack(currentIndex-1);
    } else {
        audio.currentTime = 0;
    }
})

// Play button logic
playBtn.addEventListener('click', () => {
    if (audio.paused) audio.play();
    else audio.pause();
});
audio.addEventListener('play', () => playBtn.textContent = 'Pause'); // Btn text changes based on audio's status
audio.addEventListener('pause', () => playBtn.textContent = 'Play');

// Next button logic
nextBtn.addEventListener('click', () => {
    loadTrack();
})