// src/services/authService.js
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    onAuthStateChanged
  } from 'firebase/auth';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { auth, db } from '../firebase';
  
  export const authService = {
    // Register new user
    async register(email, password, displayName) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Update profile
        await updateProfile(user, { displayName });
        
        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          displayName: displayName,
          preferences: [],
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        return user;
      } catch (error) {
        throw error;
      }
    },
  
    // Sign in user
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
      } catch (error) {
        throw error;
      }
    },
  
    // Sign out user
    async logout() {
      try {
        await signOut(auth);
      } catch (error) {
        throw error;
      }
    },
  
    // Get current user data
    async getCurrentUserData(userId) {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        return userDoc.exists() ? userDoc.data() : null;
      } catch (error) {
        throw error;
      }
    },
  
    // Listen to auth state changes
    onAuthStateChange(callback) {
      return onAuthStateChanged(auth, callback);
    }
  };