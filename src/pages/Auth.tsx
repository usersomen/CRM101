import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Mail, Lock, ToggleLeft as Google } from 'lucide-react';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signInWithGoogle, signUpWithEmail, signInWithEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check URL parameters for signup flag
    const params = new URLSearchParams(location.search);
    setIsSignUp(params.get('signup') === 'true');
  }, [location]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        setError('Please allow popups for this website to sign in with Google');
      } else if (error.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for authentication. Please contact support.');
      } else {
        setError(error.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Keep the existing Auth component JSX */}
    </div>
  );
}