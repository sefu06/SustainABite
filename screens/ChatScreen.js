import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import BottomNavBar from "./components/BottomNavBar";

export default function ChatScreen({ route }) {
    const { currentUserId, otherUserId } = route.params;
    const chatId = [currentUserId, otherUserId].sort().join("_");

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

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
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
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
            <BottomNavBar/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 10 },
    message: {
        padding: 10,
        marginVertical: 5,
        borderRadius: 10,
        maxWidth: "70%",
    },
    myMessage: {
        backgroundColor: "#FFCDD2",
        alignSelf: "flex-end",
    },
    theirMessage: {
        backgroundColor: "#E0E0E0",
        alignSelf: "flex-start",
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderColor: "#ccc",
        paddingTop: 10,
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
    },
    sendButton: {
        padding: 10,
        marginLeft: 10,
        backgroundColor: "#FF9A9A",
        borderRadius: 10,
    },
    sendText: { fontWeight: "bold" },
});
