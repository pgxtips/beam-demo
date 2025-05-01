// Navbar.tsx
import '@/styles/navbar.css'

type NavbarProps = {
  sessionId: string
}

function Navbar({ sessionId }: NavbarProps) {
  return (
    <div className="navbar">
        <div className="brand">
            <img src="/logo.png"></img>
            <span>beam</span>
        </div>
        <div className="session">Session: {sessionId}</div>
    </div>
  )
}

export default Navbar
