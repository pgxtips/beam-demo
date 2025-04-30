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
    const [loading, setLoading] = useState(false);
    const initialLoadDone = useRef(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = async () => {

        if (!initialLoadDone.current) return;

        const el = containerRef.current;
        if (!el || loading) return;

        const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100;
        if (nearBottom) {
            setLoading(true);
            try {
                const data = await getRecommendation(sessionId);
                setVideoIds(prev => [...prev, ...data.recommendations]); // append, not replace
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let timeout: number; // ✅ Use number, not NodeJS.Timeout

        const debouncedHandleScroll = () => {
            clearTimeout(timeout);
            timeout = window.setTimeout(() => {
                handleScroll();
            }, 150);
        };

        el.addEventListener('scroll', debouncedHandleScroll);
        return () => el.removeEventListener('scroll', debouncedHandleScroll);
    }, [loading, sessionId]);


    useEffect(() => {

        if (!sessionId || initialLoadDone.current) return;

        {
            getRecommendation(sessionId).then((data) => {setVideoIds(data.recommendations)})
            initialLoadDone.current = true;
        }

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
