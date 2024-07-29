const playerElement = document.getElementById('player');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');

let videoUrl = 'https://play.kringvarp.fo/redirect/uttanlands/_definst_/1080?type=m3u8'; // Replace with your actual video URL
let avplay = null; // AVPlay instance

function initializeAVPlay() {
    try {
        if (window.tizen || navigator.userAgent.includes('Samsung')) {
            // Only execute on Samsung TVs
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
                    showError('Error loading stream');
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

            avplay.prepareAsync(() => {
                avplay.play();
            });
        } else {
            // Web-based video playback (e.g., on a desktop browser)
            setupWebPlayer();
        }
    } catch (error) {
        console.error('Failed to initialize AVPlay:', error);
        showError('Error initializing video playback.');
    }
}

function setupWebPlayer() {
    const videoElement = document.createElement('video');
    videoElement.src = videoUrl;
    videoElement.style.width = '100%';
    videoElement.style.height = '100%';
    videoElement.autoplay = true;
    videoElement.muted = true; // Chrome autoplay policy requires muted autoplay
    videoElement.controls = false; // Ensure controls are hidden
    videoElement.oncanplay = () => {
        loadingElement.style.display = 'none';
        videoElement.play().catch((error) => {
            console.error('Autoplay failed:', error);
            showError('Autoplay is blocked by the browser.');
            videoElement.muted = true; // Mute and try again
            videoElement.play().catch(() => showError('Cannot play the video.'));
        });
    };
    videoElement.onerror = () => {
        showError('Failed to load video stream.');
    };
    playerElement.appendChild(videoElement);
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}