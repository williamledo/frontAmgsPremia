import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export function AdminRoute({ children }: Props) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    const checkAdmin = async () => {
      const tryFetch = async (url: string) => {
        try {
          const res = await fetch(url, { credentials: 'include' });
          if (!mounted) return null;
          if (res.ok) {
            try {
              const body = await res.json();
              // Verifica se o usuário é ADMIN
              if (body && body.authenticated && body.role === "ADMIN") {
                return true;
              }
              return false;
            } catch (e) {
              return false;
            }
          }
          return false;
        } catch (e) {
          return null;
        }
      };

      // try relative path first
      let result = await tryFetch('/api/me');
      if (result === null) {
        // fallback to localhost backend
        result = await tryFetch('http://localhost:8080/api/me');
      }

      if (!mounted) return;
      setIsAdmin(!!result);
    };

    checkAdmin();
    return () => {
      mounted = false;
    };
  }, []);

  if (isAdmin === null) return <div className="text-white">Verificando permissões...</div>;

  if (!isAdmin) return <Navigate to="/" />;

  return <>{children}</>;
}
