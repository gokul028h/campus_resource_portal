// Update your FirebaseTest.js with this improved version
import React, { useEffect, useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';

const FirebaseTest = () => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    try {
      setError(null);
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("✅ Login success:", result.user);
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError(err);
      
      // Special handling for popup errors
      if (err.code === 'auth/popup-blocked') {
        alert("Please allow popups for this site and try again.");
      }
    }
  };

  useEffect(() => {
    // Manual trigger instead of auto-running
    console.log("Ready to test - click the button");
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Firebase Test</h2>
      <button 
        onClick={handleLogin}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        Test Google Login
      </button>

      {error && (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <strong>Error:</strong> {error.code} - {error.message}
        </div>
      )}

      {user && (
        <div style={{ marginTop: '20px' }}>
          <p>Logged in as: <strong>{user.email}</strong></p>
        </div>
      )}
    </div>
  );
};

export default FirebaseTest;