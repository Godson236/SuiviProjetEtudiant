import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Projets = () => {
  const [projets, setProjets] = useState([]);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjets();
  }, []);

  const fetchProjets = async () => {
    try {
      const res = await API.get('/projets/');
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
      await API.post('/projets/', { titre, description });
      setTitre('');
      setDescription('');
      setShowForm(false);
      fetchProjets();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatutColor = (statut) => {
    if (statut === 'en_cours') return '#48bb78';
    if (statut === 'termine') return '#4299e1';
    return '#ed8936';
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>📁 Mes Projets</h1>
          {(user?.role === 'etudiant' || user?.role === 'administrateur') && (
            <button style={styles.btnCreate} onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Annuler' : '+ Nouveau Projet'}
            </button>
          )}
        </div>

        {showForm && (
          <div style={styles.form}>
            <h3>Créer un nouveau projet</h3>
            <form onSubmit={handleCreate}>
              <input
                style={styles.input}
                type="text"
                placeholder="Titre du projet"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
              />
              <textarea
                style={styles.textarea}
                placeholder="Description du projet"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
              <button style={styles.btnSubmit} type="submit">
                Créer le projet
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p>Chargement...</p>
        ) : projets.length === 0 ? (
          <div style={styles.empty}>
            <p>Aucun projet trouvé. Créez votre premier projet !</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {projets.map((projet) => (
              <div
                key={projet.id}
                style={styles.card}
                onClick={() => navigate(`/projets/${projet.id}`)}
              >
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{projet.titre}</h3>
                  <span style={{
                    ...styles.statut,
                    backgroundColor: getStatutColor(projet.statut)
                  }}>
                    {projet.statut}
                  </span>
                </div>
                <p style={styles.cardDesc}>{projet.description || 'Aucune description'}</p>
                <div style={styles.cardFooter}>
                  <span>👤 {projet.createur_detail?.username}</span>
                  <span>📋 {projet.taches?.length} tâches</span>
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
  container: { padding: '24px', maxWidth: '1200px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { color: '#2d3748', margin: 0 },
  btnCreate: { backgroundColor: '#48bb78', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  form: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '24px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box' },
  btnSubmit: { backgroundColor: '#4299e1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '15px' },
  empty: { textAlign: 'center', padding: '40px', color: '#718096' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', cursor: 'pointer', transition: 'transform 0.2s' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  cardTitle: { margin: 0, color: '#2d3748', fontSize: '16px' },
  statut: { padding: '4px 10px', borderRadius: '20px', color: 'white', fontSize: '12px' },
  cardDesc: { color: '#718096', fontSize: '14px', marginBottom: '16px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', color: '#4a5568', fontSize: '13px' },
};

export default Projets;