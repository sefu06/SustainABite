import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import {
    collection,
    query,
    where,
    onSnapshot,
    deleteDoc,
    doc as firestoreDoc
} from "firebase/firestore";
import {
    View,
    ScrollView,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import BottomNavBar from "./components/BottomNavBar";
import { useProfileImage } from "./components/ProfileImageContext";
import { SafeAreaView } from "react-native";

export default function ProfileScreen() {
    const [myRequests, setMyRequests] = useState([]);
    const [userData, setUserData] = useState({ username: "", email: "" });
    const { profileImage, setProfileImage } = useProfileImage();
    const [selectedRequests, setSelectedRequests] = useState([]);
    const user = auth.currentUser;

    // Fetch user data
    useEffect(() => {
        if (!user) return;

        const fetchUserData = async () => {
            try {
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const data = userDoc.data();
                    console.log("Fetched user data:", data);
                    setUserData({
                        username: data.username || "(No username)",
                        email: data.email || user.email,
                    });
                    if (data.profileImage) setProfileImage(data.profileImage);
                } else {
                    await setDoc(userRef, { username: "", email: user.email });
                    setUserData({ username: "(No username)", email: user.email });
                }
            } catch (error) {
                console.log("Error fetching user data:", error.message);
            }
        };

        fetchUserData();
    }, [user]);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "requests"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log("My requests:", requests);
            setMyRequests(requests);
        });

        return unsubscribe;
    }, [user]);

    // Toggle request selection
    const toggleRequestSelection = (requestId) => {
        setSelectedRequests((prev) => {
            if (prev.includes(requestId)) {
                return prev.filter((id) => id !== requestId);
            } else {
                return [...prev, requestId];
            }
        });
    };

    // Delete selected requests
    const handleDeleteRequests = async () => {
        if (selectedRequests.length === 0) return;

        Alert.alert(
            "Delete Requests",
            `Are you sure you want to delete ${selectedRequests.length} request(s)?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const deletePromises = selectedRequests.map((requestId) =>
                                deleteDoc(firestoreDoc(db, "requests", requestId))
                            );

                            await Promise.all(deletePromises);

                            Alert.alert("Success", "Requests deleted successfully!");
                            setSelectedRequests([]);
                        } catch (error) {
                            console.error("Error deleting requests:", error);
                            Alert.alert("Error", "Failed to delete requests");
                        }
                    },
                },
            ]
        );
    };

    // Handle profile picture change
    const handlePickImage = async () => {
        try {
            console.log("Starting image picker...");
            let uri;
            let blob;

            if (Platform.OS === "web") {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";

                const file = await new Promise((resolve, reject) => {
                    input.onchange = () => {
                        if (input.files[0]) {
                            resolve(input.files[0]);
                        } else {
                            reject(new Error("No file selected"));
                        }
                    };
                    input.onerror = reject;
                    input.click();
                });

                uri = URL.createObjectURL(file);
                blob = file;
                setProfileImage(uri);
            } else {
                const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!permission.granted) {
                    Alert.alert("Permission required", "Please allow access to photos");
                    return;
                }

                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.7,
                });

                if (result.canceled) {
                    console.log("Image picker cancelled");
                    return;
                }

                uri = result.assets[0].uri;
                console.log("Selected image URI:", uri);

                const response = await fetch(uri);
                blob = await response.blob();
                console.log("Blob created:", blob.type, blob.size);

                setProfileImage(uri);
            }

            if (!user) {
                throw new Error("User not authenticated");
            }

            const storage = getStorage();
            const fileName = `profileImages/${user.uid}_${Date.now()}.jpg`;
            const storageRef = ref(storage, fileName);

            console.log("Uploading to:", fileName);

            const metadata = {
                contentType: blob.type || "image/jpeg",
            };

            await uploadBytes(storageRef, blob, metadata);
            console.log("Upload successful!");

            const downloadURL = await getDownloadURL(storageRef);
            console.log("Download URL:", downloadURL);

            await setDoc(
                doc(db, "users", user.uid),
                { profileImage: downloadURL },
                { merge: true }
            );

            setProfileImage(downloadURL);
            Alert.alert("Success!", "Profile picture updated!");
        } catch (error) {
            console.error("Full error:", error);

            if (error.code === "storage/unauthorized") {
                Alert.alert("Permission Denied", "Please check Firebase Storage rules");
            } else if (error.code === "storage/canceled") {
                console.log("Upload cancelled");
            } else {
                Alert.alert("Upload failed", error.message || "Unknown error occurred");
            }
        }
    };

    return (
        <SafeAreaView style = {styles.safeArea}>
        <View style={{ flex: 1, backgroundColor: "#faf1df" }}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <TouchableOpacity onPress={handlePickImage}>
                    <Image
                        source={
                            profileImage
                                ? { uri: profileImage }
                                : require("../assets/profile.jpg")
                        }
                        style={styles.profileImage}
                    />
                </TouchableOpacity>

                <TouchableOpacity onPress={handlePickImage}>
                    <Text style={styles.changePic}>Change profile picture</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>{userData.username}</Text>
                <Text style={styles.email}>{userData.email}</Text>

                <Text style={styles.requestsTitle}>My Requests:</Text>

                {myRequests.length === 0 ? (
                    <Text style={styles.emptyText}>
                        You have no requests yet.
                    </Text>
                ) : (
                    <>
                        {myRequests.map((req) => {
                            const isSelected = selectedRequests.includes(req.id);
                            return (
                                <TouchableOpacity
                                    key={req.id}
                                    style={[
                                        styles.requestBox,
                                        isSelected && styles.requestBoxSelected,
                                    ]}
                                    onPress={() => toggleRequestSelection(req.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.requestContent}>
                                        <View
                                            style={[
                                                styles.checkbox,
                                                isSelected && styles.checkboxSelected,
                                            ]}
                                        >
                                            {isSelected && (
                                                <Text style={styles.checkmark}>✓</Text>
                                            )}
                                        </View>
                                        <Text style={styles.requestItems}>
                                            {Array.isArray(req.items)
                                                ? req.items.join(", ")
                                                : "No items"}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}

                        {selectedRequests.length > 0 && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={handleDeleteRequests}
                            >
                                <Text style={styles.deleteButtonText}>
                                    Delete {selectedRequests.length} Request
                                    {selectedRequests.length > 1 ? "s" : ""}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>

           
            </View>
            <BottomNavBar />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#faf1df",
    },
    scrollContainer: {
        flexGrow: 1,
        alignItems: "center",
        backgroundColor: "#faf1df",
        paddingVertical: 30,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        backgroundColor: "#ddd",
    },
    changePic: {
        fontSize: 14,
        color: "#555",
        marginBottom: 20,
        textAlign: "center",
        textDecorationLine: "underline"
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 10,
        color: "#333",
    },
    email: {
        fontSize: 16,
        color: "#555",
        marginBottom: 20,
    },
    requestsTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 20,
        marginBottom: 10,
        color: "#333",
    },
    requestBox: {
        width: "90%",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: "transparent",
    },
    requestBoxSelected: {
        borderColor: "#FF9A9A",
        backgroundColor: "#FFF5F5",
    },
    requestContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#ddd",
        marginRight: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxSelected: {
        backgroundColor: "#FF9A9A",
        borderColor: "#FF9A9A",
    },
    checkmark: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    requestItems: {
        fontSize: 15,
        color: "#444",
        lineHeight: 20,
        flex: 1,
    },
    emptyText: {
        color: "#777",
        marginTop: 10,
        fontStyle: "italic",
    },
    deleteButton: {
        backgroundColor: "#ff4444",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    deleteButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});