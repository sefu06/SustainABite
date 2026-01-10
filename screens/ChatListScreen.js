import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from "react-native";
import { auth, db } from "../firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import BottomNavBar from "./components/BottomNavBar";
import { SafeAreaView } from "react-native";

export default function ChatListScreen() {
    const [chats, setChats] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [profileImages, setProfileImages] = useState({}); // Store profile images
    const navigation = useNavigation();
    const currentUserId = auth.currentUser.uid;

    useEffect(() => {
        const chatsRef = collection(db, "chats");

        const unsubscribe = onSnapshot(chatsRef, async (snapshot) => {
            const userChats = snapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                .filter((chat) => chat.participants.includes(currentUserId));

            setChats(userChats);

            // Fetch usernames and profile images
            const newUsernames = { ...usernames };
            const newProfileImages = { ...profileImages };

            for (let chat of userChats) {
                for (let uid of chat.participants) {
                    if (!newUsernames[uid]) {
                        const userRef = doc(db, "users", uid);
                        const userSnap = await getDoc(userRef);

                        if (userSnap.exists()) {
                            const userData = userSnap.data();
                            newUsernames[uid] = userData.username || "Unknown";
                            newProfileImages[uid] = userData.profileImage || null;
                        } else {
                            newUsernames[uid] = "Unknown";
                            newProfileImages[uid] = null;
                        }
                    }
                }
            }

            setUsernames(newUsernames);
            setProfileImages(newProfileImages);
        });

        return unsubscribe;
    }, []);

    const goToChat = (chat) => {
        const otherUserId = chat.participants.find((id) => id !== currentUserId);

        navigation.navigate("ChatScreen", {
            chatId: chat.id,
            currentUserId,
            otherUserId,
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.header}>Your Chats</Text>

                <FlatList
                    data={chats}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    renderItem={({ item }) => {
                        const otherUserId = item.participants.find((id) => id !== currentUserId);

                        return (
                            <TouchableOpacity style={styles.chatItem} onPress={() => goToChat(item)}>
                                <Image
                                    source={
                                        profileImages[otherUserId]
                                            ? { uri: profileImages[otherUserId] }
                                            : require("../assets/profile.jpg")
                                    }
                                    style={styles.profileImage}
                                />
                                <View style={styles.chatContent}>
                                    <Text style={styles.chatName}>
                                        {usernames[otherUserId] || "..."}
                                    </Text>
                                    <Text style={styles.chatSubtext}>Tap to open chat</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
            <BottomNavBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#faf1df",
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#faf1df",
    },
    header: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 20,
        color: "#333",
    },
    chatItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#fff",
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#ddd",
        marginRight: 15,
        
    },
    chatContent: {
        flex: 1,
    },
    chatName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        marginBottom: 2,
    },
    chatSubtext: {
        fontSize: 13,
        color: "#777",
    },
});