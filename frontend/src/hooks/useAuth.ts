import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const initAuth = () => {
            // 1. Check for token in URL (LTI Launch)
            const params = new URLSearchParams(location.search);
            const urlToken = params.get('lti_token');

            if (urlToken) {
                localStorage.setItem('lti_token', urlToken);
                setIsAuthenticated(true);
                // Clean URL
                params.delete('lti_token');
                const newPath = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
                window.history.replaceState({}, '', newPath);
            } else {
                // 2. Check localStorage
                const storedToken = localStorage.getItem('lti_token');
                if (storedToken) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    // Optional: redirect to session expired or login if strictly protected
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, [location]);

    const logout = () => {
        localStorage.removeItem('lti_token');
        setIsAuthenticated(false);
        navigate('/app/session-expired');
    };

    return { isAuthenticated, isLoading, logout };
};
