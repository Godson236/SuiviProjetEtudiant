import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? "#4facfe" : "rgba(255,255,255,0.7)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: isActive(path) ? "700" : "500",
    padding: "8px 16px",
    borderRadius: "8px",
    background: isActive(path) ? "rgba(79,172,254,0.15)" : hoveredLink === path ? "rgba(255,255,255,0.05)" : "transparent",
    border: isActive(path) ? "1px solid rgba(79,172,254,0.3)" : "1px solid transparent",
    transition: "all 0.3s ease",
  });

  return (
    <nav style={styles.nav}>
      <div style={styles.left}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🎓</span>
          <span style={styles.logoText}>SuiviProjet</span>
        </div>
      </div>

      <div style={styles.center}>
        {user?.role === "etudiant" && (
          <>
            <Link
              to="/projets"
              style={linkStyle("/projets")}
              onMouseEnter={() => setHoveredLink("/projets")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Mes Projets
            </Link>
            <Link
              to="/livrables"
              style={linkStyle("/livrables")}
              onMouseEnter={() => setHoveredLink("/livrables")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Livrables
            </Link>
          </>
        )}
        {user?.role === "enseignant" && (
          <>
            <Link
              to="/projets"
              style={linkStyle("/projets")}
              onMouseEnter={() => setHoveredLink("/projets")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Projets
            </Link>
            <Link
              to="/evaluations"
              style={linkStyle("/evaluations")}
              onMouseEnter={() => setHoveredLink("/evaluations")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Evaluations
            </Link>
          </>
        )}
        {user?.role === "administrateur" && (
          <>
            <Link
              to="/projets"
              style={linkStyle("/projets")}
              onMouseEnter={() => setHoveredLink("/projets")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Projets
            </Link>
            <Link
              to="/livrables"
              style={linkStyle("/livrables")}
              onMouseEnter={() => setHoveredLink("/livrables")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Livrables
            </Link>
            <Link
              to="/evaluations"
              style={linkStyle("/evaluations")}
              onMouseEnter={() => setHoveredLink("/evaluations")}
              onMouseLeave={() => setHoveredLink(null)}
            >
              Evaluations
            </Link>
          </>
        )}
      </div>

      <div style={styles.right}>
        <div style={styles.userBadge}>
          <span style={styles.userAvatar}>
            {user?.username?.charAt(0).toUpperCase()}
          </span>
          <div style={styles.userInfo}>
            <span style={styles.userName}>{user?.username}</span>
            <span style={styles.userRole}>{user?.role}</span>
          </div>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>
          Deconnexion
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: "64px",
    background: "rgba(10,10,26,0.95)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  left: { display: "flex", alignItems: "center" },
  logo: { display: "flex", alignItems: "center", gap: "10px" },
  logoIcon: { fontSize: "24px" },
  logoText: {
    fontSize: "18px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #4facfe, #a855f7)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  center: { display: "flex", alignItems: "center", gap: "8px" },
  right: { display: "flex", alignItems: "center", gap: "12px" },
  userBadge: {
    display: "flex", alignItems: "center", gap: "10px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px", padding: "6px 12px",
  },
  userAvatar: {
    width: "32px", height: "32px",
    background: "linear-gradient(135deg, #4facfe, #a855f7)",
    borderRadius: "8px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "14px", fontWeight: "700", color: "white",
  },
  userInfo: { display: "flex", flexDirection: "column" },
  userName: { color: "white", fontSize: "13px", fontWeight: "600" },
  userRole: { color: "rgba(255,255,255,0.4)", fontSize: "11px", textTransform: "capitalize" },
  logoutBtn: {
    background: "rgba(246,79,89,0.15)",
    border: "1px solid rgba(246,79,89,0.3)",
    color: "#f64f59", padding: "8px 16px",
    borderRadius: "8px", cursor: "pointer",
    fontSize: "13px", fontWeight: "600",
    transition: "all 0.3s ease",
  },
};

export default Navbar;