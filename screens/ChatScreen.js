import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, KeyboardAvoidingView, Platform } from "react-native";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp, getDoc, doc } from "firebase/firestore";
import BottomNavBar from "./components/BottomNavBar";
import { SafeAreaView } from "react-native";

export default function ChatScreen({ route }) {
    const { currentUserId, otherUserId } = route.params;
    const chatId = [currentUserId, otherUserId].sort().join("_");

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [otherUsername, setOtherUsername] = useState("...");
    const [otherProfileImage, setOtherProfileImage] = useState(null);

    useEffect(() => {
        const messagesRef = collection(db, "chats", chatId, "messages");
        const q = query(messagesRef, orderBy("createdAt", "asc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMessages(msgs);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        async function fetchUserData() {
            const userRef = doc(db, "users", otherUserId);
            const snap = await getDoc(userRef);

            if (snap.exists()) {
                const userData = snap.data();
                setOtherUsername(userData.username || "Unknown");
                setOtherProfileImage(userData.profileImage || null);
            } else {
                setOtherUsername("Unknown");
            }
        }

        fetchUserData();
    }, []);

    const sendMessage = async () => {
        if (text.trim().length === 0) return;

        await addDoc(collection(db, "chats", chatId, "messages"), {
            text,
            senderId: currentUserId,
            createdAt: serverTimestamp(),
        });

        setText("");
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={90}
            >
                <View style={styles.container}>
                    {/* Header with profile picture */}
                    <View style={styles.banner}>
                        <Image
                            source={
                                otherProfileImage
                                    ? { uri: otherProfileImage }
                                    : require("../assets/profile.jpg")
                            }
                            style={styles.bannerProfileImage}
                        />
                        <Text style={styles.bannerText}>{otherUsername}</Text>
                    </View>

                    <FlatList
                        data={messages}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.messagesList}
                        renderItem={({ item }) => (
                            <Text
                                style={[
                                    styles.message,
                                    item.senderId === currentUserId
                                        ? styles.myMessage
                                        : styles.theirMessage,
                                ]}
                            >
                                {item.text}
                            </Text>
                        )}
                    />

                    <View style={styles.inputRow}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            value={text}
                            onChangeText={setText}
                        />

                        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                            <Text style={styles.sendText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
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
        backgroundColor: "#faf1df",
        paddingBottom: 40
    },
    banner: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        margin: 10,
        borderRadius: 10,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bannerProfileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ddd",
        marginRight: 14,
       
    },
    bannerText: {
        fontSize: 18,
        fontWeight: "700",
        color: "#333",
    },
    messagesList: {
        padding: 20,
        paddingBottom: 10,
    },
    message: {
        padding: 12,
        marginVertical: 5,
        borderRadius: 15,
        maxWidth: "70%",
    },
    myMessage: {
        backgroundColor: "#FF9A9A",
        alignSelf: "flex-end",
        borderBottomRightRadius: 5,
    },
    theirMessage: {
        backgroundColor: "#fff",
        alignSelf: "flex-start",
        borderBottomLeftRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    input: {
        flex: 1,
        padding: 12,
        backgroundColor: "#f5f5f5",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    sendButton: {
        padding: 12,
        paddingHorizontal: 20,
        marginLeft: 10,
        backgroundColor: "#FF9A9A",
        borderRadius: 20,
    },
    sendText: {
        fontWeight: "bold",
        color: "#fff",
    },
});