import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import VideoBackground from './components/VideoBackground';
import OwnerSignIn from './components/OwnerSignIn';
import OwnerSignUp from './components/OwnerSignUp';
import Dashboard from './components/Dashboard';
import AddFirstGym from './components/AddFirstGym';
import './App.css';

interface Owner {
  id: string;
  name: string;
  email: string;
  businessName: string;
}

interface Gym {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  capacity: number;
  description: string;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('ownerToken');
    const ownerData = localStorage.getItem('ownerData');
    const gymsData = localStorage.getItem('gymsData');
    
    if (token && ownerData) {
      try {
        const parsedOwner = JSON.parse(ownerData);
        const parsedGyms = gymsData ? JSON.parse(gymsData) : [];
        
        // Validate token by making a test API call
        fetch('http://localhost:8080/api/owner/auth/test', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(response => {
          if (response.ok) {
            setOwner(parsedOwner);
            setGyms(parsedGyms);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('ownerToken');
            localStorage.removeItem('ownerData');
            localStorage.removeItem('gymsData');
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          // Network error or invalid token
          localStorage.removeItem('ownerToken');
          localStorage.removeItem('ownerData');
          localStorage.removeItem('gymsData');
          setIsAuthenticated(false);
        });
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('ownerToken');
        localStorage.removeItem('ownerData');
        localStorage.removeItem('gymsData');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
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
      console.log('Login response:', data);

      if (response.ok) {
        console.log('Storing token:', data.token);
        localStorage.setItem('ownerToken', data.token);
        localStorage.setItem('ownerData', JSON.stringify(data.owner));
        localStorage.setItem('gymsData', JSON.stringify(data.gyms || []));
        setOwner(data.owner);
        setGyms(data.gyms || []);
        setIsAuthenticated(true);
        console.log('Authentication successful, token stored');
      } else {
        setError(data.message || 'Sign in failed');
      }
    } catch (error) {
      console.error('Login error:', error);
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
        localStorage.setItem('gymsData', JSON.stringify(data.gyms || []));
        setOwner(data.owner);
        setGyms(data.gyms || []);
        setIsAuthenticated(true);
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
    localStorage.removeItem('gymsData');
    setOwner(null);
    setGyms([]);
    setIsAuthenticated(false);
    setError(null);
  };

  const handleGymAdded = (gymData: any) => {
    const newGym = { ...gymData, id: Date.now().toString() };
    const updatedGyms = [...gyms, newGym];
    setGyms(updatedGyms);
    localStorage.setItem('gymsData', JSON.stringify(updatedGyms));
  };

  return (
    <ThemeProvider>
      <Router>
        <AppContent
          isAuthenticated={isAuthenticated}
          owner={owner}
          gyms={gyms}
          isLoading={isLoading}
          error={error}
          onSignIn={handleSignIn}
          onSignUp={handleSignUp}
          onSignOut={handleSignOut}
          onGymAdded={handleGymAdded}
        />
      </Router>
    </ThemeProvider>
  );
}

interface AppContentProps {
  isAuthenticated: boolean;
  owner: Owner | null;
  gyms: Gym[];
  isLoading: boolean;
  error: string | null;
  onSignIn: (email: string, password: string) => void;
  onSignUp: (name: string, email: string, password: string, businessName: string) => void;
  onSignOut: () => void;
  onGymAdded: (gymData: any) => void;
}

const AppContent: React.FC<AppContentProps> = ({
  isAuthenticated,
  owner,
  gyms,
  isLoading,
  error,
  onSignIn,
  onSignUp,
  onSignOut,
  onGymAdded
}) => {
  const navigate = useNavigate();

  // Handle redirect after authentication
  useEffect(() => {
    console.log('AppContent useEffect triggered:', { isAuthenticated, owner: !!owner, gymsCount: gyms.length });
    
    if (isAuthenticated && owner) {
      if (gyms.length === 0) {
        console.log('Redirecting to add-first-gym');
        navigate('/add-first-gym', { replace: true });
      } else {
        console.log('Redirecting to dashboard');
        navigate('/dashboard', { replace: true });
      }
    } else if (!isAuthenticated) {
      console.log('Redirecting to signin');
      navigate('/signin', { replace: true });
    }
  }, [isAuthenticated, owner, gyms.length, navigate]);

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/signin" element={
          <>
            <VideoBackground />
            <OwnerSignIn
              onSignIn={onSignIn}
              isLoading={isLoading}
              error={error}
            />
          </>
        } />
        
        <Route path="/signup" element={
          <>
            <VideoBackground />
            <OwnerSignUp
              onSignUp={onSignUp}
              isLoading={isLoading}
              error={error}
            />
          </>
        } />

        {/* Protected Routes */}
        <Route path="/add-first-gym" element={
          isAuthenticated && owner ? (
            <AddFirstGym onGymAdded={onGymAdded} />
          ) : (
            <Navigate to="/signin" replace />
          )
        } />

        <Route path="/dashboard/*" element={
          isAuthenticated && owner ? (
            <Dashboard
              ownerName={owner.name}
              businessName={owner.businessName}
              gyms={gyms}
              onSignOut={onSignOut}
            />
          ) : (
            <Navigate to="/signin" replace />
          )
        } />

        {/* Default redirect */}
        <Route path="/" element={
          isAuthenticated && owner ? (
            gyms.length === 0 ? (
              <Navigate to="/add-first-gym" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Navigate to="/signin" replace />
          )
        } />
        
        {/* Catch all redirect */}
        <Route path="*" element={
          isAuthenticated && owner ? (
            gyms.length === 0 ? (
              <Navigate to="/add-first-gym" replace />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          ) : (
            <Navigate to="/signin" replace />
          )
        } />
      </Routes>
    </div>
  );
};

export default App;