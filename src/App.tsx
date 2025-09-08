import { useState, useEffect } from 'react';
import VideoBackground from './components/VideoBackground';
import OwnerSignIn from './components/OwnerSignIn';
import OwnerSignUp from './components/OwnerSignUp';
import OwnerWelcome from './components/OwnerWelcome';
import './App.css';

interface Owner {
  id: string;
  name: string;
  email: string;
  businessName: string;
}

type AuthMode = 'signin' | 'signup' | 'welcome';

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);

  // Check for existing authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('ownerToken');
    const ownerData = localStorage.getItem('ownerData');
    
    if (token && ownerData) {
      try {
        const parsedOwner = JSON.parse(ownerData);
        setOwner(parsedOwner);
        setAuthMode('welcome');
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('ownerToken');
        localStorage.removeItem('ownerData');
      }
    }
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/owner/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('ownerToken', data.token);
        localStorage.setItem('ownerData', JSON.stringify(data.owner));
        setOwner(data.owner);
        setAuthMode('welcome');
      } else {
        setError(data.message || 'Sign in failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string, businessName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/owner/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, businessName }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('ownerToken', data.token);
        localStorage.setItem('ownerData', JSON.stringify(data.owner));
        setOwner(data.owner);
        setAuthMode('welcome');
      } else {
        setError(data.message || 'Sign up failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('ownerToken');
    localStorage.removeItem('ownerData');
    setOwner(null);
    setAuthMode('signin');
    setError(null);
  };

  const switchToSignUp = () => {
    setAuthMode('signup');
    setError(null);
  };

  const switchToSignIn = () => {
    setAuthMode('signin');
    setError(null);
  };

  return (
    <div className="App">
      <VideoBackground />
      
      {authMode === 'signin' && (
        <OwnerSignIn
          onSignIn={handleSignIn}
          onSwitchToSignUp={switchToSignUp}
          isLoading={isLoading}
          error={error}
        />
      )}
      
      {authMode === 'signup' && (
        <OwnerSignUp
          onSignUp={handleSignUp}
          onSwitchToSignIn={switchToSignIn}
          isLoading={isLoading}
          error={error}
        />
      )}
      
      {authMode === 'welcome' && owner && (
        <OwnerWelcome
          ownerName={owner.name}
          businessName={owner.businessName}
          onSignOut={handleSignOut}
        />
      )}
    </div>
  );
}

export default App;