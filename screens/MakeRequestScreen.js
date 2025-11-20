import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";
import BottomNavBar from "./components/BottomNavBar.js";

export default function ChooseItemsScreen() {
    const [selectedItems, setSelectedItems] = useState([]);

    const produceItems = [
        { name: "Avodacos", image: require("../assets/avocado.jpg") },
        { name: "Bananas", image: require("../assets/banana.jpg") },
        { name: "Apples", image: require("../assets/avocado.jpg") },
       
    ];

    const toggleItem = (itemName) => {
        if (selectedItems.includes(itemName)) {
            setSelectedItems(selectedItems.filter((i) => i !== itemName));
        } else {
            setSelectedItems([...selectedItems, itemName]);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image source={require("../assets/apple.png")} style={styles.logo}></Image>
            
            <Text style={styles.headerTitle}>Choose what you want to share!</Text>

            <Text style={styles.foodType}>Fresh Produce:</Text>

            <View style={styles.itemsContainer}>
                {produceItems.map((item) => {
                    const isSelected = selectedItems.includes(item.name);
                    return (
                        <TouchableOpacity
                            key={item.name}
                            style={[
                                styles.itemButton,
                                isSelected && styles.itemButtonSelected,
                            ]}
                            onPress={() => toggleItem(item.name)}
                        >
                            <Image source={item.image} style={styles.itemImage} />
                            <Text
                                style={[
                                    styles.itemButtonText,
                                    isSelected && styles.itemButtonTextSelected,
                                ]}
                            >
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

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
    foodType: {
        fontSize: 18,
        fontWeight: "500",
        alignSelf: "flex-start",
        marginLeft: 20,
        marginBottom: 10,
        color: "#555",
    },
    itemsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: 20,
    },
    itemButton: {
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 5,
        alignItems: "center",
        flexDirection: "column",
        width: 100,
    },
    itemButtonSelected: {
        backgroundColor: "#4caf50",
        borderColor: "#4caf50",
    },
    itemButtonText: {
        color: "#333",
        fontWeight: "500",
        marginTop: 5,
        textAlign: "center",
    },
    itemButtonTextSelected: {
        color: "#fff",
    },
    itemImage: { width: 80, height: 100, borderRadius: 10, zIndex: 1 }
});
