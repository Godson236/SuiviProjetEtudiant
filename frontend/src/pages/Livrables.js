import React, { useState, useEffect } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const getAppreciation = (note) => {
  if (note >= 16) return { text: "Tres bien", color: "#43e97b" };
  if (note >= 14) return { text: "Bien", color: "#4facfe" };
  if (note >= 12) return { text: "Assez bien", color: "#a855f7" };
  if (note >= 10) return { text: "Passable", color: "#f7971e" };
  return { text: "Insuffisant", color: "#f64f59" };
};

const Livrables = () => {
  const [livrables, setLivrables] = useState([]);
  const [projets, setProjets] = useState([]);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [fichierUrl, setFichierUrl] = useState("");
  const [projetId, setProjetId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLivrables();
    fetchProjets();
  }, []);

  const fetchLivrables = async () => {
    try {
      const res = await API.get("/livrables/");
      setLivrables(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjets = async () => {
    try {
      const res = await API.get("/projets/");
      setProjets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/livrables/", {
        titre,
        description,
        fichier_url: fichierUrl,
        projet: projetId,
      });
      setTitre("");
      setDescription("");
      setFichierUrl("");
      setProjetId("");
      setShowForm(false);
      fetchLivrables();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a" }}>
      <Navbar />
      <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h1 style={{ color: "white", margin: 0, fontSize: "28px" }}>Livrables</h1>
          {user && (user.role === "etudiant" || user.role === "administrateur") && (
            <button
              onClick={() => setShowForm(!showForm)}
              style={{ background: "linear-gradient(135deg, #43e97b, #38f9d7)", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "600" }}
            >
              {showForm ? "Annuler" : "+ Soumettre un livrable"}
            </button>
          )}
        </div>

        {showForm && (
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
            <h3 style={{ color: "white", marginBottom: "16px" }}>Soumettre un livrable</h3>
            <form onSubmit={handleSubmit}>
              <select
                value={projetId}
                onChange={(e) => setProjetId(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" }}
              >
                <option value="">-- Choisir un projet --</option>
                {projets.map((p) => (
                  <option key={p.id} value={p.id}>{p.titre}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Titre du livrable"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" }}
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" }}
              />
              <input
                type="url"
                placeholder="Lien du fichier"
                value={fichierUrl}
                onChange={(e) => setFichierUrl(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box" }}
              />
              <button
                type="submit"
                style={{ background: "linear-gradient(135deg, #4facfe, #00f2fe)", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
              >
                Soumettre
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "40px" }}>Chargement...</p>
        ) : livrables.length === 0 ? (
          <p style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", padding: "40px" }}>Aucun livrable soumis.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {livrables.map((livrable) => {
              const appr = livrable.evaluation ? getAppreciation(livrable.evaluation.note) : null;
              return (
                <div key={livrable.id} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div>
                      <h3 style={{ margin: 0, color: "white", fontSize: "16px", fontWeight: "600" }}>{livrable.titre}</h3>
                      {livrable.description && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "4px" }}>{livrable.description}</p>}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", minWidth: "130px" }}>
                      {livrable.evaluation ? (
                        <>
                          <span style={{ background: appr.color, color: "white", padding: "4px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: "700" }}>
                            {livrable.evaluation.note}/20
                          </span>
                          <span style={{ fontSize: "12px", color: appr.color, fontWeight: "600" }}>{appr.text}</span>
                          {livrable.evaluation.commentaire && (
                            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontStyle: "italic", textAlign: "right" }}>
                              "{livrable.evaluation.commentaire}"
                            </span>
                          )}
                        </>
                      ) : (
                        <span style={{ background: "rgba(247,151,30,0.2)", color: "#f7971e", border: "1px solid rgba(247,151,30,0.3)", padding: "4px 12px", borderRadius: "20px", fontSize: "13px" }}>
                          En attente
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                      Par {livrable.soumis_par_detail && livrable.soumis_par_detail.username}
                    </span>
                    {livrable.fichier_url && (
                      <a href={livrable.fichier_url} target="_blank" rel="noreferrer" style={{ color: "#4facfe", textDecoration: "none", fontSize: "13px" }}>
                        Voir le fichier
                      </a>
                    )}
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

export default Livrables;