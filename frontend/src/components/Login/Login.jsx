import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import loginService from '../../services/loginService'; // Import the login service

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginService.login({ email, password }); // Use the login service
      localStorage.setItem('token', data.token);
      navigate('/'); // Redirect to home or another page
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input type="email" id="email" name="email" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input type="password" id="password" name="password" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Log In
        </button>
      </form>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p>Don&apos;t have an account?</p>
        <Link to="/signup" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;