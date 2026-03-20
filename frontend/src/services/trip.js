import { api } from "./api";

export const getTrips = (q = "") => api.get(`/trips/${q ? `?q=${q}` : ""}`);

export const getPreviousTrips = () => api.get("/trips/previous");

export const getTripById = (id) => api.get(`/trips/${id}`);

export const createTrip = (data) => api.post("/trips/create_trip", data);

export const joinTrip = (id) => api.post(`/trips/${id}/join`);

export const leaveTrip = (id) => api.post(`/trips/${id}/leave`);

export const cancelTrip = (id) => api.post(`/trips/${id}/cancel`);

export const completeTrip = (id) => api.post(`/trips/${id}/complete`);

export const acceptJoin = (tripId, userId) => api.post(`/trips/${tripId}/accept_join/${userId}`);

export const rejectJoin = (tripId, userId) => api.post(`/trips/${tripId}/reject_join/${userId}`);
