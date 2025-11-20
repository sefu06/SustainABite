import { View, ScrollView, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import BottomNavBar from "./components/BottomNavBar.js";

export default function BrowseRequestsScreen() {
    // Example data; later this can come from a database
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

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image source={require("../assets/apple.png")} style={styles.logo} />
                <Text style={styles.headerTitle}>Browse Requests!</Text>

                {/* Map over requests array */}
                {requests.map((req, index) => (
                    <TouchableOpacity key={index} style={styles.requestBox}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.Username}>{req.username}</Text>
                            <Text style={styles.Request}>{req.request}</Text>
                        </View>
                        <Image source={req.image} style={styles.userImage} />
                    </TouchableOpacity>
                ))}

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
        paddingBottom: 100, // space for navbar
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
        width: "90%", // make box take most of the screen width
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
});
