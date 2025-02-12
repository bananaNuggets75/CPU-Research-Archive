import { signInWithEmailAndPassword, signOut, getAuth } from "firebase/auth";
import { ref, get, getDatabase } from "firebase/database";

// Check if the logged-in user is an admin
const checkIfAdmin = async () => {
  const auth = getAuth();
  const db = getDatabase();
  const user = auth.currentUser;

  if (!user) {
    console.log("User not logged in");
    return false;
  }

  const adminRef = ref(db, `admins/${user.uid}`);
  const snapshot = await get(adminRef);

  if (snapshot.exists()) {
    console.log("✅ Admin access granted");
    return true;
  } else {
    console.log("❌ Access denied, not an admin");
    return false;
  }
};

// Admin login
export const loginAdmin = async (email, password) => {
  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);

    const isAdmin = await checkIfAdmin();
    if (!isAdmin) {
      await signOut(auth); // Log out if not admin
      throw new Error("Access denied. You are not an admin.");
    }

    return auth.currentUser;
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
      throw new Error("Invalid email or password.");
    }
    throw new Error(error.message);
  }
};

// Logout function
export const logout = async () => {
  const auth = getAuth();
  await signOut(auth);
};
