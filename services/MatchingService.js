import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

class MatchingService {
  // Create a match between users
  async createMatch(requestId, requesterUserId, matchedUserId, itemName, matchPercentage = 95) {
    try {
      const docRef = await db.collection('matches').add({
        requestId: requestId,
        requesterUserId: requesterUserId,
        matchedUserId: matchedUserId,
        itemName: itemName,
        matchPercentage: matchPercentage,
        status: "pending",
        createdAt: firestore.FieldValue.serverTimestamp()
      });
      console.log('Match created with ID:', docRef.id);
    } catch (error) {
      console.error('Error creating match:', error);
    }
  }

  // Get matches for a user
  async getUserMatches(userId) {
    try {
      const snapshot = await firestore()
        .collection('matches')
        .where('requesterUserId', '==', userId)
        .orderBy('matchPercentage', 'desc')
        .get();

      const matches = [];
      for (const doc of snapshot.docs) {
        const matchData = doc.data();
        
        // Get matched user data
        const matchedUserDoc = await firestore()
          .collection('users')
          .doc(matchData.matchedUserId)
          .get();
        
        matches.push({
          id: doc.id,
          ...matchData,
          matchedUser: matchedUserDoc.data()
        });
      }
      
      return matches;
    } catch (error) {
      throw error;
    }
  }

  // Find potential matches for a food request
  async findMatches(userId, itemName, category) {
    try {
      // Get other users who might be interested in the same item
      const requests = await firestore()
        .collection('foodRequests')
        .where('itemName', '==', itemName)
        .where('status', '==', 'active')
        .where('userId', '!=', userId)
        .get();

      const matches = [];
      for (const doc of requests.docs) {
        const requestData = doc.data();
        
        // Get user data
        const userDoc = await firestore()
          .collection('users')
          .doc(requestData.userId)
          .get();
        
        if (userDoc.exists) {
          const matchPercentage = this.calculateMatchPercentage(itemName, category);
          
          matches.push({
            requestId: doc.id,
            userId: requestData.userId,
            user: userDoc.data(),
            matchPercentage: matchPercentage,
            itemName: itemName
          });
        }
      }
      
      // Sort by match percentage
      return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
    } catch (error) {
      throw error;
    }
  }

  // Simple match percentage calculation
  calculateMatchPercentage(itemName, category) {
    const baseMatch = 85;
    const randomVariation = Math.floor(Math.random() * 15); // 0-15
    return Math.min(baseMatch + randomVariation, 99);
  }

  // Accept a match
  async acceptMatch(matchId) {
    try {
      await firestore().collection('matches').doc(matchId).update({
        status: "accepted",
        acceptedAt: firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new MatchingService();