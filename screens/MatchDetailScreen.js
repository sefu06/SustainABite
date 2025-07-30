import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Linking } from "react-native";
import { useAuth } from "../hooks/useAuth";
import MatchingService from "../services/MatchingService";
import AuthService from "../services/AuthService";

const handleJoinPress = () => {
  Linking.openURL("https://www.foodstash.ca/");
};

export default function MatchDetailScreen({ navigation, route }) {
    const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, userData, updateUserData } = useAuth();
  const match = route.params?.match;

  useEffect(() => {
    if (match) {
      setMatchData(match);
    }
  }, [match]);

  const handleAcceptMatch = async () => {
    try {
      setLoading(true);
      
      // Accept the match
      await MatchingService.acceptMatch(matchData.id);
      
      // Update user's total items traded
      const newTotal = (userData?.totalItemsTraded || 0) + 1;
      await updateUserData(user.uid, { totalItemsTraded: newTotal });
      
      Alert.alert(
        "Match Accepted!",
        "You have successfully connected with your match. Check your Instagram for further communication!",
        [{ text: "OK", onPress: () => navigation.navigate("ChooseItemsScreen") }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to accept match: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!matchData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading match details...</Text>
      </View>
    );
  }

  const matchedUser = matchData.matchedUser;

  return (
    <View style={styles.container}>
      <Image source={require("../assets/icon.png")} style={styles.logo} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.checkmark}>✔️</Text>
        <Text style={styles.title}>
        You have matched with {matchedUser?.displayName || "a student"}!
        </Text>

        {/* Match Card */}
        <View style={styles.card}>
          <Image
            source={require("../assets/selina.png")}
            style={styles.avatar}
          />
          <View style={styles.textContainer}>
            <Text style={styles.name}>{matchedUser?.displayName || "Anonymous"}</Text>
            <Text style={styles.description}>
                Hello! I am a {matchedUser?.year || "UBC"} student and I would love to connect
                with you to share {matchData.itemName}!
            </Text>
          </View>
        </View>

        {/* Contact Info and Specific Requests */}
        <View style={styles.dashboard}>
          {/* Contact Info */}
          <View style={styles.sectionLeft}>
            <Text style={styles.sectionTitle}>Contact info:</Text>
            <Text style={styles.handle}>@{matchedUser?.instagramHandle || "ubcstudent123"}</Text>
            <TouchableOpacity style={styles.instagramButton}>
              <Text style={styles.buttonText}>Instagram</Text>
            </TouchableOpacity>
          </View>

          {/* Specific Requests */}
          <View style={styles.sectionRight}>
            <Text style={styles.sectionTitle}>Specific Requests:</Text>
            <Text style={styles.requestText}>
            {matchedUser?.preferences?.specificRequests || 
               `I'm looking forward to sharing ${matchData.itemName} with you. Let's coordinate!`}
            </Text>
          </View>
        </View>

        {/* Accept Match Button */}
        {matchData.status === "pending" && (
          <TouchableOpacity
            style={[styles.acceptButton, loading && styles.buttonDisabled]}
            onPress={handleAcceptMatch}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Accepting..." : "Accept Match"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.title}>THANK YOU FOR USING SustainABite!</Text>
          <Text style={styles.requestText}>Have food at home that might go bad soon? Contact Food Stash!</Text>
          <TouchableOpacity style={styles.joinButton} onPress={handleJoinPress}>
            <Text style={styles.buttonText}>Join the Cause</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate("ChooseItemsScreen")}>
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
    textAlign: "center",
  },
  logo: {
    width: 100,
    height: 50,
    margin: 10,
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  checkmark: {
    fontSize: 50,
    alignSelf: "center",
    color: "#ff5a5f",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f4a5a5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  dashboard: {
    flexDirection: "row",
    justifyContent: "space-between", // Space out contact info and requests
    backgroundColor: "#ffe5e5",
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionLeft: {
    flex: 1,
    paddingRight: 10,
    alignItems: "flex-start", // Align text to the left
  },
  sectionRight: {
    flex: 1,
    paddingLeft: 10,
    alignItems: "flex-end", // Align text to the right
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  handle: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
  },
  instagramButton: {
    backgroundColor: "#ff5a5f",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
  },
  requestText: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 10,
  },
  joinButton: {
    backgroundColor: "#ff5a5f",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
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
    width: "100%",
  },
  navIcon: {
    fontSize: 30,
    color: "#ff5a5f",
    marginBottom: 20,
  },
});
