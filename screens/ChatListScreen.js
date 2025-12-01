import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { auth, db } from "../firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import BottomNavBar from "./components/BottomNavBar";

export default function ChatListScreen() {
    const [chats, setChats] = useState([]);
    const [usernames, setUsernames] = useState({});
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

            // Fetch usernames
            const newUsernames = { ...usernames };

            for (let chat of userChats) {
                for (let uid of chat.participants) {
                    if (!newUsernames[uid]) {
                        const userRef = doc(db, "users", uid);
                        const userSnap = await getDoc(userRef);

                        if (userSnap.exists()) {
                            newUsernames[uid] = userSnap.data().username;
                        } else {
                            newUsernames[uid] = "Unknown";
                        }
                    }
                }
            }

            setUsernames(newUsernames);
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
                            <Text style={styles.chatName}>
                                Chat with: {usernames[otherUserId] || "..."}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />

            <BottomNavBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    header: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
    chatItem: {
        padding: 15,
        backgroundColor: "#FFCDD2",
        marginBottom: 10,
        borderRadius: 10,
    },
    chatName: { fontWeight: "600" },
});
