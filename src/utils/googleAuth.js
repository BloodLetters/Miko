import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "./dbConfig";

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("User signed in:", user);
        return user;
    } catch (error) {
        console.error("Error during Google sign-in:", error);
        throw error;
    }
};

const backupHistoryToGoogle = async (history) => {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
            history: history,
            lastBackup: new Date().toISOString(),
        });
        // console.log("History backed up to Firestore successfully.");
    } else {
        throw new Error("User not authenticated");
    }
};

const getCurrentUser = () => {
    return new Promise((resolve) => {
        const user = auth.currentUser;
        resolve(user);
    });
};

const getBackupCount = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        return userDoc.data().history.length;
    }
    return 0;
};

const getBackupData = async (userId) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        return userDoc.data().history || null;
    }
    return null;
};

const isChapterInFirebase = async (userId, chapterEndpoint) => {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
        const history = userDoc.data().history || [];
        return history.some(chapter => chapter.lastReadChapter.endpoint === chapterEndpoint);
    }
    return false;
};

const logout = async () => {
    try {
        await signOut(auth);
        console.log("User signed out successfully.");
    } catch (error) {
        console.error("Error during logout:", error);
        throw error;
    }
};

export { signInWithGoogle, backupHistoryToGoogle, getCurrentUser, getBackupCount, getBackupData, isChapterInFirebase, logout };