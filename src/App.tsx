import { useEffect, useRef, useState } from 'react'

import './app.css'
import VideoFrame from './videoFrame.tsx'
import Navbar from './navbar.tsx'
import StartSessionModal from './startSessionModal.tsx'
import { useSession } from './context/sessionContext.tsx';

type recommendationData = {
    status: string
    recommendations: string[]
}

async function getRecommendation(sessionId: string) {
    const env_endpoint = import.meta.env.VITE_BEAM_ENDPOINT;
    const endpoint = env_endpoint + "/external/recommend";

    const formData = new FormData();
    formData.append("session_id", sessionId);

    const req = await fetch(endpoint, { method: "POST", body: formData })
    const data: recommendationData = await req.json() 

    return data
}

window.getRecommendation = getRecommendation;

function App() {

    const { sessionId, setSessionId } = useSession();
    const [videoIds, setVideoIds] = useState<string[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        const el = containerRef.current;
        if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
            setVideoIds(prev => [...prev, ...prev]); // Just duplicating for now
        }
    };

    useEffect(() => {
        const el = containerRef.current;
        if (el) el.addEventListener('scroll', handleScroll);
        return () => el?.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!sessionId) return;
        getRecommendation(sessionId).then((data) => {setVideoIds(data.recommendations)})
    }, [sessionId]);


    if (!sessionId) {
        return <StartSessionModal onSessionStart={setSessionId} />
    }

    return (
    <>
        <Navbar sessionId={sessionId}/>
        <div className="scrollContainer" ref={containerRef}>
            {videoIds.map((id, index) => (
                <div className="videoFrameWrapper" key={index}>
                <VideoFrame videoID={id} sessionId={sessionId} />
                </div>
            ))}
        </div>
    </>
    )
}

export default App
