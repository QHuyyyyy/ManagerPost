import { useContext, createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
const AuthContext = createContext();
export const AuthContextProvider = ({children})=>{
const [user, setUser]=useState({});
    const googleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        // Lấy token
        const token = await result.user.getIdToken();
        return {
            user: result.user,
            token: token
        };
    };
    const logOut =()=>{
        signOut(auth)
    }
    useEffect(()=>{
        const unSubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser);
            console.log('User', currentUser);
        });
        return ()=>{
            unSubscribe();
 }
    },[]);
return(
    <AuthContext.Provider value={{googleSignIn, logOut, user}}>
        {children}
    </AuthContext.Provider>
)
}
export const UserAuth =()=>{
 return useContext(AuthContext)
} 
