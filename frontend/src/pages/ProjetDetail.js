import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const ProjetDetail = () => {
  const { id } = useParams();
  const [projet, setProjet] = useState(null);
  const [titreTache, setTitreTache] = useState('');
  const [descTache, setDescTache] = useState('');
  const [priorite, setPriorite] = useState('moyenne');
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchProjet();
  }, [id]);

  const fetchProjet = async () => {
    try {
      const res = await API.get(`/projets/${id}/`);
      setProjet(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTache = async (e) => {
    e.preventDefault();
    try {
      await API.post('/taches/', {
        titre: titreTache,
        description: descTache,
        priorite,
        projet: id,
      });
      setTitreTache('');
      setDescTache('');
      setShowForm(false);
      fetchProjet();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatutTache = async (tacheId, statut) => {
    try {
      await API.patch(`/taches/${tacheId}/`, { statut });
      fetchProjet();
    } catch (err) {
      console.error(err);
    }
  };

  const getPrioriteColor = (p) => {
    if (p === 'haute') return '#e53e3e';
    if (p === 'moyenne') return '#ed8936';
    return '#48bb78';
  };

  const getStatutColor = (s) => {
    if (s === 'terminee') return '#48bb78';
    if (s === 'en_cours') return '#4299e1';
    return '#a0aec0';
  };

  if (!projet) return <div><Navbar /><p style={{padding:'24px'}}>Chargement...</p></div>;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>📁 {projet.titre}</h1>
        <p style={styles.desc}>{projet.description}</p>

        <div style={styles.info}>
          <span>👤 Créateur : <strong>{projet.createur_detail?.username}</strong></span>
          <span>📌 Statut : <strong>{projet.statut}</strong></span>
          <span>👥 Membres : <strong>{projet.membres_detail?.length}</strong></span>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2>📋 Tâches ({projet.taches?.length})</h2>
            {(user?.role === 'etudiant' || user?.role === 'administrateur') && (
              <button style={styles.btnCreate} onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Annuler' : '+ Ajouter une tâche'}
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleCreateTache} style={styles.form}>
              <input
                style={styles.input}
                placeholder="Titre de la tâche"
                value={titreTache}
                onChange={(e) => setTitreTache(e.target.value)}
                required
              />
              <textarea
                style={styles.textarea}
                placeholder="Description"
                value={descTache}
                onChange={(e) => setDescTache(e.target.value)}
                rows={2}
              />
              <select
                style={styles.input}
                value={priorite}
                onChange={(e) => setPriorite(e.target.value)}
              >
                <option value="basse">Basse</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
              </select>
              <button style={styles.btnSubmit} type="submit">Créer</button>
            </form>
          )}

          {projet.taches?.length === 0 ? (
            <p style={styles.empty}>Aucune tâche pour ce projet.</p>
          ) : (
            projet.taches?.map((tache) => (
              <div key={tache.id} style={styles.tacheCard}>
                <div style={styles.tacheHeader}>
                  <h4 style={styles.tacheTitre}>{tache.titre}</h4>
                  <div style={styles.badges}>
                    <span style={{ ...styles.badge, backgroundColor: getPrioriteColor(tache.priorite) }}>
                      {tache.priorite}
                    </span>
                    <span style={{ ...styles.badge, backgroundColor: getStatutColor(tache.statut) }}>
                      {tache.statut}
                    </span>
                  </div>
                </div>
                <p style={styles.tacheDesc}>{tache.description}</p>
                {(user?.role === 'etudiant' || user?.role === 'administrateur') && (
                  <select
                    style={styles.select}
                    value={tache.statut}
                    onChange={(e) => handleStatutTache(tache.id, e.target.value)}
                  >
                    <option value="a_faire">À faire</option>
                    <option value="en_cours">En cours</option>
                    <option value="terminee">Terminée</option>
                  </select>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  title: { color: '#2d3748', marginBottom: '8px' },
  desc: { color: '#718096', marginBottom: '16px' },
  info: { display: 'flex', gap: '24px', backgroundColor: 'white', padding: '16px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
  section: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  btnCreate: { backgroundColor: '#48bb78', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
  form: { backgroundColor: '#f7fafc', padding: '16px', borderRadius: '8px', marginBottom: '16px' },
  input: { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '8px', boxSizing: 'border-box', fontSize: '14px' },
  textarea: { width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '8px', boxSizing: 'border-box', fontSize: '14px' },
  btnSubmit: { backgroundColor: '#4299e1', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' },
  empty: { color: '#a0aec0', textAlign: 'center', padding: '20px' },
  tacheCard: { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '12px' },
  tacheHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  tacheTitre: { margin: 0, color: '#2d3748' },
  badges: { display: 'flex', gap: '8px' },
  badge: { padding: '2px 8px', borderRadius: '12px', color: 'white', fontSize: '12px' },
  tacheDesc: { color: '#718096', fontSize: '14px', marginBottom: '8px' },
  select: { padding: '6px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' },
};

export default ProjetDetail;