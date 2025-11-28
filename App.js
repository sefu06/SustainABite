import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/LoginScreen";
import ChooseItemsScreen from "./screens/ChooseItemsScreen";
import BrowseRequestsScreen from "./screens/BrowseRequestsScreen";
import MakeRequestScreen from "./screens/MakeRequestScreen"
import RequestSubmittedSuccessfullyScreen from "./screens/RequestSubmittedSuccessfullyScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ProfileScreen from "./screens/ProfileScreen"
import ChatScreen from "./screens/ChatScreen";
import ChatListScreen from "./screens/ChatListScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="ChooseItemsScreen" component={ChooseItemsScreen} />
                <Stack.Screen name="BrowseRequestsScreen" component={BrowseRequestsScreen} />
                <Stack.Screen name="MakeRequestScreen" component={MakeRequestScreen} />
                <Stack.Screen name="RequestSubmittedSuccessfullyScreen" component={RequestSubmittedSuccessfullyScreen} />
                <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
                <Stack.Screen name="ChatListScreen" component={ChatListScreen} />
            </Stack.Navigator>
        </NavigationContainer>

    );
}
