import { useEffect, useRef, useState } from 'react'

import '@/styles/app.css'
import VideoFrame from '@/components/videoFrame.tsx'
import Navbar from '@/components/navbar.tsx'

import StartSessionModal from '@/components/startSessionModal.tsx'
import PreferenceModal from '@/components/preferencesModal.tsx'

import { useSession } from '@/context/sessionContext.tsx';

import recommend from "@/models/recommend.ts"

function App() {

    const { sessionId, setSessionId, preferences, setPreferences } = useSession();
    const [videoIds, setVideoIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const initialLoadDone = useRef(false);

    const containerRef = useRef<HTMLDivElement>(null);

    /* -------------------------
          HELPER FUNCTIONS
    ------------------------- */

    const handleScroll = async () => {
        if (!initialLoadDone.current || !sessionId || !preferences ) return;

        const el = containerRef.current;
        if (!el || loading ) return;

        const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100;
        if (nearBottom) {
            setLoading(true);
            try {
                const data = await recommend(sessionId);
                setVideoIds(prev => [...prev, ...data.recommendations]);
            } finally {
                setLoading(false);
            }
        }
    };


    /* -------------------------
          EFFECT FUNCTIONS
    ------------------------- */

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        let timeout: number;

        const debouncedHandleScroll = () => {
            clearTimeout(timeout);
            timeout = window.setTimeout(() => {
                handleScroll();
            }, 150);
        };

        el.addEventListener('scroll', debouncedHandleScroll);
        return () => el.removeEventListener('scroll', debouncedHandleScroll);
    }, [loading, sessionId]);


    // initial fetch of recommendations after session has been established
    useEffect(() => {
        if (!sessionId || !preferences || initialLoadDone.current) return;
        {
            recommend(sessionId).then((data) => {setVideoIds(data.recommendations)})
            initialLoadDone.current = true;
        }
    }, [sessionId]);

    /* -------------------------
          PRERENDER LOGIC
    ------------------------- */

    if (!sessionId && !preferences) {
        return <StartSessionModal onSessionStart={setSessionId} />
    } else if (sessionId && !preferences) {
        return <PreferenceModal onPrefSubmit={setPreferences} />
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
