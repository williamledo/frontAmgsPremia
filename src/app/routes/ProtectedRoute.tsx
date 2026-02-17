import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiUrl } from "@/config/api";

type Props = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: Props) {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      const tryFetch = async (url: string) => {
        try {
          const res = await fetch(url, { credentials: 'include' });
          if (!mounted) return null;
          // If backend returns 200 but with an anonymous body, treat as not authenticated
          if (res.ok) {
            try {
              const body = await res.json();
              // adjust the property check to match your backend response
              if (body && (body.email || body.id || body.authenticated)) {
                return true;
              }
              return false;
            } catch (e) {
              return false;
            }
          }
          return false;
        } catch (e) {
          return null; // network or CORS error
        }
      };

      // try relative path first
      let result = await tryFetch('/api/me');
      if (result === null) {
        // fallback to configured backend base URL
        result = await tryFetch(apiUrl('/api/me'));
      }

      if (!mounted) return;
      setOk(!!result);
    };

    checkSession();
    return () => {
      mounted = false;
    };
  }, []);

  if (ok === null) return <div>Verificando sessão...</div>;

  if (!ok) return <Navigate to="/" />;

  return <>{children}</>;
}
