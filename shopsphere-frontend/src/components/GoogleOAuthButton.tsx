import { useEffect, useRef } from 'react';
import { googleOAuthLogin } from '../services/api';

type UserType = 'user' | 'seller';

interface GoogleOAuthButtonProps {
  mode?: 'login' | 'register';
  userType: UserType;
  onSuccess: (response: { token: string; user?: { id: number; name: string; email: string } }) => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const GoogleOAuthButton = ({ userType, onSuccess, onError }: GoogleOAuthButtonProps) => {
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const loadScript = () => {
      if (window.google) {
        initializeGoogle();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      script.onerror = () => onError('Failed to load Google SDK');
      document.body.appendChild(script);
    };

    const initializeGoogle = () => {
      if (!window.google) {
        onError('Google SDK not available');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential: string }) => {
          try {
            const data = await googleOAuthLogin(response.credential, userType);
            onSuccess({ token: data.token, user: data.user });
          } catch (err) {
            onError((err as Error).message || 'Google login failed');
          }
        },
      });

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 300,
          text: 'continue_with',
        });
      }
    };

    loadScript();
  }, [onError, onSuccess, userType]);

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return (
      <button
        type="button"
        disabled
        className="w-full border border-slate-300 py-2 rounded-lg font-semibold text-slate-400 bg-slate-100 cursor-not-allowed transition flex items-center justify-center gap-2"
      >
        Google OAuth is not configured
      </button>
    );
  }

  return <div ref={buttonRef} className="w-full flex justify-center" />;
};

export default GoogleOAuthButton;
