import { createContext, useContext, useState, ReactNode } from "react";
import Cookies from 'js-cookie'; // make sure you have this installed

type SessionContextType = {
    sessionId: string | null;
    setSessionId: (id: string) => void;

    preferences: string[] | null;
    setPreferences: (prefs: string[]) => void;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
    const [sessionId, setSessionId] = useState<string | null>(Cookies.get("session_id") ?? null)
    const [preferences, setPreferences] = useState<string[] | null>(Cookies.get("preferences") ?? null)

    return (
        <SessionContext.Provider value={{ sessionId, setSessionId, preferences, setPreferences }}>
        {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
};
