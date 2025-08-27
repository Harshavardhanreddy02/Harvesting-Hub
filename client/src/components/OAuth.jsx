import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { loginInSuccess } from '../pages/redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { storeContext } from '../pages/redux/context/storeContext';
import { useContext, useEffect } from 'react';
import { validateToken } from '../utils/tokenManager';
import toastService from '../utils/toastService';


export default function OAuth({ mode = 'login', selectedRole = 'Customer' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {setToken} = useContext(storeContext);

  // Check for redirect result on component mount
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const auth = getAuth(app);
        console.log('Checking for redirect result...');
        const result = await getRedirectResult(auth);
        
        if (result && result.user) {
          console.log('Google sign-in successful via redirect:', result.user);
          await handleAuthSuccess(result);
        } else {
          console.log('No redirect result found');
        }
      } catch (error) {
        console.error('Google OAuth redirect error:', error);
        toastService.error('Authentication failed. Please try again.');
      }
    };

    // Add a small delay to ensure Firebase is fully initialized
    const timer = setTimeout(() => {
      handleRedirectResult();
    }, 100);

    return () => clearTimeout(timer);
  }, [dispatch, navigate, setToken]);

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      console.log('Attempting Google sign-in with popup...');
      
      // Try popup first, fallback to redirect if it fails
      let result;
      try {
        result = await signInWithPopup(auth, provider);
      } catch (popupError) {
        console.log('Popup blocked, trying redirect...', popupError);
        await signInWithRedirect(auth, provider);
        return; // Exit here as redirect will handle the rest
      }

      if (result && result.user) {
        console.log('Google sign-in successful:', result.user);
        await handleAuthSuccess(result);
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      if (error.code === 'auth/configuration-not-found') {
        console.error('Firebase project configuration issue. Check Firebase Console.');
        toastService.error('Firebase configuration error. Please check the Firebase project setup.');
      } else {
        toastService.error('Authentication failed. Please try again.');
      }
    }
  };

  const handleAuthSuccess = async (result) => {
    try {
      console.log('Processing authentication success...');
      
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
          mode: mode, // Pass the mode to backend
          role: selectedRole, // Pass the selected role to backend
        }),
      });
      
      console.log('Backend response status:', res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Backend response data:', data);
      
      if (data.success && data.token) {
        console.log('Authentication successful, validating token...');
        
        // Validate the received token before storing it
        if (validateToken(data.token)) {
          console.log('Token validation successful, setting token and navigating...');
          dispatch(loginInSuccess(data.user));
          setToken(data.token);
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log('Navigating to home page...');
          navigate('/', { replace: true });
        } else {
          console.error('Received invalid token from backend');
          throw new Error('Invalid token received from server');
        }
      } else {
        console.error('Backend authentication failed:', data.message);
        
        // Handle specific error codes
        if (data.code === 'ACCOUNT_NOT_FOUND') {
          if (mode === 'signup') {
            toastService.error('Registration failed. Please try again or contact support.');
          } else {
            toastService.error('User not registered. Please register first or contact administrator if your account was deleted.');
          }
        } else if (data.code === 'MISSING_FIELDS') {
          toastService.error('Google authentication data incomplete. Please try again.');
        } else if (data.code === 'SAVE_ERROR') {
          toastService.error('Registration failed. Please try again or contact support.');
        } else {
          toastService.error(data.message || 'Authentication failed. Please try again.');
        }
        return; // Don't throw error, just return to prevent further processing
      }
    } catch (error) {
      console.error('Auth success handling error:', error);
      toastService.error('Authentication processing failed. Please try again.');
    }
  };
  return (
    <button
    //   type='button'
    onClick={handleGoogleClick}
      className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'
    >
      Continue with google
    </button>
  );
}