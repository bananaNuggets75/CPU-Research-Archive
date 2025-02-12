import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, database } from "./firebase";

export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check if user is an admin in Firebase Realtime Database
    const adminRef = ref(database, `admins/${user.uid}`);
    const adminSnapshot = await get(adminRef);

    if (!adminSnapshot.exists()) {
      await signOut(auth); // Log out if not admin
      throw new Error("Access denied. You are not an admin.");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
};
