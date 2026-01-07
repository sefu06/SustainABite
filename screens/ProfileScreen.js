import React, { useEffect, useState } from "react";
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
import storage from "@react-native-firebase/storage";
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

            console.log("My requests:", requests); // debug
            setMyRequests(requests);
        });

        return unsubscribe;
    }, [user]);

    // Handle profile picture change
    const handlePickImage = async () => {
        launchImageLibrary({ mediaType: "photo", quality: 0.7 }, async (response) => {
            if (response.didCancel) return;
            if (response.errorCode) {
                Alert.alert("Error picking image", response.errorMessage);
                return;
            }

            const uri = response.assets[0].uri;
            setProfileImage(uri);

            try {
                const storageRef = storage().ref(`profileImages/${user.uid}.jpg`);
                await storageRef.putFile(uri);

                const downloadURL = await storageRef.getDownloadURL();
                await updateDoc(doc(db, "users", user.uid), { profileImage: downloadURL });

                setProfileImage(downloadURL);
                Alert.alert("Profile picture updated!");
            } catch (error) {
                Alert.alert("Error updating profile picture", error.message);
            }
        });
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

            <Text style={styles.headerTitle}>{userData.username}</Text>
            <Text style={styles.email}>{userData.email}</Text>

            <Text>My Requests:</Text>

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
});
