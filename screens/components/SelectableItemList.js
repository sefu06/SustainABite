
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useState } from "react";

export default function SelectableItemList({ title, items, selectedItems, setSelectedItems }) {
    const toggleItem = (itemName) => {
        if (selectedItems.includes(itemName)) {
            setSelectedItems(selectedItems.filter((i) => i !== itemName));
        } else {
            setSelectedItems([...selectedItems, itemName]);
        }
    };

    return (
        <View style={{ width: "100%" }}>
            <Text style={styles.categoryTitle}>{title}</Text>
            <View style={styles.itemsContainer}>
                {items.map((item) => {
                    const isSelected = selectedItems.includes(item.name);
                    return (
                        <TouchableOpacity
                            key={item.name}
                            style={[styles.itemButton, isSelected && styles.itemButtonSelected]}
                            onPress={() => toggleItem(item.name)}
                        >
                            <Image source={item.image} style={styles.itemImage} />
                            <Text style={[styles.itemButtonText, isSelected && styles.itemButtonTextSelected]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    categoryTitle: {
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
        width: 100,
    },
    itemButtonSelected: {
        backgroundColor: "#FFC8C8",
        borderColor: "#FFC8C8",
    },
    itemButtonText: {
        color: "#333",
        fontWeight: "500",
        marginTop: 5,
        textAlign: "center",
    },
    itemButtonTextSelected: {
        color: "#333",
    },
    itemImage: { width: 80, height: 100, borderRadius: 10, zIndex: 1 },
});
