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

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Fake login function (no Firebase)
    const fakeLogin = async (email, password) => {
        return new Promise((resolve) => setTimeout(resolve, 800));
    };

    const fakeRegister = async (email, password) => {
        return new Promise((resolve) => setTimeout(resolve, 800));
    };

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await fakeLogin(email, password);
            navigation.navigate("ChooseItemsScreen");
        } catch (error) {
            Alert.alert("Login Error", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await fakeRegister(email, password);
            navigation.navigate("ChooseItemsScreen");
        } catch (error) {
            Alert.alert("Signup Error", error.message);
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
                onPress={handleSignUp}
                disabled={loading}
            >
                <Text style={styles.signUp}>Sign up</Text>
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
        width: 400,
        height: 200,
        resizeMode: "contain",
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
    signUpContainer: {
        marginTop: 10,
        marginBottom: 24,
    },
    signUp: {
        textAlign: "center",
        fontSize: 15,
        textDecorationLine: "underline",
        marginBottom: 24,
    },
});
