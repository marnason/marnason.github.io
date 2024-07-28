const playerElement = document.getElementById('player');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

let videoUrl = 'https://play.kringvarp.fo/redirect/uttanlands/_definst_/smil:uttanlands.smil?type=m3u8'; // Replace with your actual video URL
let avplay = null; // AVPlay instance
let isPlaying = false; // Playback state

function initializeAVPlay() {
    try {
        avplay = webapis.avplay;
        avplay.open(videoUrl);
        avplay.setDisplayRect(0, 0, window.innerWidth, window.innerHeight);
        
        const listener = {
            onbufferingstart: function() {
                loadingElement.style.display = 'block';
            },
            onbufferingcomplete: function() {
                loadingElement.style.display = 'none';
            },
            onstreamcompleted: function() {
                console.log('Stream completed');
                avplay.stop();
            },
            oncurrentplaytime: function(currentTime) {
                console.log('Current playback time:', currentTime);
            },
            onevent: function(eventType, eventData) {
                console.log('Event:', eventType, eventData);
            },
            onerror: function(eventType) {
                console.error('Error:', eventType);
                errorElement.style.display = 'block';
                avplay.stop();
            },
            onsubtitlechange: function(duration, subtitleData, type, language) {
                console.log('Subtitle changed:', subtitleData);
            },
            ondrmevent: function(drmEvent, drmData) {
                console.log('DRM event:', drmEvent, drmData);
            },
            onstreamdata: function(streamData) {
                console.log('Stream data:', streamData);
            }
        };

        avplay.setListener(listener);
        avplay.setStreamingProperty('ADAPTIVE_INFO', '1');
        avplay.setStreamingProperty('BUFFER_SIZE', '20');
        avplay.setDisplayMethod('PLAYER_DISPLAY_MODE_LETTER_BOX');
        playPauseVideo();

    } catch (error) {
        console.error('Failed to initialize AVPlay:', error);
        errorElement.textContent = 'Error initializing video playback.';
        errorElement.style.display = 'block';
    }
}

function playPauseVideo() {
    if (isPlaying) {
        avplay.pause();
        isPlaying = false;
    } else {
        avplay.prepareAsync(() => {
            avplay.play();
            isPlaying = true;
        });
    }
}

function stopVideo() {
    if (isPlaying) {
        avplay.stop();
        isPlaying = false;
    }
}

function rewindVideo() {
    if (isPlaying) {
        const currentPosition = avplay.getCurrentTime();
        avplay.seekTo(currentPosition - 10000);
    }
}

function forwardVideo() {
    if (isPlaying) {
        const currentPosition = avplay.getCurrentTime();
        avplay.seekTo(currentPosition + 10000);
    }
}

function enterFullscreen() {
    if (playerElement.requestFullscreen) {
        playerElement.requestFullscreen();
    } else if (playerElement.mozRequestFullScreen) { // Firefox
        playerElement.mozRequestFullScreen();
    } else if (playerElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
        playerElement.webkitRequestFullscreen();
    } else if (playerElement.msRequestFullscreen) { // IE/Edge
        playerElement.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}

function toggleFullscreen() {
    if (!document.fullscreenElement &&
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement &&
        !document.msFullscreenElement) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

document.getElementById('playPauseBtn').addEventListener('click', playPauseVideo);
document.getElementById('stopBtn').addEventListener('click', stopVideo);
document.getElementById('rewindBtn').addEventListener('click', rewindVideo);
document.getElementById('forwardBtn').addEventListener('click', forwardVideo);
document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);

document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
        case 13: 
            playPauseVideo();
            break;
        case 415:
            playPauseVideo();
            break;
        case 19:
            playPauseVideo();
            break;
        case 413:
            stopVideo();
            break;
        case 412:
            rewindVideo();
            break;
        case 417:
            forwardVideo();
            break;
        case 10252:
            toggleFullscreen();
            break;
        default:
            break;
    }
});
