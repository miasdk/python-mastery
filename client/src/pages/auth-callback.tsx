import { useEffect } from 'react';
import { useNavigate } from 'wouter';

export default function AuthCallback() {
  const [, setLocation] = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        setLocation('/?error=oauth_failed');
        return;
      }

      if (!code) {
        console.error('No authorization code received');
        setLocation('/?error=oauth_failed');
        return;
      }

      try {
        // Send the code to your backend to exchange for user info
        const response = await fetch('/api/auth/github/exchange', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ code }),
        });

        if (response.ok) {
          // Success! Redirect to dashboard
          setLocation('/dashboard');
        } else {
          throw new Error('Failed to exchange code');
        }
      } catch (error) {
        console.error('Auth exchange error:', error);
        setLocation('/?error=oauth_failed');
      }
    };

    handleCallback();
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing GitHub authentication...</p>
      </div>
    </div>
  );
}