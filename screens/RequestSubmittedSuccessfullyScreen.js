import { View, ScrollView, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import BottomNavBar from "./components/BottomNavBar.js";
import { useNavigation } from "@react-navigation/native";

export default function RequestSubmittedSuccessfullyScreen() {
      const navigation = useNavigation();
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
    

            <Image source={require("../assets/checkmark.png")} style={styles.checkmark} />
            <Text style={styles.text}> Your request has been succesfully made. You will be notified if a match has been made</Text>
            <BottomNavBar></BottomNavBar>
        
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
    checkmark: {
        width: 80,
        height: 80,
        marginBottom: 20,
        resizeMode: "contain",

    }, 

    text: {
        fontSize: 20,
        fontWeight: "600",
        marginBottom: 20,
        textAlign: "center",
        color: "#333",
        paddingHorizontal: 10,

    }


});