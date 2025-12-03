import Navbar from '../components/Navbar';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

export default function ViewEvents() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/signin'); // redirect after logout
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      <Navbar />

      <div style={{ padding: 40 }}>
        <h1>Welcome to View Events</h1>

        <button
          onClick={handleLogout}
          style={{
            marginTop: '20px',
            padding: '10px 16px',
            borderRadius: '8px',
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Log Out
        </button>
      </div>
    </>
  );
}
