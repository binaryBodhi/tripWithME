import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import TopNav from "../components/TopNav.jsx";
import BottomNav from "../components/BottomNav.jsx";

function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ 
      minHeight: "100dvh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "var(--bg-primary)",
      color: "var(--text-primary)"
    }}>
      <TopNav user={user} onLogout={handleLogout} />

      <main style={{ 
        flex: 1,
        paddingTop: "calc(60px + env(safe-area-inset-top, 0px))",
        paddingBottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)"
      }}>
        <Outlet />
      </main>

      <BottomNav />
    </div>
  );
}

export default AppLayout;
