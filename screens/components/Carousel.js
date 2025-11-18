import React, { useRef, useEffect } from "react";
import { View, ScrollView, Image, Text, StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Carousel() {
    const scrollRef = useRef();

    const items = [
        { label: "Avocados", image: require("../../assets/avocado.jpg") },
        { label: "Bananas", image: require("../../assets/banana.jpg") },
        { label: "Cheese", image: require("../../assets/cheese.jpg") },
    ];

    // Duplicate items for seamless looping
    const loopItems = [...items, ...items];

    const ITEM_WIDTH = 135; // width + marginRight
    const TOTAL_WIDTH = (loopItems.length / 2) * ITEM_WIDTH; // width of first set
    let scrollX = 0;

    useEffect(() => {
        let animationFrame;

        const animate = () => {
            scrollX += 1; // scroll speed, increase for faster
            if (scrollX > TOTAL_WIDTH) {
                scrollX = 0; // reset after first set
            }
            scrollRef.current.scrollTo({ x: scrollX, animated: false });
            animationFrame = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrame);
    }, []);

    return (
        <View style={{ width: SCREEN_WIDTH, overflow: "hidden" }}>
            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                scrollEnabled={false} // disable manual scroll
                contentContainerStyle={styles.row}
            >
                {loopItems.map((item, index) => (
                    <View style={styles.itemContainer} key={index}>
                        <View style={styles.rectangle} />
                        <Image source={item.image} style={styles.itemImage} />
                        <Text style={styles.itemLabel}>{item.label}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    row: { paddingHorizontal: 0 },
    itemContainer: {
        width: 120,
        height: 160,
        marginRight: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    itemImage: { width: 100, height: 100, borderRadius: 10, zIndex: 1 },
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
