import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/LoginScreen";
import ChooseItemsScreen from "./screens/ChooseItemsScreen";
import DropDownScreen from "./screens/DropDownScreen";
import MakeRequestScreen from "./screens/MakeRequestScreen"

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="ChooseItemsScreen" component={ChooseItemsScreen} />
                <Stack.Screen name="DropDownScreen" component={DropDownScreen} />
                <Stack.Screen name= "MakeRequestScreen" component={MakeRequestScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
