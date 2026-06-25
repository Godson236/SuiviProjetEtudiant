import React, { useState, useEffect } from 'react';
import API from '../api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Livrables = () => {
  const [livrables, setLivrables] = useState([]);
  const [projets, setProjets] = useState([]);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [fichierUrl, setFichierUrl] = useState('');
  const [projetId, setProjetId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLivrables();
    fetchProjets();
  }, []);

  const fetchLivrables = async () => {
    try {
      const res = await API.get('/livrables/');
      setLivrables(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjets = async () => {
    try {
      const res = await API.get('/projets/');
      setProjets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/livrables/', {
        titre,
        description,
        fichier_url: fichierUrl,
        projet: projetId,
      });
      setTitre('');
      setDescription('');
      setFichierUrl('');
      setProjetId('');
      setShowForm(false);
      fetchLivrables();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Livrables</h1>
          {(user?.role === 'etudiant' || user?.role === 'administrateur') && (
            <button style={styles.btnCreate} onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Annuler' : '+ Soumettre un livrable'}
            </button>
          )}
        </div>

        {showForm && (
          <div style={styles.form}>
            <h3>Soumettre un livrable</h3>
            <form onSubmit={handleSubmit}>
              <select
                style={styles.input}
                value={projetId}
                onChange={(e) => setProjetId(e.target.value)}
                required
              >
                <option value="">-- Choisir un projet --</option>
                {projets.map((p) => (
                  <option key={p.id} value={p.id}>{p.titre}</option>
                ))}
              </select>
              <input
                style={styles.input}
                type="text"
                placeholder="Titre du livrable"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
              />
              <textarea
                style={styles.textarea}
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
              <input
                style={styles.input}
                type="url"
                placeholder="Lien du fichier (Google Drive, GitHub...)"
                value={fichierUrl}
                onChange={(e) => setFichierUrl(e.target.value)}
              />
              <button style={styles.btnSubmit} type="submit">
                Soumettre
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <p>Chargement...</p>
        ) : livrables.length === 0 ? (
          <div style={styles.empty}>
            <p>Aucun livrable soumis.</p>
          </div>
        ) : (
          <div style={styles.list}>
            {livrables.map((livrable) => (
              <div key={livrable.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{livrable.titre}</h3>
                  {livrable.evaluation ? (
                    <span style={styles.note}>
                      {livrable.evaluation.note}/20
                    </span>
                  ) : (
                    <span style={styles.enAttente}>En attente</span>
                  )}
                </div>
                <p style={styles.cardDesc}>{livrable.description}</p>
                <div style={styles.cardFooter}>
                  <span>{livrable.soumis_par_detail?.username}</span>
                  {livrable.fichier_url && (                   
                      <a href={livrable.fichier_url}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.link}
                    >
                      Voir le fichier
                    </a>
                  )}
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
  btnCreate: { backgroundColor: '#48bb78', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  form: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '24px' },
  input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '15px', marginBottom: '12px', boxSizing: 'border-box' },
  btnSubmit: { backgroundColor: '#4299e1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '15px' },
  empty: { textAlign: 'center', padding: '40px', color: '#718096' },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  cardTitle: { margin: 0, color: '#2d3748' },
  note: { backgroundColor: '#48bb78', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' },
  enAttente: { backgroundColor: '#ed8936', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '14px' },
  cardDesc: { color: '#718096', fontSize: '14px', marginBottom: '12px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#4a5568' },
  link: { color: '#4299e1', textDecoration: 'none' },
};

export default Livrables;