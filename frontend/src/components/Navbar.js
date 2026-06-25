import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        🎓 SuiviProjetEtudiant
      </div>
      <div style={styles.links}>
        {user?.role === 'etudiant' && (
          <>
            <Link style={styles.link} to="/projets">Mes Projets</Link>
            <Link style={styles.link} to="/livrables">Livrables</Link>
          </>
        )}
        {user?.role === 'enseignant' && (
          <>
            <Link style={styles.link} to="/projets">Projets</Link>
            <Link style={styles.link} to="/evaluations">Évaluations</Link>
          </>
        )}
        {user?.role === 'administrateur' && (
          <>
            <Link style={styles.link} to="/projets">Projets</Link>
            <Link style={styles.link} to="/livrables">Livrables</Link>
            <Link style={styles.link} to="/evaluations">Évaluations</Link>
          </>
        )}
      </div>
      <div style={styles.user}>
        <span style={styles.username}>
          👤 {user?.username} ({user?.role})
        </span>
        <button style={styles.logout} onClick={logout}>
          Déconnexion
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2b6cb0',
    padding: '12px 24px',
    color: 'white',
  },
  brand: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '500',
  },
  user: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  username: {
    fontSize: '14px',
  },
  logout: {
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Navbar;