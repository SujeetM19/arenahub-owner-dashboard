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
  const [gymNames, setGymNames] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('ownerToken');
    const ownerData = localStorage.getItem('ownerData');
    const gymNamesData = localStorage.getItem('gymNamesData');
    
    if (token && ownerData) {
      try {
        const parsedOwner = JSON.parse(ownerData);
        const parsedGymNames = gymNamesData ? JSON.parse(gymNamesData) : [];
        
        // Validate token by making a test API call
        fetch('http://localhost:8080/api/owner/auth/test', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(response => {
          if (response.ok) {
            setOwner(parsedOwner);
            setGymNames(parsedGymNames);
            // Convert gym names to gym objects for backward compatibility
            const gymObjects = parsedGymNames.map((name: string, index: number) => ({
              id: `gym-${index}`,
              name: name,
              address: '',
              city: '',
              state: '',
              zipCode: '',
              phone: '',
              email: '',
              capacity: 0,
              description: ''
            }));
            setGyms(gymObjects);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('ownerToken');
            localStorage.removeItem('ownerData');
            localStorage.removeItem('gymNamesData');
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          // Network error or invalid token
          localStorage.removeItem('ownerToken');
          localStorage.removeItem('ownerData');
          localStorage.removeItem('gymNamesData');
          setIsAuthenticated(false);
        });
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('ownerToken');
        localStorage.removeItem('ownerData');
        localStorage.removeItem('gymNamesData');
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
        localStorage.setItem('gymNamesData', JSON.stringify(data.gymNames || []));
        setOwner(data.owner);
        setGymNames(data.gymNames || []);
        // Convert gym names to gym objects for backward compatibility
        const gymObjects = (data.gymNames || []).map((name: string, index: number) => ({
          id: `gym-${index}`,
          name: name,
          address: '',
          city: '',
          state: '',
          zipCode: '',
          phone: '',
          email: '',
          capacity: 0,
          description: ''
        }));
        setGyms(gymObjects);
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
        localStorage.setItem('gymNamesData', JSON.stringify(data.gymNames || []));
        setOwner(data.owner);
        setGymNames(data.gymNames || []);
        // Convert gym names to gym objects for backward compatibility
        const gymObjects = (data.gymNames || []).map((name: string, index: number) => ({
          id: `gym-${index}`,
          name: name,
          address: '',
          city: '',
          state: '',
          zipCode: '',
          phone: '',
          email: '',
          capacity: 0,
          description: ''
        }));
        setGyms(gymObjects);
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
    localStorage.removeItem('gymNamesData');
    setOwner(null);
    setGyms([]);
    setGymNames([]);
    setIsAuthenticated(false);
    setError(null);
  };

  const handleGymAdded = (gymData: any) => {
    const newGym = { ...gymData, id: Date.now().toString() };
    const updatedGyms = [...gyms, newGym];
    const updatedGymNames = [...gymNames, gymData.name];
    setGyms(updatedGyms);
    setGymNames(updatedGymNames);
    localStorage.setItem('gymNamesData', JSON.stringify(updatedGymNames));
  };

  return (
    <ThemeProvider>
      <Router>
        <AppContent
          isAuthenticated={isAuthenticated}
          owner={owner}
          gyms={gyms}
          gymNames={gymNames}
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
  gymNames: string[];
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
  gymNames,
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
    console.log('AppContent useEffect triggered:', { isAuthenticated, owner: !!owner, gymNamesCount: gymNames.length });
    
    if (isAuthenticated && owner) {
      if (gymNames.length === 0) {
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
  }, [isAuthenticated, owner, gymNames.length, navigate]);

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
              gymNames={gymNames}
              onSignOut={onSignOut}
            />
          ) : (
            <Navigate to="/signin" replace />
          )
        } />

        {/* Default redirect */}
        <Route path="/" element={
          isAuthenticated && owner ? (
            gymNames.length === 0 ? (
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
            gymNames.length === 0 ? (
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