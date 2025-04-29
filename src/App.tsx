import { useEffect, useRef, useState } from 'react'

import './app.css'
import VideoFrame from './videoFrame.tsx'
import Navbar from './navbar.tsx'

function App() {
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

    return (
    <>
        <Navbar sessionId="aslkdfjals"/>
        <div className="scrollContainer" ref={containerRef}>
            {videoIds.map((id, index) => (
                <div className="videoFrameWrapper" key={index}>
                <VideoFrame videoID={id} />
                </div>
            ))}
        </div>
    </>
    )
}

export default App
