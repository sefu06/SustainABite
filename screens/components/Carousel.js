import React from "react";
import { View, ScrollView, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Carousel() {
    const navigation = useNavigation();
    const items = [
        { label: "Avocados", image: require("../../assets/avocado.jpg") },
        { label: "Bananas", image: require("../../assets/banana.jpg") },
        { label: "Cheese", image: require("../../assets/cheese.jpg") },
        { label: "Apples", image: require("../../assets/avocado.jpg") },
        { label: "Oranges", image: require("../../assets/banana.jpg") }, // Add more items
    ];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollView}
        >
            {items.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.itemContainer}
                    onPress={() => navigation.navigate("BrowseRequestsScreen")}
                >
                    <View style={styles.rectangle} />
                    <Image source={item.image} style={styles.itemImage} />
                    <Text style={styles.itemLabel}>{item.label}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        marginVertical: 10,
        height: 140
    },
    scrollContent: {
        paddingHorizontal: 20,
        alignItems: "center",
    },
    itemContainer: {
        width: 120,
        height: 100,
        marginRight: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        zIndex: 1,
    },
    itemLabel: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: "500",
        color: "#333",
        textAlign: "center",
    },
    rectangle: {
        position: "absolute",
        width: 130,
        height: 150,
        backgroundColor: "#FFF1D8",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "black",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
});