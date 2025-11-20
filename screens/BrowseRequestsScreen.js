import { View, ScrollView, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import BottomNavBar from "./components/BottomNavBar.js";

export default function BrowseRequestsScreen() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}> 

                                <Image source={require("../assets/apple.png")} style={styles.logo} />
                                <Text style={styles.headerTitle}>Browse Requests!</Text>

                
                <TouchableOpacity style={styles.requestBox} >
                    <Text style={styles.Username}>
                        Selina
                    </Text>
                    <Text style={styles.Request}>
                        apples, chicken
                    </Text>
                    <Image source={require("../assets/selina.png")}></Image>
                </TouchableOpacity>

            </ScrollView>

            <BottomNavBar/>

        </View>
       
        
    )
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
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    Username: {
        fontWeight: "600",
        marginRight: 10,
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