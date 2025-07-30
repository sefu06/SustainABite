import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../hooks/useAuth";
import MatchingService from "../services/MatchingService";
import FoodRequestService from "../services/FoodRequestService";

export default function ShoppingCartConfirmation() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate finding matches after request submission
    findMatches();
  }, []);

  const findMatches = async () => {
    try {
      setLoading(true);
      
      // Get user's latest food request
      const userRequests = await FoodRequestService.getUserFoodRequests(user.uid);
      const latestRequest = userRequests[0];
      
      if (latestRequest) {
        // Find potential matches
        const potentialMatches = await MatchingService.findMatches(
          user.uid,
          latestRequest.itemName,
          latestRequest.category
        );
        
        // Create matches for the top candidates
        const createdMatches = [];
        for (const potentialMatch of potentialMatches.slice(0, 4)) { // Top 4 matches
          try {
            const matchId = await MatchingService.createMatch(
              latestRequest.id,
              user.uid,
              potentialMatch.userId,
              latestRequest.itemName,
              potentialMatch.matchPercentage
            );
            createdMatches.push({
              id: matchId,
              ...potentialMatch
            });
          } catch (error) {
            console.error("Error creating match:", error);
          }
        }
        
        setMatches(createdMatches);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to find matches: " + error.message);
      console.error("Error finding matches:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require("../assets/icon.png")} style={styles.logo} />
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        <Text style={styles.title}>{loading ? "Finding your matches..." : "You have successfully matched!"}</Text>
        <Image source={require("../assets/unicorn.png")} style={styles.image} />

        {!loading && (
          <Text style={styles.subtitle}>
            Found {matches.length} potential matches for you!
          </Text>
        )}

        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={() => navigation.navigate("MatchScreen")} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Finding Matches..." : "See Your Matches"}</Text>
        </TouchableOpacity>
      </View>

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
  },
  header: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40, 
  },
  logo: {
    width: 120,
    height: 60,
    marginBottom: 30,
  },
  main: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    marginBottom: 20,
    textAlign: "center",
    color: "#ff5a5f",
    textShadowColor: "#f8e0e0",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  image: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginBottom: 30,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  button: {
    width: "75%",
    backgroundColor: "#ff5a5f", 
    paddingVertical: 16,
    borderRadius: 30, 
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    backgroundColor: "#ffe5e5",
    borderTopWidth: 1,
    borderTopColor: "#ffcccc",
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderRadius: 15, 
  },
  navIcon: {
    fontSize: 30,
    color: "#ff5a5f",
    marginBottom: 10,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noMatchesContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noMatchesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff5a5f',
  },
  noMatchesText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    paddingHorizontal: 20,
  },
  selectedItemContainer: {
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
    alignSelf: "center",
    width: "80%",
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
});
