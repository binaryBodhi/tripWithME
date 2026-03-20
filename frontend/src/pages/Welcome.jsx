import { Link } from 'react-router-dom'

import '../styles/Welcome.css'
import '../styles/Brand.css'

function Welcome() {
    return (
        <div className="welcome-container">
            <h1 className="brand-hero">
                TripWith<span className="brand-me">ME</span>
            </h1>
            <p className="welcome-tagline">Your journey, shared.</p>
            <div className="welcome-actions">
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
            </div>
        </div>
    )
}

export default Welcome