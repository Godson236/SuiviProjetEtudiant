import React, { useState, useEffect } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Evaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [livrables, setLivrables] = useState([]);
  const [livrableId, setLivrableId] = useState('');
  const [note, setNote] = useState('');
  const [commentaire, setCommentaire] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvaluations();
    fetchLivrables();
  }, []);

  const fetchEvaluations = async () => {
    try {
      const res = await API.get('/evaluations/');
      setEvaluations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLivrables = async () => {
    try {
      const res = await API.get('/livrables/');
      setLivrables(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/evaluations/', {
        livrable: livrableId,
        note: parseFloat(note),
        commentaire,
      });
      setLivrableId('');
      setNote('');
      setCommentaire('');
      setShowForm(false);
      fetchEvaluations();
    } catch (err) {
      console.error(err);
    }
  };

  const getNoteColor = (note) => {
    if (note >= 16) return '#48bb78';
    if (note >= 12) return '#4299e1';
    if (note >= 10) return '#ed8936';
    return '#e53e3e';
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>⭐ Évaluations</h1>
          {(user?.role === 'enseignant' || user?.role === 'administrateur') && (
            <button style={styles.btnCreate} onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Annuler' : '+ Nouvelle évaluation'}
            </button>
          )}
        </div>

        {showForm && (
          <div style={styles.form}>
            <h3>Évaluer un livrable</h3>
            <form onSubmit={handleSubmit}>
              <select
                style={styles.input}
                value={livrableId}
                onChange={(e) => setLivrableId(e.target.value)}
                required
              >
                <option value="">-- Choisir un livrable --</option>
                {livrables.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.titre} — {l.soumis_par_detail?.username}
                  </option>
                ))}
              </select>
              <input
                style={styles.input}
                type="number"
                placeholder="Note (sur 20)"
                min="0"
                max="20"
                step="0.5"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
              />
              <textarea
                style={styles.textarea}
                placeholder="Commentaire"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
                rows={3}
              />
              <button style={styles.btnSubmit} type="submit">
                Enregistrer l'évaluation
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p>Chargement...</p>
        ) : evaluations.length === 0 ? (
          <div style={styles.empty}>
            <p>Aucune évaluation enregistrée.</p>
          </div>
        ) : (
          <div style={styles.list}>
            {evaluations.map((evaluation) => (
              <div key={evaluation.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>
                    📄 Livrable #{evaluation.livrable}
                  </h3>
                  <span style={{
                    ...styles.note,
                    backgroundColor: getNoteColor(evaluation.note)
                  }}>
                    {evaluation.note}/20
                  </span>
                </div>
                <p style={styles.commentaire}>
                  💬 {evaluation.commentaire || 'Aucun commentaire'}
                </p>
                <div style={styles.cardFooter}>
                  <span>👨‍🏫 {evaluation.enseignant_detail?.username}</span>
                  <span>📅 {new Date(evaluation.date_evaluation).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { color: '#2d3748', margin: 0 },
  btnCreate: { backgroundColor: '#805ad5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  form: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '24px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box' },
  btnSubmit: { backgroundColor: '#805ad5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '15px' },
  empty: { textAlign: 'center', padding: '40px', color: '#718096' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  cardTitle: { margin: 0, color: '#2d3748' },
  note: { color: 'white', padding: '4px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '16px' },
  commentaire: { color: '#718096', fontSize: '14px', marginBottom: '12px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4a5568' },
};

export default Evaluations;