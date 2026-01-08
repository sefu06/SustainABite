import React, { useEffect, useState } from "react";
import { Platform} from "react-native";
import {
    collection,
    query,
    where,
    onSnapshot,
    deleteDoc
} from "firebase/firestore";
import {
    View,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { launchImageLibrary } from "react-native-image-picker";
import BottomNavBar from "./components/BottomNavBar";

export default function ProfileScreen() {
    const [myRequests, setMyRequests] = useState([]);
    const [userData, setUserData] = useState({ username: "", email: "" });
    const [profileImage, setProfileImage] = useState(null);
    const user = auth.currentUser;

    // Fetch user data
    useEffect(() => {
        if (!user) return;

        const fetchUserData = async () => {
            try {
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    console.log("Fetched user data:", data);
                    setUserData({
                        username: data.username || "(No username)",
                        email: data.email || user.email,
                    });
                    if (data.profileImage) setProfileImage(data.profileImage);
                } else {
                    // If doc doesn't exist, create default one
                    await setDoc(userRef, { username: "", email: user.email });
                    setUserData({ username: "(No username)", email: user.email });
                }
            } catch (error) {
                console.log("Error fetching user data:", error.message);
            }
        };

        fetchUserData();
    }, [user]);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "requests"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log("My requests:", requests);
            setMyRequests(requests);
        });

        return unsubscribe;
    }, [user]);

    // Handle profile picture change
    const handlePickImage = async () => {
        try {
            let uri;
            let blob;

            // Platform-specific image picking
            if (Platform.OS === 'web') {
                // Create a file input for web
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';

                const filePromise = new Promise((resolve, reject) => {
                    input.onchange = (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            resolve(file);
                        } else {
                            reject(new Error('No file selected'));
                        }
                    };
                    input.oncancel = () => reject(new Error('Cancelled'));
                });

                input.click();
                const file = await filePromise;
                blob = file;

                // Create preview URL for web
                uri = URL.createObjectURL(file);
                setProfileImage(uri); // Temporary preview

            } else {
                // Use react-native-image-picker for native (iOS/Android)
                const result = await launchImageLibrary({
                    mediaType: "photo",
                    quality: 0.7,
                });

                if (result.didCancel) return;
                if (result.errorCode) {
                    Alert.alert("Error picking image", result.errorMessage);
                    return;
                }

                uri = result.assets[0].uri;

                // Convert to blob for native
                const response = await fetch(uri);
                blob = await response.blob();
            }

            // Upload to Firebase Storage (works for both platforms)
            const storage = getStorage();
            const storageRef = ref(storage, `profileImages/${user.uid}.jpg`);

            console.log("Starting upload...");
            await uploadBytes(storageRef, blob);
            console.log("Upload complete!");

            const downloadURL = await getDownloadURL(storageRef);
            console.log("Download URL:", downloadURL);

            // Save to Firestore
            await setDoc(
                doc(db, "users", user.uid),
                { profileImage: downloadURL },
                { merge: true }
            );

            setProfileImage(downloadURL);
            Alert.alert("Profile picture updated!");

        } catch (error) {
            console.log("Upload error:", error);
            Alert.alert("Error uploading profile picture", error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableOpacity onPress={handlePickImage}>
                <Image
                    source={
                        profileImage
                            ? { uri: profileImage }
                            : require("../assets/profile.jpg")
                    }
                    style={styles.profileImage}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePickImage}>

                <Text style={styles.changePic}> Change profile picture</Text>

            </TouchableOpacity>


            <Text style={styles.headerTitle}>{userData.username}</Text>
            <Text style={styles.email}>{userData.email}</Text>

            <Text style={styles.requestsTitle}>My Requests:</Text>

            {myRequests.length === 0 ? (
                <Text style={{ color: "#777", marginTop: 10 }}>
                    You have no requests yet.
                </Text>
            ) : (
                myRequests.map((req) => (
                    <View key={req.id} style={styles.requestBox}>
                        <Text style={styles.requestItems}>
                            {Array.isArray(req.items)
                                ? req.items.join(", ")
                                : "No items"}
                        </Text>
                    </View>
                ))
            )}


            <BottomNavBar />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: "center",
        backgroundColor: "#faf1df",
        paddingVertical: 30,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        backgroundColor: "#ddd",
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 10,
        color: "#333",
    },
    email: {
        fontSize: 16,
        color: "#555",
        marginBottom: 20,
    },

    requestsTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 20,
        marginBottom: 10,
        color: "#333",
    },

    requestBox: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // Android shadow
    },

    requestItems: {
        fontSize: 15,
        color: "#444",
        lineHeight: 20,
    },

    emptyText: {
        color: "#777",
        marginTop: 10,
        fontStyle: "italic",
    },
    
});
