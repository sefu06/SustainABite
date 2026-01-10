import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase";

import BottomNavBar from "./components/BottomNavBar";

import {
    collection,
    onSnapshot,
    query,
    where,
    getDocs,
    getDoc,
    doc,
    addDoc,
} from "firebase/firestore";

// Create or fetch existing chat
async function createOrGetChat(otherUserId) {
    const currentUserId = auth.currentUser.uid;
    const chatsRef = collection(db, "chats");

    // Query chats where current user is a participant
    const q = query(chatsRef, where("participants", "array-contains", currentUserId));
    const snapshot = await getDocs(q);

    // Check if a chat with this other user exists
    let existingChat = null;
    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.participants.includes(otherUserId)) {
            existingChat = { id: docSnap.id, ...data };
        }
    });

    if (existingChat) return existingChat.id;

    // Create new chat
    const newChatRef = await addDoc(chatsRef, {
        participants: [currentUserId, otherUserId],
        createdAt: Date.now(),
    });

    return newChatRef.id;
}

export default function BrowseRequestsScreen() {
    const navigation = useNavigation();
    const currentUserId = auth.currentUser?.uid;

    const [requests, setRequests] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [profileImages, setProfileImages] = useState({});
    const [usernames, setUsernames] = useState({});

    // Fetch requests
    useEffect(() => {
        const requestsRef = collection(db, "requests");

        const unsubscribe = onSnapshot(requestsRef, (snapshot) => {
            const fetchedRequests = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            }));
            setRequests(fetchedRequests);
        });

        return unsubscribe;
    }, []);

    // Fetch user info (profile images + usernames)
    useEffect(() => {
        if (!currentUserId) return;

        const chatsRef = collection(db, "chats");
        const unsubscribe = onSnapshot(chatsRef, async (snapshot) => {
            const userIdsToFetch = new Set();

            snapshot.docs.forEach((docSnap) => {
                const data = docSnap.data();
                if (data.participants.includes(currentUserId)) {
                    data.participants.forEach((uid) => {
                        if (!usernames[uid]) userIdsToFetch.add(uid);
                    });
                }
            });

            const newUsernames = { ...usernames };
            const newProfileImages = { ...profileImages };

            for (let uid of userIdsToFetch) {
                try {
                    const userDoc = await getDoc(doc(db, "users", uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        newUsernames[uid] = userData.username || "Unknown";
                        newProfileImages[uid] = userData.profileImage || null;
                    } else {
                        newUsernames[uid] = "Unknown";
                        newProfileImages[uid] = null;
                    }
                } catch (err) {
                    console.log("Error fetching user:", err);
                }
            }

            setUsernames(newUsernames);
            setProfileImages(newProfileImages);
        });

        return unsubscribe;
    }, [currentUserId]);

    const toggleSelect = (userId) => {
        setSelectedUser((prev) => (prev === userId ? null : userId));
    };

    const handleConfirm = async () => {
        if (!selectedUser) {
            Alert.alert("Please select a user first!");
            return;
        }

        const chatId = await createOrGetChat(selectedUser);

        navigation.navigate("ChatScreen", {
            chatId,
            currentUserId,
            otherUserId: selectedUser,
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <Image source={require("../assets/apple.png")} style={styles.logo} />
                <Text style={styles.headerTitle}>Browse Requests!</Text>

                {requests.map((req) => {
                    const isSelected = selectedUser === req.userId;
                    return (
                        <TouchableOpacity
                            key={req.id}
                            style={[styles.requestBox, isSelected && styles.selectedBox]}
                            onPress={() => toggleSelect(req.userId)}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={styles.username}>
                                    {req.username || usernames[req.userId] || "Unknown"}
                                </Text>
                                <Text style={styles.requestText}>
                                    {Array.isArray(req.items) ? req.items.join(", ") : "No items"}
                                </Text>
                            </View>

                            <Image
                                source={
                                    profileImages[req.userId]
                                        ? { uri: profileImages[req.userId] }
                                        : require("../assets/profile.jpg")
                                }
                                style={styles.userImage}
                            />
                        </TouchableOpacity>
                    );
                })}

                <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                    <Text style={styles.buttonText}>Confirm Selection</Text>
                </TouchableOpacity>
            </ScrollView>

            <BottomNavBar />
        </View>
    );
}

/* ------------------ Styles ------------------ */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#faf1df",
    },
    scrollContainer: {
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 100, // matches nav bar height
        alignItems: "center",
    },
    logo: {
        width: 80,
        height: 80,
        margin: 20,
        resizeMode: "contain",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 20,
        textAlign: "center",
        color: "#333",
    },
    requestBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: "100%",
    },
    selectedBox: {
        backgroundColor: "#FFC8C8",
    },
    username: {
        fontWeight: "600",
        fontSize: 16,
        marginBottom: 3,
    },
    requestText: {
        color: "#555",
    },
    userImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 10,
    },
    button: {
        backgroundColor: "#FF9A9A",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 40,
        alignSelf: "center",
    },
    buttonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
});
