import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPreviousTrips } from "../services/trip";
import { formatDepartureDate } from "../utils/dateUtils";
import { useAuth } from "../contexts/AuthContext";
import "../styles/PreviousTrips.css";

function PreviousTrips() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const res = await getPreviousTrips();
                setTrips(res.data);
            } catch (err) {
                console.error("Failed to fetch previous trips", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    const filteredTrips = trips.filter(trip => {
        if (filter === "all") return true;
        return trip.status === filter;
    });

    const completedTrips = trips.filter(t => t.status === "completed").length;
    
    // Calculate unique companions
    const uniqueCompanions = new Set();
    trips.filter(t => t.status === "completed").forEach(trip => {
        trip.passengers.forEach(p => {
            if (p !== user?.id && p !== user?._id) {
                uniqueCompanions.add(p);
            }
        });
    });

    const handleRepeatTrip = (e, trip) => {
        e.stopPropagation();
        navigate("/create-trip", {
            state: {
                from_location: trip.from_location,
                to_location: trip.to_location
            }
        });
    };

    if (loading) {
        return <div className="previous-trips-page"><div className="loading-state">Loading history...</div></div>;
    }

    return (
        <div className="previous-trips-page">
            <div className="page-header">
                <h1>Trip History</h1>
            </div>

            <div className="metrics-dashboard">
                <div className="metric-card">
                    <div className="metric-value">{completedTrips}</div>
                    <div className="metric-label">Completed Trips</div>
                </div>
                <div className="metric-card">
                    <div className="metric-value">{uniqueCompanions.size}</div>
                    <div className="metric-label">Fellow Travelers</div>
                </div>
            </div>

            <div className="filters">
                <button 
                    className={`filter-btn ${filter === "all" ? "active" : ""}`}
                    onClick={() => setFilter("all")}
                >
                    All History
                </button>
                <button 
                    className={`filter-btn ${filter === "completed" ? "active" : ""}`}
                    onClick={() => setFilter("completed")}
                >
                    Completed
                </button>
                <button 
                    className={`filter-btn ${filter === "cancelled" ? "active" : ""}`}
                    onClick={() => setFilter("cancelled")}
                >
                    Cancelled
                </button>
            </div>

            <div className="trip-history-list">
                {filteredTrips.length === 0 ? (
                    <div className="empty-history">
                        <p>No trips found for this filter.</p>
                    </div>
                ) : (
                    filteredTrips.map(trip => (
                        <div 
                            key={trip.id} 
                            className="history-card"
                            onClick={() => navigate(`/trips/${trip.id}`)}
                        >
                            <div className="history-header">
                                <div>
                                    <h3 className="history-route">{trip.from_location} → {trip.to_location}</h3>
                                    <p className="history-date">
                                        {formatDepartureDate(trip.departure_date)}
                                    </p>
                                </div>
                                <span className={`status-badge ${trip.status}`}>
                                    {trip.status}
                                </span>
                            </div>

                            <div className="history-details">
                                <div className="history-creator">
                                    <div className="creator-avatar">
                                        {(trip.creator_name || "U")[0].toUpperCase()}
                                    </div>
                                    <span>
                                        {trip.creator_id === (user?.id || user?._id) ? "Created by You" : `Created by ${trip.creator_name}`}
                                    </span>
                                </div>
                                
                                <button 
                                        className="repeat-btn"
                                        onClick={(e) => handleRepeatTrip(e, trip)}
                                    >
                                        <span>↺</span> Repeat Trip
                                    </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default PreviousTrips;