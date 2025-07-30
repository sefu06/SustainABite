import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";

const foodItems = [
    { name: "Avocados", category: "Fresh Produce", image: require("../assets/avocado.jpg") },
    { name: "Bananas", category: "Fresh Produce", image: require("../assets/banana.jpg") },
    { name: "Eggs", category: "Protein", image: require("../assets/eggs.jpg") },
    { name: "Chicken Breast", category: "Protein", image: require("../assets/chicken.jpg") },
    { name: "Milk", category: "Dairy", image: require("../assets/milk.jpg") },
    { name: "Yogurt", category: "Dairy", image: require("../assets/yogurt.jpg") },
  ];

export default function DropDownScreen({ navigation }) {
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item

  const handleItemPress = (itemName) => {
    console.log(`${itemName} selected!`);
    setSelectedItem(itemName); 
  };

  const handleAddItem = () => {
    if (selectedItem) {
      navigation.navigate("ChooseItemsScreen", { selectedItem });
    } else {
      Alert.alert("Error", "Please select an item first");
    }
  };

  const getItemStyle = (item) => {
    return selectedItem?.name === item.name ? [styles.item, styles.selectedItem] : styles.item;
  };

  const groupedItems = foodItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo and title */}
        <Image source={require("../assets/icon.png")} style={styles.logo} />
        <Text style={styles.title}>What are you craving today?</Text>

        {/* Fresh Produce */}
        {Object.entries(groupedItems).map(([category, items]) => (
          <View key={category} style={styles.section}>
            <Text style={styles.sectionTitle}>{category}</Text>
            {items.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={getItemStyle(item)}
                onPress={() => handleItemPress(item)}
              >
                <Image source={item.image} style={styles.itemImage} />
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}


        {/* Add Item Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleAddItem}
        >
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChooseItemsScreen")}
        >
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("DropDown")}>
          <Text style={styles.navIcon}>🛒</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("MatchScreen")}>
          <Text style={styles.navIcon}>💬</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#faf1df",
    padding: 20,
    position: "relative",
  },
  scrollContent: {
    paddingBottom: 70, 
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  logo: {
    width: 100,
    height: 50,
    margin: 10,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fff", 
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  selectedItem: {
    backgroundColor: "#ffd6d6", 
  },
  itemImage: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#ff5a5f",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#ffe5e5",
    borderTopWidth: 1,
    borderTopColor: "#ffcccc",
    position: "absolute",
    bottom: 0,
    width: "118%",
  },
  navIcon: {
    fontSize: 30,
    color: "#ff5a5f",
    marginBottom: 20,
  },
});
