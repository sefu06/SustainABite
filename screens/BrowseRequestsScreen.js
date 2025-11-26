import React, { useState, useEffect } from "react";
import {
    View,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";

import BottomNavBar from "./components/BottomNavBar";

import { db } from "../firebase";
import {
    collection,
    onSnapshot,
    orderBy,
    query
} from "firebase/firestore";

export default function BrowseRequestsScreen() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        const q = collection(db, "requests");

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const firebaseRequests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setRequests(firebaseRequests);
        });

        return unsubscribe;
    }, []);

    const toggleSelect = (userId) => {
        setSelectedUser((prev) => (prev === userId ? null : userId));
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image source={require("../assets/apple.png")} style={styles.logo} />
                <Text style={styles.headerTitle}>Browse Requests!</Text>

                {requests.map((req) => {
                    const isSelected = selectedUser === req.userId;

                    return (
                        <TouchableOpacity
                            key={req.id}
                            style={[
                                styles.requestBox,
                                isSelected && styles.selectedBox,
                            ]}
                            onPress={() => toggleSelect(req.userId)}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={styles.Username}>{req.username}</Text>
                                <Text style={styles.Request}>
                                    {Array.isArray(req.items)
                                        ? req.items.join(", ")
                                        : "No items"}
                                </Text>
                            </View>

                            <Image
                                source={require("../assets/profile.jpg")}
                                style={styles.userImage}
                            />
                        </TouchableOpacity>
                    );
                })}

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Confirm Selection</Text>
                </TouchableOpacity>
            </ScrollView>

            <BottomNavBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#faf1df",
    },
    scrollContainer: {
        paddingVertical: 30,
        paddingBottom: 100,
        alignItems: "center",
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 20,
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
        width: "90%",
    },
    selectedBox: {
        backgroundColor: "#FFC8C8",
    },
    Username: {
        fontWeight: "600",
        fontSize: 16,
        marginBottom: 3,
    },
    Request: {
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
        margin: 50,
        alignSelf: "center",
    },
    buttonText: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
});
