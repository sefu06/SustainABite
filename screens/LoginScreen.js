import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from "react-native";
import { login, signup } from "../services/Auth";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); // For sign-up
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            navigation.navigate("ChooseItemsScreen");
        } catch (error) {
            Alert.alert("Login Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!email || !password || !username) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await signup(email, password, username);
            navigation.navigate("ChooseItemsScreen");
        } catch (error) {
            Alert.alert("Sign Up Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require("../assets/icon.png")} style={styles.logo} />
            </View>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? "Logging in..." : "Login"}
                </Text>
            </TouchableOpacity>

            <Text style={styles.title}>Don't have an account yet?</Text>

            <TouchableOpacity
                style={styles.signUpContainer}
                onPress={() => navigation.navigate("SignUpScreen")}
            >
                <Text style={styles.signUp}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#faf1df",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    logo: {
        width: 200,
        height: 100,
        resizeMode: "contain",
        marginBottom: 20,
    },
    input: {
        width: "80%",
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    button: {
        width: "80%",
        backgroundColor: "#ff5a5f",
        padding: 16,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 8,
    },
    signUpButton: {
        backgroundColor: "#00a86b", // Different color for sign-up
        marginTop: 12,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    title: {
        textAlign: "center",
        fontSize: 15,
        marginTop: 10,
        paddingHorizontal: 10,
    },
});
