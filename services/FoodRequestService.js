import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

class FoodRequestService {
  // Create new food request
  async createFoodRequest(userId, requestData) {
    try {
      const docRef = await firestore().collection('foodRequests').add({
        userId: userId,
        itemName: requestData.itemName,
        category: requestData.category,
        shareWith: requestData.shareWith,
        location: "UBC Campus",
        status: "active",
        description: requestData.description || "",
        createdAt: firestore.FieldValue.serverTimestamp(),
        expiresAt: firestore.Timestamp.fromDate(
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
        )
      });
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  // Get active food requests (excluding current user's)
  async getActiveFoodRequests(currentUserId) {
    try {
      const snapshot = await firestore()
        .collection('foodRequests')
        .where('status', '==', 'active')
        .where('userId', '!=', currentUserId)
        .where('expiresAt', '>', firestore.Timestamp.now())
        .orderBy('userId') 
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }

  // Get user's food requests
  async getUserFoodRequests(userId) {
    try {
      const snapshot = await firestore()
        .collection('foodRequests')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw error;
    }
  }

  // Update food request status
  async updateRequestStatus(requestId, status) {
    try {
      await firestore().collection('foodRequests').doc(requestId).update({
        status: status,
        updatedAt: firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new FoodRequestService();