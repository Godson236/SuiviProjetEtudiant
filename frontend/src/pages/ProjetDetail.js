import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const ProjetDetail = () => {
  const { id } = useParams();
  const [projet, setProjet] = useState(null);
  const [titreTache, setTitreTache] = useState("");
  const [descTache, setDescTache] = useState("");
  const [priorite, setPriorite] = useState("moyenne");
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchProjet(); }, [id]);

  const fetchProjet = async () => {
    try {
      const res = await API.get(`/projets/${id}/`);
      setProjet(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreateTache = async (e) => {
    e.preventDefault();
    try {
      await API.post("/taches/", { titre: titreTache, description: descTache, priorite, projet: id });
      setTitreTache(""); setDescTache(""); setShowForm(false);
      fetchProjet();
    } catch (err) { console.error(err); }
  };

  const handleStatutTache = async (tacheId, statut) => {
    try {
      await API.patch(`/taches/${tacheId}/`, { statut });
      fetchProjet();
    } catch (err) { console.error(err); }
  };

  const getPrioriteStyle = (p) => {
    if (p === "haute") return { color: "#f64f59", bg: "rgba(246,79,89,0.15)", border: "rgba(246,79,89,0.3)" };
    if (p === "moyenne") return { color: "#f7971e", bg: "rgba(247,151,30,0.15)", border: "rgba(247,151,30,0.3)" };
    return { color: "#43e97b", bg: "rgba(67,233,123,0.15)", border: "rgba(67,233,123,0.3)" };
  };

  const getStatutStyle = (s) => {
    if (s === "terminee") return { color: "#43e97b", bg: "rgba(67,233,123,0.15)" };
    if (s === "en_cours") return { color: "#4facfe", bg: "rgba(79,172,254,0.15)" };
    return { color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.05)" };
  };

  if (!projet) return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a" }}>
      <Navbar />
      <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "60px" }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a" }}>
      <Navbar />
      <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>

        <button
          onClick={() => navigate("/projets")}
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", marginBottom: "24px", fontSize: "13px" }}
        >
          Retour aux projets
        </button>

        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px", marginBottom: "24px" }}>
          <h1 style={{ color: "white", margin: "0 0 8px", fontSize: "26px", fontWeight: "700" }}>{projet.titre}</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>{projet.description}</p>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <div style={{ background: "rgba(79,172,254,0.1)", border: "1px solid rgba(79,172,254,0.2)", borderRadius: "10px", padding: "12px 20px", textAlign: "center" }}>
              <p style={{ color: "#4facfe", fontSize: "20px", fontWeight: "700", margin: 0 }}>{projet.taches?.length || 0}</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", margin: "4px 0 0" }}>Taches</p>
            </div>
            <div style={{ background: "rgba(67,233,123,0.1)", border: "1px solid rgba(67,233,123,0.2)", borderRadius: "10px", padding: "12px 20px", textAlign: "center" }}>
              <p style={{ color: "#43e97b", fontSize: "20px", fontWeight: "700", margin: 0 }}>{projet.membres_detail?.length || 0}</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", margin: "4px 0 0" }}>Membres</p>
            </div>
            <div style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: "10px", padding: "12px 20px", textAlign: "center" }}>
              <p style={{ color: "#a855f7", fontSize: "20px", fontWeight: "700", margin: 0 }}>{projet.livrables?.length || 0}</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", margin: "4px 0 0" }}>Livrables</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "12px 20px", textAlign: "center" }}>
              <p style={{ color: "white", fontSize: "13px", fontWeight: "700", margin: 0 }}>{projet.statut}</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", margin: "4px 0 0" }}>Statut</p>
            </div>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ color: "white", margin: 0, fontSize: "18px", fontWeight: "700" }}>
              Taches ({projet.taches?.length || 0})
            </h2>
            {(user?.role === "etudiant" || user?.role === "administrateur") && (
              <button
                onClick={() => setShowForm(!showForm)}
                style={{ background: "linear-gradient(135deg, #43e97b, #38f9d7)", color: "white", border: "none", padding: "8px 18px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontWeight: "700" }}
              >
                {showForm ? "Annuler" : "+ Ajouter une tache"}
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleCreateTache} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
              <input
                placeholder="Titre de la tache"
                value={titreTache}
                onChange={(e) => setTitreTache(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", marginBottom: "10px", boxSizing: "border-box", outline: "none" }}
              />
              <textarea
                placeholder="Description"
                value={descTache}
                onChange={(e) => setDescTache(e.target.value)}
                rows={2}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", marginBottom: "10px", boxSizing: "border-box", outline: "none" }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <select
                  value={priorite}
                  onChange={(e) => setPriorite(e.target.value)}
                  style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", outline: "none" }}
                >
                  <option value="basse">Basse</option>
                  <option value="moyenne">Moyenne</option>
                  <option value="haute">Haute</option>
                </select>
                <button
                  type="submit"
                  style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}
                >
                  Creer
                </button>
              </div>
            </form>
          )}

          {projet.taches?.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "30px" }}>Aucune tache pour ce projet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {projet.taches?.map((tache) => {
                const pStyle = getPrioriteStyle(tache.priorite);
                const sStyle = getStatutStyle(tache.statut);
                return (
                  <div key={tache.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <h4 style={{ margin: 0, color: "white", fontSize: "15px" }}>{tache.titre}</h4>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ background: pStyle.bg, color: pStyle.color, border: `1px solid ${pStyle.border}`, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" }}>
                          {tache.priorite}
                        </span>
                        <span style={{ background: sStyle.bg, color: sStyle.color, padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600" }}>
                          {tache.statut}
                        </span>
                      </div>
                    </div>
                    {tache.description && <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "10px" }}>{tache.description}</p>}
                    {(user?.role === "etudiant" || user?.role === "administrateur") && (
                      <select
                        value={tache.statut}
                        onChange={(e) => handleStatutTache(tache.id, e.target.value)}
                        style={{ padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "13px", outline: "none" }}
                      >
                        <option value="a_faire">A faire</option>
                        <option value="en_cours">En cours</option>
                        <option value="terminee">Terminee</option>
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjetDetail;