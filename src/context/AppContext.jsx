import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initial loading state

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  /* ── Auth ── */
  const login = useCallback(async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        showToast('Welcome back!');
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  }, [showToast]);

  const signup = useCallback(async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setIsAuthenticated(true);
        showToast(`Welcome to VibeCheck, ${name}!`);
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  }, [showToast]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    showToast('Logged out successfully.');
  }, [showToast]);

  /* ── Itineraries ── */
  const createItinerary = useCallback(async (data) => {
    try {
      const res = await api.post('/itineraries', data);
      showToast(data.status === 'published' ? 'Itinerary published!' : 'Draft saved.');
      return res.data._id;
    } catch (error) {
      showToast(error.response?.data?.message || 'Error saving itinerary.', 'error');
      console.error(error);
      throw error;
    }
  }, [showToast]);

  const updateItinerary = useCallback(async (id, data) => {
    try {
      await api.put(`/itineraries/${id}`, data);
      showToast('Changes saved.');
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating itinerary.', 'error');
      console.error(error);
      throw error;
    }
  }, [showToast]);

  const cloneItinerary = useCallback(async (itineraryId) => {
    try {
      const res = await api.post(`/itineraries/${itineraryId}/clone`);
      showToast('Itinerary cloned — find it in My Trips.');
      return res.data.data?._id;
    } catch (error) {
      showToast('Error cloning itinerary.');
      console.error(error);
      throw error;
    }
  }, [showToast]);

  const saveItinerary = useCallback(async (itineraryId) => {
    if (!user) return;
    const isSaved = user.savedItineraryIds?.includes(itineraryId);
    
    try {
      if (isSaved) {
        await api.delete(`/users/save/${itineraryId}`);
        setUser(prev => ({
          ...prev,
          savedItineraryIds: prev.savedItineraryIds.filter(id => id !== itineraryId)
        }));
        showToast('Removed from saved.');
      } else {
        await api.post(`/users/save/${itineraryId}`);
        setUser(prev => ({
          ...prev,
          savedItineraryIds: [...(prev.savedItineraryIds || []), itineraryId]
        }));
        showToast('Saved to your list.');
      }
    } catch (error) {
      showToast('Error saving itinerary.');
      console.error(error);
    }
  }, [user, showToast]);

  const toggleFollowUser = useCallback(async (targetUserId) => {
    if (!user) return;
    const targetStr = targetUserId?.toString();
    const isFollowingTarget = user.followingIds?.some(fId => fId.toString() === targetStr);

    try {
      if (isFollowingTarget) {
        await api.delete(`/users/${targetUserId}/follow`);
        setUser(prev => ({
          ...prev,
          followingIds: prev.followingIds.filter(id => id.toString() !== targetStr),
          following: Math.max(0, (prev.following || 1) - 1)
        }));
        showToast('Unfollowed user.');
      } else {
        await api.post(`/users/${targetUserId}/follow`);
        setUser(prev => ({
          ...prev,
          followingIds: [...(prev.followingIds || []), targetUserId],
          following: (prev.following || 0) + 1
        }));
        showToast('Followed user.');
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Error updating follow status.', 'error');
      console.error(error);
    }
  }, [user, showToast]);

  const updateProfile = useCallback(async (data) => {
    try {
      const res = await api.put('/users/me', data);
      if (res.data.success) {
        setUser(res.data.user);
        showToast('Profile updated.');
      }
    } catch (error) {
      showToast('Error updating profile.');
      console.error(error);
    }
  }, [showToast]);

  // Helpers
  const isSaved = useCallback((id) => user?.savedItineraryIds?.includes(id), [user]);
  const isFollowing = useCallback((id) => {
    if (!id || !user?.followingIds) return false;
    const idStr = id.toString();
    return user.followingIds.some(fId => fId.toString() === idStr);
  }, [user]);

  if (isLoading) {
    return null; // or a full-screen loading spinner
  }

  return (
    <AppContext.Provider value={{
      user,
      toastMessage,
      isAuthenticated,
      showToast,
      login,
      logout,
      signup,
      createItinerary,
      updateItinerary,
      cloneItinerary,
      saveItinerary,
      updateProfile,
      toggleFollowUser,
      isSaved,
      isFollowing,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
