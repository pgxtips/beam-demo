import { faThumbsDown, faThumbsUp, faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPlayer from "react-player/youtube";

const env_endpoint = import.meta.env.VITE_BEAM_ENDPOINT;

import './videoFrame.css'
import { useEffect, useRef, useState } from "react";

type VideoFrameProps = {
    videoID: string
    sessionId: string
}

function VideoFrame(props: VideoFrameProps){

    const [muted, setMuted] = useState(true)
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);


    const playerRef = useRef<ReactPlayer | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isInViewport, setIsInViewport] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const isVisible = entry.isIntersecting;
                    setIsInViewport(isVisible);

                    //if (isVisible && playerRef.current){
                    //    playerRef.current.seekTo(0)
                    //}
                });
            },
            { threshold: 0.5 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);


    const toggleMute = () => {
        setMuted(prev => !prev)
    }

    const toggleLike = async () => {
        setLiked(prev => !prev);
        if (disliked) setDisliked(false); 

        const formData = new FormData()
        formData.append("session_id", props.sessionId)
        formData.append("content_id", props.videoID)

        const endpoint = env_endpoint + "/external/like"
        const res = await fetch(endpoint, { method: "POST", body: formData });
        const data = await res.json();

        console.log("like res data: ")
        console.log(data)
    }

    const toggleDislike = async () => {
        setDisliked(prev => !prev);

        const formData = new FormData()
        formData.append("session_id", props.sessionId)
        formData.append("content_id", props.videoID)

        const endpoint = env_endpoint + "/external/dislike"
        const res = await fetch(endpoint, { method: "POST", body: formData});
        const data = await res.json();

        console.log("like res data: ")
        console.log(data)
        if (liked) setLiked(false);
    }

    return (
        <div className="videoFrame" ref={containerRef}>
            <div className="playerSect">
                <ReactPlayer 
                    ref={playerRef}
                    className="player" 
                    playing={isInViewport}
                    loop={true}
                    muted={muted}
                    controls={false}
                    config={{
                        playerVars: { controls:0, modestbranding: 1 }
                    }}
                    playsinline={true}
                    url={"https://www.youtube.com/watch?v="+props.videoID}
                />
            </div>
            <div className="controlsSect">
                <FontAwesomeIcon 
                    className={`button ${liked ? "liked" : ""}`} 
                    icon={faThumbsUp} 
                    onClick={toggleLike} 
                />
                <FontAwesomeIcon 
                    className={`button ${disliked ? "disliked" : ""}`} 
                    icon={faThumbsDown} 
                    onClick={toggleDislike} 
                />
                <FontAwesomeIcon 
                    className="button" 
                    icon={muted ? faVolumeMute : faVolumeHigh}
                    onClick={toggleMute}
                />
            </div>
        </div>
    )
}

export default VideoFrame;
