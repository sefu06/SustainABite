import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BottomNavBar() {
    const navigation = useNavigation();

    return (
        <View style={styles.navBar}>
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Image
                    source={require("../../assets/home.png")}
                    style={styles.icon}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Requests")}>
                <Image
                    source={require("../../assets/chat.png")}
                    style={styles.icon}
                />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                <Image
                    source={require("../../assets/gianna.png")}
                    style={styles.icon}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    navBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 70,
        backgroundColor: "#FF9A9A",
        borderTopWidth: 1,
        borderColor: "#ddd",
        position: "absolute",
        bottom: 0,
        width: "100%",
        paddingBottom: 10,
    },
    icon: {
        width: 30,
        height: 30,
        resizeMode: "contain",
    },
});