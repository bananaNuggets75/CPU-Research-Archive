import { auth, database } from "./firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";

// Admin Login
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user is an admin (fetch role from Firebase Realtime Database)
    const adminRef = ref(database, `admins/${user.uid}`);
    const snapshot = await get(adminRef);

    if (snapshot.exists()) {
      return { user, isAdmin: true };
    } else {
      await signOut(auth); // Logout if not admin
      throw new Error("Unauthorized: Not an admin");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logout Function
export const logout = async () => {
  await signOut(auth);
};

// Listen to Auth State
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};
