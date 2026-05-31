import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Post } from './pages/Post';
import { Explore } from './pages/Explore';
import { OutfitDetail } from './pages/OutfitDetail';
import { UserProfile } from './pages/UserProfile';
import { MyProfile } from './pages/MyProfile';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { useAuthStore } from './store/authStore';
import api from './utils/api';

function App() {
  const { setUser, user } = useAuthStore();

  useEffect(() => {
    // Load user from localStorage if available
    const token = localStorage.getItem('access_token');
    if (token && !user) {
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/users/me/profile');
      setUser(response.data.data);
    } catch (err) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-cream">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/outfit/:id" element={<OutfitDetail />} />
          <Route path="/post" element={<Post />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
