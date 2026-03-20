import { useEffect, useRef } from "react";

import "../styles/Menu.css";

function Menu({ open, onClose, children }) {
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={ref} className="menu-card fade-slide">
      {children}
    </div>
  );
}

export default Menu;
