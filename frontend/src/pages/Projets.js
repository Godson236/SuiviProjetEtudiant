import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Projets = () => {
  const [projets, setProjets] = useState([]);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchProjets(); }, []);

  const fetchProjets = async () => {
    try {
      const res = await API.get("/projets/");
      setProjets(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projets/", { titre, description });
      setTitre(""); setDescription(""); setShowForm(false);
      fetchProjets();
    } catch (err) { console.error(err); }
  };

  const getStatutStyle = (statut) => {
    if (statut === "en_cours") return { color: "#43e97b", bg: "rgba(67,233,123,0.15)", border: "rgba(67,233,123,0.3)" };
    if (statut === "termine") return { color: "#4facfe", bg: "rgba(79,172,254,0.15)", border: "rgba(79,172,254,0.3)" };
    return { color: "#f7971e", bg: "rgba(247,151,30,0.15)", border: "rgba(247,151,30,0.3)" };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a" }}>
      <Navbar />
      <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 style={{ color: "white", margin: 0, fontSize: "28px", fontWeight: "700" }}>Mes Projets</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", margin: "4px 0 0", fontSize: "14px" }}>
              {projets.length} projet{projets.length > 1 ? "s" : ""} au total
            </p>
          </div>
          {(user?.role === "etudiant" || user?.role === "administrateur") && (
            <button
              onClick={() => setShowForm(!showForm)}
              style={{ background: "linear-gradient(135deg, #4facfe, #a855f7)", color: "white", border: "none", padding: "12px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "14px", fontWeight: "700", boxShadow: "0 8px 25px rgba(79,172,254,0.3)" }}
            >
              {showForm ? "Annuler" : "+ Nouveau Projet"}
            </button>
          )}
        </div>

        {showForm && (
          <div style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(79,172,254,0.2)", borderRadius: "16px", padding: "24px", marginBottom: "32px", boxShadow: "0 8px 32px rgba(79,172,254,0.1)" }}>
            <h3 style={{ color: "white", marginBottom: "20px", fontSize: "18px" }}>Creer un nouveau projet</h3>
            <form onSubmit={handleCreate}>
              <input
                type="text"
                placeholder="Titre du projet"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
                style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "15px", marginBottom: "12px", boxSizing: "border-box", outline: "none" }}
              />
              <textarea
                placeholder="Description du projet"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "15px", marginBottom: "16px", boxSizing: "border-box", outline: "none", resize: "vertical" }}
              />
              <button
                type="submit"
                style={{ background: "linear-gradient(135deg, #43e97b, #38f9d7)", color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontSize: "15px", fontWeight: "700" }}
              >
                Creer le projet
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.4)" }}>
            <p>Chargement...</p>
          </div>
        ) : projets.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.4)" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>📁</p>
            <p>Aucun projet trouve. Creez votre premier projet !</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
            {projets.map((projet, index) => {
              const statutStyle = getStatutStyle(projet.statut);
              return (
                <div
                  key={projet.id}
                  onClick={() => navigate(`/projets/${projet.id}`)}
                  style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", cursor: "pointer", transition: "all 0.3s ease", animation: `fadeInUp 0.5s ease ${index * 0.1}s both` }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(79,172,254,0.3)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <h3 style={{ margin: 0, color: "white", fontSize: "17px", fontWeight: "700", flex: 1 }}>{projet.titre}</h3>
                    <span style={{ background: statutStyle.bg, color: statutStyle.color, border: `1px solid ${statutStyle.border}`, padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", marginLeft: "12px", whiteSpace: "nowrap" }}>
                      {projet.statut}
                    </span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "20px", lineHeight: "1.5" }}>
                    {projet.description || "Aucune description"}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: "24px", height: "24px", background: "linear-gradient(135deg, #4facfe, #a855f7)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>👤</span>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>{projet.createur_detail?.username}</span>
                    </div>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>📋 {projet.taches?.length || 0} taches</span>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>📦 {projet.livrables?.length || 0} livrables</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projets;