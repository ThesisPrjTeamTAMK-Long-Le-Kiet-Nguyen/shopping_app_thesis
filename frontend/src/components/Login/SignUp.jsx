import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import signupService from '../../services/signupService'; // Import the signup service

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      await signupService.signup({ username, email, password, confirmPassword }); // Use the signup service
      alert('Registration successful! You can now log in.');
      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input type="text" id="username" name="username" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input type="email" id="email" name="email" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          value={email} onChange={e => setEmail(e.target.value)}/>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
          <input type="password" id="password" name="password" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
           value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="confirm-password" style={{ display: 'block', marginBottom: '5px' }}>Confirm Password:</label>
          <input type="password" id="confirm-password" name="confirm-password" style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
           value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
        </div>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Sign Up
        </button>
      </form>
    </div>
  )
}

export default SignUp