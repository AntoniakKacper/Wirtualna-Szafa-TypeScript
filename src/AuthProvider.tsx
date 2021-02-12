import React, { useEffect, useState } from 'react';
import firebase from './database/firebase';
import { auth } from './database/firebase';

interface AuthProviderProps {
    currentUser: firebase.User | null;
    authenticated: boolean;
    setCurrentUser: any;
    loadingAuthState: boolean;
}

export const AuthContext = React.createContext<Partial<AuthProviderProps>>({});

export const AuthProvider = ({children}: any) => {
    const [currentUser, setCurrentUser] = useState(null as firebase.User | null);
    const [loadingAuthState, setLoadingAuthState] = useState(true);

    useEffect(() => {
        auth.onAuthStateChanged((userCredentials: any) => {
            setCurrentUser(userCredentials);
            setLoadingAuthState(false);
        })
    }, []);

    return (
        <AuthContext.Provider 
            value={{
                currentUser,
                authenticated: currentUser !== null,
                setCurrentUser,
                loadingAuthState
            }}>
                {children}
        </AuthContext.Provider>
    );
}