import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        color: ['#4facfe', '#a855f7', '#00f2fe', '#43e97b'][Math.floor(Math.random() * 4)],
        opacity: Math.random() * 0.6 + 0.2,
      });
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(79, 172, 254, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      drawConnections();
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none'
    }} />
  );
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(username, password);
      if (user.role === 'enseignant') navigate('/evaluations');
      else navigate('/projets');
    } catch (err) {
      setError('Identifiants incorrects. Veuillez reessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <ParticleBackground />

      <div style={styles.bgGlow1} />
      <div style={styles.bgGlow2} />
      <div style={styles.bgGlow3} />

      <div style={styles.container}>
        <div style={styles.card} className="animate-fadeInUp">

          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>
              <span style={{ fontSize: '32px' }}>🎓</span>
            </div>
            <h1 style={styles.title}>SuiviProjet</h1>
            <p style={styles.subtitle}>Plateforme de gestion academique</p>
          </div>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Nom utilisateur</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>👤</span>
                <input
                  style={{
                    ...styles.input,
                    borderColor: focused === 'username' ? '#4facfe' : 'rgba(255,255,255,0.1)',
                    boxShadow: focused === 'username' ? '0 0 20px rgba(79,172,254,0.2)' : 'none',
                  }}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused('')}
                  placeholder="ex: etudiant1"
                  required
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Mot de passe</label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  style={{
                    ...styles.input,
                    borderColor: focused === 'password' ? '#4facfe' : 'rgba(255,255,255,0.1)',
                    boxShadow: focused === 'password' ? '0 0 20px rgba(79,172,254,0.2)' : 'none',
                  }}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              transform: loading ? 'scale(0.98)' : 'scale(1)',
            }} type="submit" disabled={loading}>
              {loading ? (
                <span>Connexion en cours...</span>
              ) : (
                <span>Se connecter →</span>
              )}
            </button>
          </form>

          <div style={styles.demoBox}>
            <p style={styles.demoTitle}>Comptes de demonstration</p>
            <div style={styles.demoGrid}>
              <div style={styles.demoItem} onClick={() => { setUsername('etudiant1'); setPassword('demo1234'); }}>
                <span style={styles.demoRole}>Etudiant</span>
                <span style={styles.demoInfo}>etudiant1</span>
              </div>
              <div style={styles.demoItem} onClick={() => { setUsername('enseignant1'); setPassword('demo1234'); }}>
                <span style={styles.demoRole}>Enseignant</span>
                <span style={styles.demoInfo}>enseignant1</span>
              </div>
              <div style={styles.demoItem} onClick={() => { setUsername('admin'); setPassword('admin1234'); }}>
                <span style={styles.demoRole}>Admin</span>
                <span style={styles.demoInfo}>admin</span>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '8px' }}>
              Cliquez sur un compte pour le selectionner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #0d1117 50%, #0a0a2e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bgGlow1: {
    position: 'fixed', top: '-20%', left: '-10%',
    width: '600px', height: '600px',
    background: 'radial-gradient(circle, rgba(79,172,254,0.08) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
  },
  bgGlow2: {
    position: 'fixed', bottom: '-20%', right: '-10%',
    width: '700px', height: '700px',
    background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
  },
  bgGlow3: {
    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '400px', height: '400px',
    background: 'radial-gradient(circle, rgba(0,242,254,0.04) 0%, transparent 70%)',
    borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
  },
  container: {
    position: 'relative', zIndex: 10,
    width: '100%', maxWidth: '440px', padding: '20px',
  },
  card: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(30px)',
    WebkitBackdropFilter: 'blur(30px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
  },
  logoArea: { textAlign: 'center', marginBottom: '32px' },
  logoIcon: {
    width: '70px', height: '70px',
    background: 'linear-gradient(135deg, rgba(79,172,254,0.2), rgba(168,85,247,0.2))',
    border: '1px solid rgba(79,172,254,0.3)',
    borderRadius: '20px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 16px',
    boxShadow: '0 8px 32px rgba(79,172,254,0.2)',
  },
  title: {
    fontSize: '28px', fontWeight: '700', color: 'white',
    background: 'linear-gradient(135deg, #4facfe, #a855f7)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    marginBottom: '6px',
  },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: '14px' },
  errorBox: {
    background: 'rgba(246,79,89,0.15)',
    border: '1px solid rgba(246,79,89,0.3)',
    borderRadius: '10px', padding: '12px 16px',
    color: '#f64f59', fontSize: '14px', marginBottom: '20px',
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' },
  inputWrapper: { position: 'relative' },
  inputIcon: { position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', zIndex: 1 },
  input: {
    width: '100%', padding: '13px 16px 13px 44px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px', color: 'white', fontSize: '15px',
    outline: 'none', transition: 'all 0.3s ease', boxSizing: 'border-box',
  },
  button: {
    padding: '14px',
    background: 'linear-gradient(135deg, #4facfe, #a855f7)',
    border: 'none', borderRadius: '12px',
    color: 'white', fontSize: '16px', fontWeight: '700',
    cursor: 'pointer', transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(79,172,254,0.3)',
    marginTop: '8px',
  },
  demoBox: {
    marginTop: '28px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '14px', padding: '16px',
  },
  demoTitle: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' },
  demoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' },
  demoItem: {
    background: 'rgba(79,172,254,0.08)', border: '1px solid rgba(79,172,254,0.15)',
    borderRadius: '10px', padding: '10px 8px', textAlign: 'center',
    cursor: 'pointer', transition: 'all 0.3s ease',
    display: 'flex', flexDirection: 'column', gap: '4px',
  },
  demoRole: { color: '#4facfe', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' },
  demoInfo: { color: 'rgba(255,255,255,0.6)', fontSize: '12px' },
};

export default Login;