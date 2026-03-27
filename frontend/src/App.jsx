import { Routes, Route } from 'react-router-dom'
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectRoute.jsx"
import { ToastProvider } from "./contexts/ToastContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Welcome from './pages/Welcome.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AdditionalDetails from './pages/AdditionalDetails.jsx'

import Search from './pages/Search.jsx'
import CreateTrip from './pages/CreateTrip.jsx'
import TripDetails from './pages/TripDetails.jsx'
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import PreviousTrips from "./pages/PreviousTrips";
// import CurrentTrip from "./pages/CurrentTrip";
// import UpcomingTrips from "./pages/UpcomingTrips";



function App() {
    return (
        <ThemeProvider>
            <ToastProvider>
                <Routes>
                    <Route path='/' element={<Welcome />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />

                    <Route element={<ProtectedRoute />}>
                        <Route element={<AppLayout />}>
                            <Route path="/additional-details" element={<AdditionalDetails />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/create-trip" element={<CreateTrip />} />
                            <Route path="/trips/:tripId" element={<TripDetails />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/notifications" element={<Notifications />} />
                            <Route path="/previous" element={<PreviousTrips />} />
                            {/* <Route path="/current" element={<CurrentTrip />} /> */}
                            {/* <Route path="/upcoming" element={<UpcomingTrips />} /> */}
                        </Route>
                    </Route>
                </Routes>
            </ToastProvider>
        </ThemeProvider>
    )
}

export default App
