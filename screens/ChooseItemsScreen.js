import React, { useState } from "react";
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
