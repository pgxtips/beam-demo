// src/StartSessionModal.tsx
import Cookies from "js-cookie";
import Navbar from "./navbar";

import './startSessionModal.css'


type StartSessionModalProps = {
    onSessionStart: (sessionId: string) => void;
};

function StartSessionModal({ onSessionStart }: StartSessionModalProps) {
  const startSession = async () => {
    try {
        const env_endpoint = import.meta.env.VITE_BEAM_ENDPOINT;
        const endpoint = env_endpoint + "/external/createSession"
        console.log(endpoint)

        const res = await fetch(endpoint, { method: "GET" });
        const data = await res.json();

        console.log(data)

        const sessionId = data.session_id

        if (sessionId) {
            Cookies.set("session_id", sessionId);
            onSessionStart(sessionId);
        } else {
            console.error("No session_id returned");
        }
    } catch (err) {
        console.error("Error starting session:", err);
    }
  };

  return (
  <>
    <Navbar sessionId=""/>
    <div className="modalOverlay">
      <div className="modalContent">
        <h2>Start your session</h2>
        <button onClick={startSession}>Start</button>
      </div>
    </div>
  </>);
}

export default StartSessionModal;
