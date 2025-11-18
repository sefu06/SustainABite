import { View, Text, ScrollView, Image, StyleSheet} from "react-native";
import React from "react";

export default function ChooseItemsScreen() {
    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>

            <Image source={require("../assets/apple.png")} style={styles.logo}></Image>

            <Text style={styles.headerTitle}> What are you craving today? </Text>


        </ScrollView>

        
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#faf1df"
    },

    logo: {
        width: 100,
        height: 100,
        margin: 10,
        marginBottom: 30,
        marginTop: -50,
    } ,

    headerTitle: {
        fontStyle: "normal",
        fontWeight: "400", 
        lineHeight: "normal"

    }
});
