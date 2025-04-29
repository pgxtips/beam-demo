import { useEffect, useRef, useState } from 'react'
import Cookies from "js-cookie";

import './app.css'
import VideoFrame from './videoFrame.tsx'
import Navbar from './navbar.tsx'
import StartSessionModal from './startSessionModal.tsx'

function App() {

    const [sessionId, setSessionId] = useState<string | null>(Cookies.get("session_id") ?? null)

    const initialVideos = [
      "ed-n9qytdQ0",
      "3JZ_D3ELwOQ",
      "ltrMfT4Qz5Y",
      "M7lc1UVf-VE",
    ]

    const [videoIds, setVideoIds] = useState(initialVideos)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleScroll = () => {
        const el = containerRef.current
        if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
            setVideoIds(prev => [...prev, ...initialVideos]) // Append more
        }
    }

    useEffect(() => {
        const el = containerRef.current
        if (el) el.addEventListener('scroll', handleScroll)
            return () => el?.removeEventListener('scroll', handleScroll)
    }, [])

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
