import {View,  ScrollView, Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useState } from "react";
import BottomNavBar from "./components/BottomNavBar.js";
import SelectableItemList from "./components/SelectableItemList.js";
import { useNavigation } from "@react-navigation/native";

export default function ChooseItemsScreen() {
    const [selectedItems, setSelectedItems] = useState([]);
    const navigation = useNavigation();

    const produceItems = [
        { name: "Avocados", image: require("../assets/avocado.jpg") },
        { name: "Bananas", image: require("../assets/banana.jpg") },
        { name: "Apples", image: require("../assets/avocado.jpg") },
    ];

    const proteinItems = [
        { name: "Chicken", image: require("../assets/chicken.jpg") },
        { name: "Eggs", image: require("../assets/eggs.jpg") },
        { name: "Tofu", image: require("../assets/chicken.jpg") },
    ];

    const dairyItems = [
        { name: "Milk", image: require("../assets/milk.jpg") },
        { name: "Cheese", image: require("../assets/cheese.jpg") },
        { name: "Yogurt", image: require("../assets/yogurt.jpg") },
    ];

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image source={require("../assets/apple.png")} style={styles.logo} />
                <Text style={styles.headerTitle}>Choose what you want to share!</Text>

                <SelectableItemList
                    title="Fresh Produce"
                    items={produceItems}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                />

                <SelectableItemList
                    title="Protein"
                    items={proteinItems}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                />

                <SelectableItemList
                    title="Dairy"
                    items={dairyItems}
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                />

                <TouchableOpacity
                    style={styles.buttonSubmit}
                    onPress={() => navigation.navigate("RequestSubmittedSuccessfullyScreen")}
                >
                    <Text style={styles.buttonText}>Submit Request!</Text>
                </TouchableOpacity>
            </ScrollView>

          
            <BottomNavBar />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        paddingVertical: 30,
        paddingBottom: 100, // Extra padding so content doesn't hide behind navbar
        alignItems: "center",
        backgroundColor: "#faf1df",
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
    buttonSubmit: {
        backgroundColor: "#FF9A9A",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
        marginVertical: 20,
        alignSelf: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
        textAlign: "center",
    },
});