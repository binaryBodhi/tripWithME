import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createTrip } from "../services/trip";
import { useToast } from "../contexts/ToastContext";
import "../styles/CreateTrip.css";

function CreateTrip() {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we came from "Repeat Trip"
    const initialState = location.state || {};

    const [from, setFrom] = useState(initialState.from_location || "");
    const [to, setTo] = useState(initialState.to_location || "");
    const [tripDate, setTripDate] = useState("");
    const [hour, setHour] = useState("12");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("AM");

    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert 12h format to 24h for ISO string
            let h = parseInt(hour);
            if (period === "PM" && h !== 12) h += 12;
            if (period === "AM" && h === 12) h = 0;

            const timeString = `${h.toString().padStart(2, '0')}:${minute}:00`;
            const combinedDateTimeString = `${tripDate}T${timeString}`;
            const departureDate = new Date(combinedDateTimeString);

            if (departureDate < new Date()) {
                showToast("Departure time cannot be in the past", "error");
                return;
            }

            await createTrip({
                from_location: from,
                to_location: to,
                departure_date: departureDate.toISOString()
            });
            showToast("Trip created successfully!", "success");
            navigate("/search");
        } catch (err) {
            console.error("Failed to create trip", err);
            showToast("Failed to create trip", "error");
        }
    };

    return (
        <div className="create-trip-container">
            <form className="create-trip-form" onSubmit={handleSubmit}>
                <button type="button" className="back-link" onClick={() => navigate("/search")}>← Back to Search</button>
                <h1>Create a Trip</h1>
                <div className="form-group">
                    <label>From</label>
                    <input
                        type="text"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="Departure City"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>To</label>
                    <input
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="Destination City"
                        required
                    />
                </div>
                <div className="form-row">
                    <div className="form-group flex-1">
                        <label>Departure Date</label>
                        <input
                            type="date"
                            value={tripDate}
                            onChange={(e) => setTripDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group flex-1">
                        <label>Departure Time</label>
                        <div className="time-picker-row">
                            <select value={hour} onChange={(e) => setHour(e.target.value)} required>
                                {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(h => (
                                    <option key={h} value={h}>{h}</option>
                                ))}
                            </select>
                            <span className="time-separator">:</span>
                            <select value={minute} onChange={(e) => setMinute(e.target.value)} required>
                                {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <select value={period} onChange={(e) => setPeriod(e.target.value)} required>
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <button type="submit" className="submit-button">Create Trip</button>
                </div>
            </form>
        </div>
    );
}

export default CreateTrip;
