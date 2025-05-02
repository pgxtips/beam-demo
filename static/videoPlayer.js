$(document).ready(() => {
    let players = {};

    const videoIds = ["NsMKvVdEPkw", "NBpI7KVW1IQ", "IInciWyU74U"];
    const $scrollContainer = $("#scrollContainer");
    
    // load the YouTube Iframe Player API asynchronously
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // create video frames
    videoIds.forEach((id) => {
        const $wrapper = $("<div>").addClass("videoFrameWrapper");
        $wrapper.data("content-id", id)
        const $videoFrame = createVideoFrame(id);
        $wrapper.append($videoFrame);
        $scrollContainer.append($wrapper);
    });
    
    function createVideoFrame(id) {
        const $container = $("<div>").addClass("videoFrame");

        const $playerSect= $("<div>").addClass("playerSect");
        const $iframe = $("<iframe>")
        $iframe.attr("id", "player-"+id)
        $iframe.attr("type", "text/html")
        $iframe.attr("src", `https://www.youtube-nocookie.com/embed/${id}?&rel=0&controls=0&playlist=${id}&loop=1&playsinline=1&enablejsapi=1&mute=1`)
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
    
    window.onYouTubeIframeAPIReady = function() {
        console.log("YouTube API Ready");
        
        // Initialize players for each video
        videoIds.forEach((id) => {
            let playerId =  "player-"+id;
            players[playerId] = new YT.Player(playerId, {
                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        });


    };
    
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
});
