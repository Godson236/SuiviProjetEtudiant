import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/statistiques/')
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>Tableau de bord</h1>
        <p style={styles.welcome}>Bonjour {user?.first_name || user?.username} !</p>

        {stats && (
          <div style={styles.grid}>
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} style={styles.card}>
                <div style={styles.value}>{value}</div>
                <div style={styles.label}>{key.replace(/_/g, ' ')}</div>
              </div>
            ))}
          </div>
        )}

        <div style={styles.actions}>
          <button style={styles.btn} onClick={() => navigate('/projets')}>
            Voir mes projets
          </button>
          {(user?.role === 'enseignant' || user?.role === 'administrateur') && (
            <button style={styles.btnPurple} onClick={() => navigate('/evaluations')}>
              Voir les evaluations
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '24px', maxWidth: '900px', margin: '0 auto' },
  title: { color: '#2d3748', marginBottom: '8px' },
  welcome: { color: '#718096', marginBottom: '32px', fontSize: '18px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' },
  card: { backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' },
  value: { fontSize: '36px', fontWeight: 'bold', color: '#4299e1', marginBottom: '8px' },
  label: { color: '#718096', fontSize: '14px', textTransform: 'capitalize' },
  actions: { display: 'flex', gap: '16px' },
  btn: { backgroundColor: '#4299e1', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
  btnPurple: { backgroundColor: '#805ad5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' },
};

export default Dashboard;