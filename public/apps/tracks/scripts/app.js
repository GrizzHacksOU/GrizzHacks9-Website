const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const trackTitle = document.getElementById("trackTitle")
const progressTracker = document.getElementById("progressTracker")
const progressLine = document.getElementById("progressLine")
const currentTimeLabel = document.getElementById("currentTime")
const durationLabel = document.getElementById("duration");
const trackList = document.getElementById("trackList");
const lyricsDisplay = document.getElementById("lyricsDisplay")
const cd = document.getElementById("cd")

/* Track list */
const tracks = [
    {title: "01_beginner.mp3",     src: "song_stuff/01_beginner.mp3",       artist: "Sponsor",  lyrics: "song_stuff/01_beginner.txt"},
    {title: "02_social_good.mp3",  src: "song_stuff/02_social_good.mp3",    artist: "Sponsor",  lyrics: "song_stuff/02_social_good.txt"},
    {title: "03_fintech.mp3",      src: "song_stuff/03_fintech.mp3",        artist: "Sponsor",  lyrics: "song_stuff/03_fintech.txt"}
];



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
 * Play the next track in the playlist or the desired track
 * @param {number} index [number=currentIndex+1] index of the desired track
 */
function loadTrack(index = currentIndex+1) {
    currentIndex = cycle(index, tracks.length)
    
    // Get next track on
    let currentTrack = tracks[currentIndex];
    audio.src = currentTrack.src;
    setTrackTitle(currentTrack.title);
    progressTracker.style.left = "0%";

    // Set lyrics
    fetch(currentTrack.lyrics)
        .then(res => res.ok ? res.text() : "No lyrics available")
        .then(text => lyricsDisplay.textContent = text);

    audio.play();

    document.documentElement.style.setProperty("--disabled-gray", "darkgray");
    document.getElementById("audioContainer").style.color = "black";
    playBtn.disabled = false;
    prevBtn.disabled = false;
    nextBtn.disabled = false;
}


/**
 * Format seconds into readable timestamp 
 * @param {number} seconds duration in seconds
 * @returns a string of the formatted timestamp
 */
function timeStamp(seconds) {
    const minute = Math.floor(seconds / 60);
    const second = Math.floor(seconds % 60);
    return `${minute}:${second < 10 ? '0' : ''}${second}`; // if <10 seconds, add a 0 before the sec, otherwise add nun
}

/**
 * Render the trackList
 */
function renderTrackList() {
    trackList.replaceChildren();
    
    tracks.forEach((track, index) => {
        const li = document.createElement("li");
        const btn = document.createElement("button")
        btn.addEventListener('click', () => loadTrack(index));

        const title = document.createElement("span");
        title.textContent = track.title;
        title.classList.add("trackName");

        const artist = document.createElement("span");
        artist.textContent = track.artist;
        artist.classList.add("trackArtist");

        const time = document.createElement("span");
        time.classList.add("trackTime");
        time.textContent = track.duration ? timeStamp(track.duration) : "--:--"

        btn.append(title, artist, time)

        li.append(btn);
        trackList.appendChild(li); // Put the button inside container
    })
}

// Set duration label for trackList
tracks.forEach((track) => {
    const probe = new Audio(track.src);
    probe.addEventListener("loadedmetadata", () => {
        track.duration = probe.duration;
        renderTrackList();
    });
});


/* === Scrolling title stuff === */
/**
 * Set the scrolling title: two copies for the wrap-around, restart animation
 * @param {String} text title text
 */
function setTrackTitle(text) {
    trackTitle.replaceChildren();
    for (let i = 0; i < 2; i++) {
        const span = document.createElement("span");
        span.textContent = text;
        trackTitle.appendChild(span);
    }
    startTitleScroll(); // restarts from the original position + pause
}


const TITLE_PAUSE_MS = 1500; // pause at the original position each loop
const TITLE_SPEED = 40;      // scroll speed in px per second
let titleAnimation = null;  // Keep track of current animation state
/**
 * Size the copies to the box and restart the scroll animation
 */
function startTitleScroll() {
    const box = trackTitle.parentElement;
    trackTitle.style.setProperty("--box-width", box.clientWidth + "px");

    const distance = trackTitle.scrollWidth / 2; // width of one copy + gap
    const moveMs = (distance / TITLE_SPEED) * 1000;
    const totalMs = TITLE_PAUSE_MS + moveMs;
    const pauseEnd = TITLE_PAUSE_MS / totalMs;

    if (titleAnimation) {
        titleAnimation.cancel();
    }

    titleAnimation = trackTitle.animate([
        { transform: "translateX(-50%)", offset: 0 },
        { transform: "translateX(-50%)", offset: pauseEnd }, // hold still
        { transform: "translateX(0)",    offset: 1 }         // seamless loop point
    ], { duration: totalMs, iterations: Infinity, easing: "linear" });
}

// Re-size the title copies whenever the window/box changes size
let lastBoxWidth = 0;
new ResizeObserver(() => {
    const width = trackTitle.parentElement.clientWidth;
    if (width === lastBoxWidth) {
        return;
    }

    lastBoxWidth = width;
    if (trackTitle.childElementCount && !audio.paused) {
        startTitleScroll();
    }
}).observe(trackTitle.parentElement);


/* ==== AUDIO PLAYER LOGIC ==== */

// Set duration label according to track
audio.addEventListener('loadedmetadata', () => {
    currentTimeLabel.textContent = "0:00"
    durationLabel.textContent = timeStamp(audio.duration);
})


// Switch next track when this track ends
audio.addEventListener('ended', () => loadTrack())


// Update progress bar and current time label
let lastSecond = 0;
audio.addEventListener('timeupdate', () => {
    const currentSecond = Math.floor(audio.currentTime); // Get rounded-down current second

    if (currentSecond !== lastSecond) {
        lastSecond = currentSecond; // Update the last second
        const percent = (audio.currentTime / audio.duration) * 100;
        progressTracker.style.left = percent + "%";
        currentTimeLabel.textContent = timeStamp(audio.currentTime);
    }
})

// Set progress to mouse click
progressLine.addEventListener('click', (e) => {
    if (!audio.duration) {
        return; // no track loaded yet
    }
    const rect = progressLine.getBoundingClientRect();
    const clickX = e.clientX - rect.left; // works no matter which child was clicked
    const ratio = Math.min(Math.max(clickX / rect.width, 0), 1);
    audio.currentTime = ratio * audio.duration;
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
    cd.classList.remove("spinning");
    cd.classList.add("spinning");
})

// Play button logic
playBtn.addEventListener('click', () => {
    if (audio.paused) {audio.play();}
    else              {audio.pause()};
});
audio.addEventListener('play', () => {
    playBtn.textContent = '❚❚'; // Btn text changes based on audio's status
    startTitleScroll();         // title scrolls again from the original position
    cd.classList.add("spinning");
});
audio.addEventListener('pause', () => {
    playBtn.textContent = '▶';
    if (titleAnimation) titleAnimation.cancel(); // snap back to original position and stop
    cd.classList.remove("spinning");
});

// Next button logic
nextBtn.addEventListener('click', () => {
    loadTrack();
    cd.classList.remove("spinning");
    cd.classList.add("spinning");
})