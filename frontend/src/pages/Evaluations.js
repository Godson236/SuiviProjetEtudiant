import React, { useState, useEffect } from "react";
import API from "../api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [livrables, setLivrables] = useState([]);
  const [livrableId, setLivrableId] = useState("");
  const [note, setNote] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => { fetchEvaluations(); fetchLivrables(); }, []);

  const fetchEvaluations = async () => {
    try {
      const res = await API.get("/evaluations/");
      setEvaluations(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchLivrables = async () => {
    try {
      const res = await API.get("/livrables/");
      setLivrables(res.data.filter((l) => !l.evaluation));
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/evaluations/", { livrable: livrableId, note: parseFloat(note), commentaire });
      setLivrableId(""); setNote(""); setCommentaire(""); setShowForm(false);
      fetchEvaluations(); fetchLivrables();
    } catch (err) { console.error(err); }
  };

  const getNoteStyle = (note) => {
    if (note >= 16) return { color: "#43e97b", bg: "linear-gradient(135deg, #43e97b, #38f9d7)", label: "Tres bien" };
    if (note >= 14) return { color: "#4facfe", bg: "linear-gradient(135deg, #4facfe, #00f2fe)", label: "Bien" };
    if (note >= 12) return { color: "#a855f7", bg: "linear-gradient(135deg, #a855f7, #4facfe)", label: "Assez bien" };
    if (note >= 10) return { color: "#f7971e", bg: "linear-gradient(135deg, #f7971e, #ffd200)", label: "Passable" };
    return { color: "#f64f59", bg: "linear-gradient(135deg, #f64f59, #c0392b)", label: "Insuffisant" };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a1a" }}>
      <Navbar />
      <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div>
            <h1 style={{ color: "white", margin: 0, fontSize: "28px", fontWeight: "700" }}>Evaluations</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", margin: "4px 0 0", fontSize: "14px" }}>
              {evaluations.length} evaluation{evaluations.length > 1 ? "s" : ""} enregistree{evaluations.length > 1 ? "s" : ""}
            </p>
          </div>
          {(user?.role === "enseignant" || user?.role === "administrateur") && (
            <button
              onClick={() => setShowForm(!showForm)}
              style={{ background: "linear-gradient(135deg, #a855f7, #4facfe)", color: "white", border: "none", padding: "12px 24px", borderRadius: "12px", cursor: "pointer", fontSize: "14px", fontWeight: "700", boxShadow: "0 8px 25px rgba(168,85,247,0.3)" }}
            >
              {showForm ? "Annuler" : "+ Nouvelle evaluation"}
            </button>
          )}
        </div>

        {showForm && (
          <div style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: "16px", padding: "24px", marginBottom: "32px" }}>
            <h3 style={{ color: "white", marginBottom: "20px" }}>Evaluer un livrable</h3>
            <form onSubmit={handleSubmit}>
              <select
                value={livrableId}
                onChange={(e) => setLivrableId(e.target.value)}
                required
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box", outline: "none" }}
              >
                <option value="">-- Choisir un livrable --</option>
                {livrables.map((l) => (
                  <option key={l.id} value={l.id}>{l.titre} — {l.soumis_par_detail?.username}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Note (sur 20)"
                min="0" max="20" step="0.5"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", marginBottom: "12px", boxSizing: "border-box", outline: "none" }}
              />
              <textarea
                placeholder="Commentaire"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "14px", marginBottom: "16px", boxSizing: "border-box", outline: "none", resize: "vertical" }}
              />
              <button
                type="submit"
                style={{ background: "linear-gradient(135deg, #a855f7, #4facfe)", color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontSize: "15px", fontWeight: "700" }}
              >
                Enregistrer l evaluation
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "60px" }}>Chargement...</p>
        ) : evaluations.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.4)" }}>
            <p style={{ fontSize: "48px", marginBottom: "16px" }}>⭐</p>
            <p>Aucune evaluation enregistree.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {evaluations.map((evaluation) => {
              const nStyle = getNoteStyle(evaluation.note);
              return (
                <div key={evaluation.id} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px", color: "white", fontSize: "16px", fontWeight: "700" }}>
                        Livrable #{evaluation.livrable}
                      </h3>
                      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px" }}>
                        Par {evaluation.enseignant_detail?.username}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
                      <span style={{ background: nStyle.bg, color: "white", padding: "6px 16px", borderRadius: "20px", fontSize: "16px", fontWeight: "800" }}>
                        {evaluation.note}/20
                      </span>
                      <span style={{ color: nStyle.color, fontSize: "12px", fontWeight: "600" }}>{nStyle.label}</span>
                    </div>
                  </div>
                  {evaluation.commentaire && (
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "12px 16px", marginBottom: "12px" }}>
                      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", margin: 0, fontStyle: "italic" }}>
                        "{evaluation.commentaire}"
                      </p>
                    </div>
                  )}
                  <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", margin: 0 }}>
                    {new Date(evaluation.date_evaluation).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Evaluations;