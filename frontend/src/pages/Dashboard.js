import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/statistiques/")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  const statCards = stats ? Object.entries(stats).map(([key, value]) => {
    const configs = {
      total_projets: { icon: "📁", label: "Projets", color: "#4facfe", bg: "rgba(79,172,254,0.1)", border: "rgba(79,172,254,0.2)" },
      total_taches: { icon: "📋", label: "Taches", color: "#a855f7", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.2)" },
      total_livrables: { icon: "📦", label: "Livrables", color: "#43e97b", bg: "rgba(67,233,123,0.1)", border: "rgba(67,233,123,0.2)" },
      total_evaluations: { icon: "⭐", label: "Evaluations", color: "#f7971e", bg: "rgba(247,151,30,0.1)", border: "rgba(247,151,30,0.2)" },
      total_utilisateurs: { icon: "👥", label: "Utilisateurs", color: "#00f2fe", bg: "rgba(0,242,254,0.1)", border: "rgba(0,242,254,0.2)" },
      mes_projets: { icon: "📁", label: "Mes Projets", color: "#4facfe", bg: "rgba(79,172,254,0.1)", border: "rgba(79,172,254,0.2)" },
      mes_taches: { icon: "📋", label: "Mes Taches", color: "#a855f7", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.2)" },
      mes_livrables: { icon: "📦", label: "Mes Livrables", color: "#43e97b", bg: "rgba(67,233,123,0.1)", border: "rgba(67,233,123,0.2)" },
    };
    const config = configs[key] || { icon: "📊", label: key, color: "#4facfe", bg: "rgba(79,172,254,0.1)", border: "rgba(79,172,254,0.2)" };
    return { key, value, ...config };
  }) : [];

  const getRoleColor = () => {
    if (user?.role === "administrateur") return "linear-gradient(135deg, #f7971e, #ffd200)";
    if (user?.role === "enseignant") return "linear-gradient(135deg, #a855f7, #4facfe)";
    return "linear-gradient(135deg, #4facfe, #00f2fe)";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a" }}>
      <Navbar />
      <div style={{ padding: "32px 24px", maxWidth: "1200px", margin: "0 auto" }}>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "32px", marginBottom: "32px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", background: getRoleColor(), borderRadius: "50%", opacity: 0.08, filter: "blur(40px)" }} />
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "8px" }}>Bienvenue,</p>
          <h1 style={{ color: "white", fontSize: "32px", fontWeight: "800", margin: "0 0 8px" }}>
            {user?.first_name || user?.username} 👋
          </h1>
          <span style={{ background: getRoleColor(), color: "white", padding: "6px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "700" }}>
            {user?.role}
          </span>
        </div>

        {stats ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            {statCards.map((stat) => (
              <div key={stat.key} style={{ background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: "16px", padding: "24px", textAlign: "center", transition: "all 0.3s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = `0 12px 30px ${stat.border}`; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <p style={{ fontSize: "36px", margin: "0 0 8px" }}>{stat.icon}</p>
                <p style={{ color: stat.color, fontSize: "36px", fontWeight: "800", margin: "0 0 4px" }}>{stat.value}</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", margin: 0 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "40px" }}>Chargement des statistiques...</p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "16px" }}>
          <div
            onClick={() => navigate("/projets")}
            style={{ background: "rgba(79,172,254,0.08)", border: "1px solid rgba(79,172,254,0.2)", borderRadius: "16px", padding: "24px", cursor: "pointer", transition: "all 0.3s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(79,172,254,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(79,172,254,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <p style={{ fontSize: "28px", margin: "0 0 12px" }}>📁</p>
            <h3 style={{ color: "white", margin: "0 0 6px", fontSize: "16px" }}>Voir les projets</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>Gerer vos projets et taches</p>
          </div>

          {(user?.role === "etudiant" || user?.role === "administrateur") && (
            <div
              onClick={() => navigate("/livrables")}
              style={{ background: "rgba(67,233,123,0.08)", border: "1px solid rgba(67,233,123,0.2)", borderRadius: "16px", padding: "24px", cursor: "pointer", transition: "all 0.3s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(67,233,123,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(67,233,123,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <p style={{ fontSize: "28px", margin: "0 0 12px" }}>📦</p>
              <h3 style={{ color: "white", margin: "0 0 6px", fontSize: "16px" }}>Mes livrables</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>Soumettre et suivre vos livrables</p>
            </div>
          )}

          {(user?.role === "enseignant" || user?.role === "administrateur") && (
            <div
              onClick={() => navigate("/evaluations")}
              style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: "16px", padding: "24px", cursor: "pointer", transition: "all 0.3s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(168,85,247,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(168,85,247,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <p style={{ fontSize: "28px", margin: "0 0 12px" }}>⭐</p>
              <h3 style={{ color: "white", margin: "0 0 6px", fontSize: "16px" }}>Evaluations</h3>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", margin: 0 }}>Evaluer les livrables des etudiants</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;