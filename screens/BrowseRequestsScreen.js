import { View, ScrollView, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import BottomNavBar from "./components/BottomNavBar.js";

export default function BrowseRequestsScreen() {
    const [selectedUser, setSelectedUser] = useState(null);   // Track selected user

    const requests = [
        {
            username: "Selina",
            request: "apples, chicken",
            image: require("../assets/selina.png"),
        },
        {
            username: "Gianna",
            request: "bananas, eggs",
            image: require("../assets/gianna.png"),
        },
    ];

    // Handle selection toggle
    const toggleSelect = (username) => {
        if (selectedUser === username) {
            setSelectedUser(null);  // unselect
        } else {
            setSelectedUser(username); // select
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image source={require("../assets/apple.png")} style={styles.logo} />
                <Text style={styles.headerTitle}>Browse Requests!</Text>

                {requests.map((req, index) => {
                    const isSelected = selectedUser === req.username;

                    return (
                        <TouchableOpacity
                            //
                            style={[
                                styles.requestBox,
                                isSelected && styles.selectedBox,   // highlight if selected
                            ]}
                            onPress={() => toggleSelect(req.username)}
                        >
                            <View style={{ flex: 1 }}>
                                <Text style={styles.Username}>{req.username}</Text>
                                <Text style={styles.Request}>{req.request}</Text>
                            </View>
                            <Image source={req.image} style={styles.userImage} />
                        </TouchableOpacity>
                    );
                })}

                <TouchableOpacity
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>
                        Confirm Selection
                    </Text>
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
