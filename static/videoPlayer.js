var players = {};

const COUNTDOWN_DURATION = 1 * 60; // 5 minutes in seconds
const STORAGE_KEY = "countdownEndTime";

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function recommend(){
    try{
        const res = await fetch("/api/recommend", { method: "GET" });
        const data = await res.json();
        return data.recommendations
    } catch(e) {
        console.log("error: ", e)
    }
}

$(document).ready(async() => {

    var videoIds = []
    var endObserver; 
    const $scrollContainer = $("#scrollContainer");

    // load the YouTube Iframe Player API asynchronously
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = async function() {
        //var videoIds = ["NsMKvVdEPkw", "NBpI7KVW1IQ", "IInciWyU74U"];
        videoIds = await recommend();

        function init(){
            // create video frames
            videoIds.forEach((id) => {
                const $wrapper = $("<div>").addClass("videoFrameWrapper");
                $wrapper.data("content-id", id)
                const $videoFrame = createVideoFrame(id);
                $wrapper.append($videoFrame);
                $scrollContainer.append($wrapper);
                // create players
                let playerId =  "player-"+id;
                players[playerId] = new YT.Player(playerId, {
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            });

            observeLastVideo()
        }


        function createVideoFrame(id) {
            const $container = $("<div>").addClass("videoFrame");

            const $playerSect= $("<div>").addClass("playerSect");
            const $iframe = $("<iframe>")
            $iframe.attr("id", "player-"+id)
            $iframe.attr("type", "text/html")
            $iframe.attr("src", `https://www.youtube.com/embed/${id}?&rel=0&controls=0&playlist=${id}&loop=1&playsinline=1&enablejsapi=1&mute=1`)
            $iframe.attr("frameborder", "0")
            $iframe.attr("allow", "autoplay; encrypted-media; gyroscope; picture-in-picture")

            $playerSect.append($iframe)

            const $controlsSect = $("<div>").addClass("controlsSect");
            const $thumbsup= $("<i>")
                .addClass("fa-solid")
                .addClass("fa-thumbs-up")
                .addClass("likeBtn");
            const $thumbsdown= $("<i>")
                .addClass("fa-solid")
                .addClass("fa-thumbs-down")
                .addClass("dislikeBtn");
            const $speaker= $("<i>")
                .addClass("fa-solid")
                .addClass("fa-volume-xmark")
                .addClass("muteBtn");

            $controlsSect.append($thumbsup)
            $controlsSect.append($thumbsdown)
            $controlsSect.append($speaker)

            $($controlsSect).on("click", ".muteBtn", function(){
                console.log(players)
                let player = players["player-"+id] 
                $btn = $(this)

                if (player.isMuted()) {
                    $btn.removeClass("fa-volume-xmark")
                    $btn.addClass("fa-volume-high")
                    player.unMute() 
                }
                else {
                    $btn.removeClass("fa-volume-high")
                    $btn.addClass("fa-volume-xmark")
                    player.mute()
                }
            })

            $container.append($playerSect);
            $container.append($controlsSect);
            return $container;
        }

        console.log("YouTube API Ready");

        function onPlayerReady(event) {
            let $wrapper = $(event.target.g).closest(".videoFrameWrapper")

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const id = $(entry.target).data("content-id");
                    const playerId = "player-" + id;
                    const player = players[playerId];

                    if (!player) return;

                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                        player.playVideo();
                    } else {
                        player.pauseVideo();
                    }
                });
            }, {
                root: document.querySelector("#scrollContainer"),
                threshold: 0.5
            });

            // Attach observer to each video wrapper
            observer.observe($wrapper[0]);
        }

        function onPlayerStateChange(event) {
            let playerElementId = event.target.getIframe().id;
            let playerStatus = event.data;
            //console.log(`Player ${playerElementId} state changed to: ${playerStatus}`);
        }

        function observeLastVideo() {
            if (endObserver) endObserver.disconnect();

            const $lastWrapper = $(".videoFrameWrapper").last();

            endObserver = new IntersectionObserver((entries) => {
                entries.forEach(async(entry) => {
                    if (entry.isIntersecting) {

                        // remove old ones
                        //let $wrappers = $("iframe");
                        //for (let idx=0; idx < $wrappers.length-1; ++idx){ 
                            //    $wrappers[idx].remove() 
                            //}
                        //players = {}; 

                        // append new video
                        videoIds = await recommend() 
                        init();
                    }
                });
            }, {
                root: document.querySelector("#scrollContainer"),
                threshold: 0.5
            });

            endObserver.observe($lastWrapper[0]);
        }

        init()
    }

    function startOrResumeCountdown() {
        const $timer = $("#timer");

        function getEndTime() {
            let endT = localStorage.getItem(STORAGE_KEY);
            return endT ? parseInt(endT) : null;
        }

        function createEndTime() {
            const newEndT = Date.now() + COUNTDOWN_DURATION * 1000;
            localStorage.setItem(STORAGE_KEY, newEndT);
            return newEndT;
        }

        let endTime = getEndTime() ?? createEndTime();

        function updateDisplay() {
            const now = Date.now();
            let remaining = Math.max(0, Math.floor((endTime - now) / 1000));

            const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
            const seconds = (remaining % 60).toString().padStart(2, '0');
            $timer.text(`${minutes}:${seconds}`);

            if (remaining <= 0) {
                clearInterval(interval);
                $timer.text("00:00");

                let finalPhase = getCookie("finalPhase");
                if (!finalPhase) {
                    $("#movePhaseModal").removeClass("hidden")
                } else {
                    setCookie("sessionComplete", true, 1);
                    window.location.reload()
                }
            }
        }

        let interval = setInterval(updateDisplay, 1000);

        $(document).on("click", "#movePhaseBtn", function() {
            setCookie("finalPhase", true, 1);
            endTime = createEndTime();
            interval = setInterval(updateDisplay, 1000);
            window.location.reload()
        });

    }

    startOrResumeCountdown();

});
