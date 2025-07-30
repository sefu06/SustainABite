import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuth } from "../hooks/useAuth";
import MatchingService from "../services/MatchingService";


export default function MatchScreen({ navigation }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        loadMatches();
      }, []);
    
      const loadMatches = async () => {
        try {
          setLoading(true);
          const userMatches = await MatchingService.getUserMatches(user.uid);
          const topMatches = userMatches.filter(match => match.matchPercentage >= 90);
          const otherMatches = userMatches.filter(match => match.matchPercentage < 90);
          
          setMatches({ topMatches, otherMatches });
        } catch (error) {
          Alert.alert("Error", "Failed to load matches: " + error.message);
          console.error("Error loading matches:", error);
        } finally {
          setLoading(false);
        }
      };
    
      const handleMatchPress = (match) => {
        navigation.navigate("MatchDetailScreen", { match });
      };
    
      if (loading) {
        return (
          <View style={[styles.container, styles.centerContent]}>
            <ActivityIndicator size="large" color="#ff5a5f" />
            <Text style={styles.loadingText}>Loading your matches...</Text>
          </View>
        );
      }
    
      const hasMatches = matches.topMatches?.length > 0 || matches.otherMatches?.length > 0;
    
  return (
    <View style={styles.container}>
        <Image source={require("../assets/icon.png")} style={styles.logo} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
      {hasMatches ? (
          <>
        <Text style={styles.checkmark}>✔️</Text>
        <Text style={styles.title}>SUCCESS! You have been matched with other students!</Text>

        {/* Top Matches */}
        {matches.topMatches?.length > 0 && (
              <>
        <Text style={styles.sectionTitle}>Top matches:</Text>
        {matches.topMatches.map((match, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: match.color }]}
            onPress={() => handleMatchPress(match)}
          >
            <Image
              source={require("../assets/selina.png")}
              style={styles.avatar}
            />
            <View style={styles.textContainer}>
              <Text style={styles.name}>
              {match.matchedUser?.displayName || "Anonymous"} ({match.matchPercentage}% match)
              </Text>
              <Text style={styles.description}>
                Hello! I am a {match.matchedUser?.year || "UBC"} student and I would love to connect with you to share {match.itemName}!
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        </>
            )}

        {/* Other Matches */}
        {matches.otherMatches?.length > 0 && (
              <>
        <Text style={styles.sectionTitle}>Other matches:</Text>
        {matches.otherMatches.map((match, index) => (
            <TouchableOpacity
                    key={match.id}
                    style={[styles.card, { backgroundColor: "#f08080" }]}
                    onPress={() => handleMatchPress(match)}
                  >
            <Image
              source={require("../assets/claire.png")}
              style={styles.avatar}
            />
            <View style={styles.textContainer}>
              <Text style={styles.name}>
              {match.matchedUser?.displayName || "Anonymous"} ({match.matchPercentage}% match)
              </Text>
              <Text style={styles.description}>
                Hello! I am a {match.matchedUser?.year || "UBC"} student and I would love to connect with you to share {match.itemName}!   
                </Text>
            </View>
            </TouchableOpacity>
        ))}
        </>
            )}
          </>
        ) : (
            <View style={styles.noMatchesContainer}>
              <Text style={styles.noMatchesTitle}>No matches yet!</Text>
              <Text style={styles.noMatchesText}>
                Submit a food request to get matched with other students.
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("ChooseItemsScreen")}
              >
                <Text style={styles.buttonText}>Create Request</Text>
              </TouchableOpacity>
            </View>
          )}
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
  },
  logo: {
    width: 100,
    height: 50,
    margin: 10
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  checkmark: {
    fontSize: 50,
    alignSelf: "center",
    marginBottom: 10,
    color: "#ff5a5f",
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  card: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
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
  name: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: "#333",
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