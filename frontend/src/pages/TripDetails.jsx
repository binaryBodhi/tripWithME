import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTripById, joinTrip, leaveTrip, cancelTrip, completeTrip, acceptJoin, rejectJoin } from "../services/trip";
import { formatDepartureDate } from "../utils/dateUtils";
import { useToast } from "../contexts/ToastContext";
import { useAuth } from "../contexts/AuthContext";
import Modal from "../components/Modal";
import "../styles/TripDetails.css";

function TripDetails() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    const { showToast } = useToast();

    const fetchTrip = async () => {
        try {
            const res = await getTripById(tripId);
            setTrip(res.data);
        } catch (err) {
            console.error("Failed to fetch trip details", err);
            showToast("Trip not found", "error");
            navigate("/search");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tripId) {
            fetchTrip();
        }
    }, [tripId]);

    const handleJoin = async () => {
        try {
            await joinTrip(tripId);
            fetchTrip();
        } catch (err) {
            console.error("Failed to join trip", err);
        }
    };

    const handleLeave = async () => {
        try {
            await leaveTrip(tripId);
            setShowLeaveModal(false);
            fetchTrip();
            showToast("Left trip successfully", "success");
        } catch (err) {
            console.error("Failed to leave trip", err);
            showToast("Failed to leave trip", "error");
        }
    };

    const handleCancel = async () => {
        try {
            await cancelTrip(tripId);
            setShowCancelModal(false);
            fetchTrip();
            showToast("Trip cancelled successfully", "success");
        } catch (err) {
            console.error("Failed to cancel trip", err);
            showToast("Failed to cancel trip", "error");
        }
    };

    const handleComplete = async () => {
        try {
            await completeTrip(tripId);
            setShowCompleteModal(false);
            fetchTrip();
            showToast("Trip marked as completed", "success");
        } catch (err) {
            console.error("Failed to complete trip", err);
            showToast("Failed to complete trip", "error");
        }
    };

    const handleAcceptJoin = async (userId) => {
        try {
            await acceptJoin(tripId, userId);
            showToast("User accepted into trip!", "success");
            fetchTrip();
        } catch (err) {
            console.error("Failed to accept join", err);
            showToast("Failed to accept user", "error");
        }
    };

    const handleRejectJoin = async (userId) => {
        try {
            await rejectJoin(tripId, userId);
            showToast("Join request rejected.", "success");
            fetchTrip();
        } catch (err) {
            console.error("Failed to reject join", err);
            showToast("Failed to reject request", "error");
        }
    };

    if (loading) return <div className="details-container">Loading...</div>;
    if (!trip) return <div className="details-container">Trip not found</div>;

    const isPassenger = user && trip.passengers.includes(user.id || user._id);
    const isPending = user && trip.pending_passengers && trip.pending_passengers.some(p => (p.id || p) === (user.id || user._id));
    const isCreator = user && (trip.creator_id === (user.id || user._id));

    return (
        <div className="details-container">
            <div className="details-card">
                <button className="back-link" onClick={() => navigate("/search")}>← Back to Search</button>

                <div className="details-header">
                    <h1>Trip Details</h1>
                    <span className={`status-badge ${trip.status}`}>{trip.status}</span>
                </div>

                <div className="route-section">
                    <div className="location">
                        <label>From</label>
                        <p>{trip.from_location}</p>
                    </div>
                    <div className="arrow">→</div>
                    <div className="location">
                        <label>To</label>
                        <p>{trip.to_location}</p>
                    </div>
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <label>Departure</label>
                        <p>{formatDepartureDate(trip.departure_date)}</p>
                    </div>
                    <div className="info-item">
                        <label>Created By</label>
                        <p>{trip.creator_name || "Unknown"}</p>
                    </div>
                    <div className="info-item">
                        <label>Creator Phone</label>
                        <p style={{ color: trip.creator_phone ? 'inherit' : 'var(--text-secondary)', fontStyle: trip.creator_phone ? 'normal' : 'italic' }}>
                            {trip.creator_phone || "Hidden until approved 🔒"}
                        </p>
                    </div>
                    <div className="info-item">
                        <label>Passengers</label>
                        <p>{trip.passengers.length}</p>
                    </div>
                </div>

                <div className="actions-section">
                    {trip.status === "created" && (
                        <>
                            {isCreator ? (
                                <>
                                    <div className="admin-actions">
                                        <button onClick={() => setShowCancelModal(true)} className="cancel-button">Cancel Trip</button>
                                        <button onClick={() => setShowCompleteModal(true)} className="complete-button">Mark as Completed</button>
                                    </div>

                                    {trip.pending_passengers && trip.pending_passengers.length > 0 && (
                                        <div className="pending-requests-section">
                                            <h3>Pending Requests ({trip.pending_passengers.length})</h3>
                                            <div className="pending-list">
                                                {trip.pending_passengers.map((p) => (
                                                    <div key={p.id} className="pending-request-card">
                                                        <span className="user-name">{p.name}</span>
                                                        <div className="request-actions">
                                                            <button 
                                                                className="request-btn accept"
                                                                onClick={() => handleAcceptJoin(p.id)}
                                                            >
                                                                Accept
                                                            </button>
                                                            <button 
                                                                className="request-btn reject"
                                                                onClick={() => handleRejectJoin(p.id)}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <>
                                    {isPassenger ? (
                                        <button onClick={() => setShowLeaveModal(true)} className="leave-button">Leave Trip</button>
                                    ) : (
                                        <>
                                            {isPending ? (
                                                <button className="pending-detail-button" disabled>Pending Approval</button>
                                            ) : (
                                                <button onClick={handleJoin} className="join-detail-button">Join Trip</button>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>

            <Modal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancel}
                title="Cancel Trip"
                message="Are you sure you want to cancel this trip? This action cannot be undone."
            />

            <Modal 
                isOpen={showCompleteModal}
                onClose={() => setShowCompleteModal(false)}
                onConfirm={handleComplete}
                title="Complete Trip"
                message="Are you sure you want to mark this trip as completed?"
            />

            <Modal 
                isOpen={showLeaveModal}
                onClose={() => setShowLeaveModal(false)}
                onConfirm={handleLeave}
                title="Leave Trip"
                message="Are you sure you want to leave this trip?"
            />
        </div>
    );
}

export default TripDetails;
