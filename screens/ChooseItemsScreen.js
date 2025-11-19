import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Carousel from "./components/Carousel.js";
import BottomNavBar from "./components/BottomNavBar.js";
import { useNavigation } from "@react-navigation/native";


export default function ChooseItemsScreen() {
    const navigation = useNavigation();
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>

            <Image source={require("../assets/apple.png")} style={styles.logo}></Image>

            <Text style={styles.headerTitle}> What are you craving today? </Text>

            <Text style={styles.text}> These were popular today...</Text>

            <Carousel />

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("DropDownScreen")}>

                <Text style={styles.buttonText}>Browse Requests</Text>

            </TouchableOpacity>


            <Text style={styles.text2}> Don't see the item you want? </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("DropDownScreen")}>

                <Text style={styles.buttonText}>Submit A request</Text>

            </TouchableOpacity>

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

    text: {
        fontSize: 16,
        color: "#555",
        marginTop: 100,
        marginBottom: 20,
        textAlign: "center"

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
        color: "#000000",
        fontSize: 16,
        fontWeight: "600",
    },

    text2: {
        marginTop: 40,
        marginBottom: -10

    }
});