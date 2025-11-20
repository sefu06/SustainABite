import { ScrollView, Image, StyleSheet, Text } from "react-native";
import { useState } from "react";
import BottomNavBar from "./components/BottomNavBar.js";
import SelectableItemList from "./components/SelectableItemList.js";

export default function ChooseItemsScreen() {
    const [selectedItems, setSelectedItems] = useState([]);

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
});
