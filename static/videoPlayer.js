$(document).ready(() => {
    let players = {};

    const videoIds = ["NsMKvVdEPkw", "NBpI7KVW1IQ", "IInciWyU74U"];
    const $scrollContainer = $("#scrollContainer");
    
    // Load the YouTube Iframe Player API asynchronously
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // Create video frames
    videoIds.forEach((id) => {
        const $wrapper = $("<div>").addClass("videoFrameWrapper");
        const $videoFrame = createVideoFrame(id);
        $wrapper.append($videoFrame);
        $scrollContainer.append($wrapper);
    });
    
    function createVideoFrame(id) {
        const $container = $("<div>").addClass("videoFrame");
        $container.data("content-id", id)

        const $playerSect= $("<div>").addClass("playerSect");
        const $iframe = $("<iframe>")
        $iframe.attr("id", "player-"+id)
        $iframe.attr("type", "text/html")
        $iframe.attr("src", `https://www.youtube.com/embed/${id}?rel=0&controls=0&playlist=${id}&loop=1&playsinline=1&enablejsapi=1&mute=1`)
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
    
    // This function will be called automatically when YouTube API is ready
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
        // You can do something when a player is ready, e.g., log it
        console.log(`Player ${event.target.getIframe().id} is ready.`);
        //event.target.mute(); // Autoplay if desired
        //event.target.playVideo(); // Autoplay if desired
    }
    
    function onPlayerStateChange(event) {
        // You can track the state changes of each player here
        let playerElementId = event.target.getIframe().id;
        let playerStatus = event.data;
        console.log(`Player ${playerElementId} state changed to: ${playerStatus}`);
        changeBorderColor(playerElementId, playerStatus);
    }
    
    function changeBorderColor(playerId, playerStatus) {
        let color;
        if (playerStatus == -1) {
            color = "#37474F"; // unstarted = gray
        } else if (playerStatus == 0) {
            color = "#FFFF00"; // ended = yellow
        } else if (playerStatus == 1) {
            color = "#33691E"; // playing = green
        } else if (playerStatus == 2) {
            color = "#DD2C00"; // paused = red
        } else if (playerStatus == 3) {
            color = "#AA00FF"; // buffering = purple
        } else if (playerStatus == 5) {
            color = "#FF6D00"; // video cued = orange (fixed typo in hex code)
        }
        if (color) {
            console.log("Setting border color for", playerId, "to", color);
            $(`#${playerId}`).parent().css('border', `2px solid ${color}`);
        }
    }
     
});
