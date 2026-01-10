import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import Carousel from "./components/Carousel.js";
import BottomNavBar from "./components/BottomNavBar.js";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ChooseItemsScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Image source={require("../assets/apple.png")} style={styles.logo} />

                <Text style={styles.headerTitle}>What are you craving today?</Text>

                <Text style={styles.text}>These were popular today...</Text>

                <Carousel />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("BrowseRequestsScreen")}>
                    <Text style={styles.buttonText}>Browse Requests</Text>
                </TouchableOpacity>

                <Text style={styles.text2}>Don't see the item you want?</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("MakeRequestScreen")}>
                    <Text style={styles.buttonText}>Submit A Request</Text>
                </TouchableOpacity>
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
        alignItems: "center",
        backgroundColor: "#faf1df",
        //justifyContent: "space-evenly",
        paddingVertical: 20,
        paddingBottom: 90, // Space for bottom nav bar
    },
    logo: {
        width: SCREEN_HEIGHT * 0.13,
        height: SCREEN_HEIGHT * 0.13,
        resizeMode: "contain",
        paddingBottom: 30,
    },
    headerTitle: {
        fontSize: SCREEN_HEIGHT * 0.025,
        fontWeight: "600",
        textAlign: "center",
        color: "#333",
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    text: {
        fontSize: SCREEN_HEIGHT * 0.02,
        color: "#555",
        textAlign: "center",
        
    },
    button: {
        backgroundColor: "#FF9A9A",
        paddingVertical: SCREEN_HEIGHT * 0.015,
        paddingHorizontal: 25,
        borderRadius: 10,
        alignSelf: "center",
        minWidth: "60%",
        marginBottom: 50
    },
    
    buttonText: {
        color: "#000000",
        fontSize: SCREEN_HEIGHT * 0.02,
        fontWeight: "600",
        textAlign: "center",
    },
    text2: {
        fontSize: SCREEN_HEIGHT * 0.018,
        color: "#555",
        textAlign: "center",
    },
});