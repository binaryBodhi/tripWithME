import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTrips, joinTrip } from "../services/trip";
import { formatDepartureDate } from "../utils/dateUtils";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Search.css";

function Search() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchTrips = async () => {
        try {
            const res = await getTrips();
            setTrips(res.data);
        } catch (err) {
            console.error("Failed to fetch trips", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    const { showToast } = useToast();

    const isPending = (trip) => user && trip.pending_passengers && trip.pending_passengers.some(p => (p.id || p) === (user.id || user._id));
    const isJoined = (trip) => user && trip.passengers.includes(user.id || user._id);

    const handleJoin = async (tripId) => {
        try {
            await joinTrip(tripId);
            showToast("Join request sent to creator!", "success");
            fetchTrips();
        } catch (err) {
            console.error("Failed to join trip", err);
            showToast("Failed to send join request", "error");
        }
    };

    const handleCreate = () => {
        navigate("/create-trip");
    }

    const upcomingTrips = trips.filter(trip => isJoined(trip));

    const matchesQuery = (trip) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return trip.from_location.toLowerCase().includes(q) ||
            trip.to_location.toLowerCase().includes(q) ||
            (trip.creator_name && trip.creator_name.toLowerCase().includes(q));
    };

    const searchAvailable = trips.filter(trip =>
        (!isJoined(trip) && !isPending(trip)) && matchesQuery(trip)
    );

    const searchPending = trips.filter(trip =>
        isPending(trip) && matchesQuery(trip)
    );

    const searchJoined = trips.filter(trip =>
        isJoined(trip) && matchesQuery(trip)
    );

    const hasSearchResults = searchAvailable.length > 0 || searchJoined.length > 0 || searchPending.length > 0;

    const renderTripCard = (trip) => (
        <div
            key={trip.id}
            className="trip-card clickable"
            onClick={() => navigate(`/trips/${trip.id}`)}
        >
            <div className="trip-info">
                <p><strong>Route:</strong> {trip.from_location} → {trip.to_location}</p>
                <p><strong>Departure:</strong> {formatDepartureDate(trip.departure_date)}</p>
                <p><strong>Passengers:</strong> {trip.passengers.length}</p>
                <p><strong>Creator:</strong> {trip.creator_name || "Unknown"}</p>
            </div>
            <div className="trip-actions">
                {user && !isJoined(trip) && !isPending(trip) && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleJoin(trip.id);
                        }}
                        className="join-button"
                    >
                        Join
                    </button>
                )}
                {user && trip.passengers.includes(user.id || user._id) && (
                    <span className="joined-tag">Joined</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="search-page">
            <div className="search-header">
                <div className="search-box">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Where are you going with ME?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsDropdownVisible(true)}
                        onBlur={() => setTimeout(() => setIsDropdownVisible(false), 200)}
                    />

                    {isDropdownVisible && (
                        <div className="search-dropdown">
                            {!hasSearchResults ? (
                                <p className="empty-msg">No trips matching "{searchQuery}"</p>
                            ) : (
                                <>
                                    {searchAvailable.length > 0 && (
                                        <div className="search-section">
                                            <h3>Available to Join</h3>
                                            <div className="dropdown-list">
                                                {searchAvailable.map(renderTripCard)}
                                            </div>
                                        </div>
                                    )}
                                    {searchJoined.length > 0 && (
                                        <div className="search-section">
                                            <h3>Your Joined Trips</h3>
                                            <div className="dropdown-list">
                                                {searchJoined.map(renderTripCard)}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="search-actions">
                    <button className="search-button">Search</button>
                    <button className="create-button" onClick={handleCreate}>Create Trip</button>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">
                    <p>Loading trips...</p>
                </div>
            ) : (
                <div className="upcoming-trips-section">
                    <div className="section-header">
                        <h2>My Upcoming Trips</h2>
                        <span className="count-badge">{upcomingTrips.length}</span>
                    </div>
                    <div className="trip-list main-list">
                        {upcomingTrips.length === 0 ? (
                            <div className="empty-state-card">
                                <p>You haven't joined any trips yet.</p>
                                <p className="hint">Focus the search bar to discover available rides!</p>
                            </div>
                        ) : (
                            upcomingTrips.map(renderTripCard)
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Search;