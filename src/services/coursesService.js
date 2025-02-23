import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  increment,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase/config";

const COURSES_COLLECTION = "courses";

export const coursesService = {
  // Get all courses with real-time updates
  subscribeToAllCourses: (callback) => {
    const coursesRef = collection(db, COURSES_COLLECTION);
    return onSnapshot(coursesRef, (snapshot) => {
      const courses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(courses);
    });
  },

  // Get single course with real-time updates
  subscribeToCourse: (courseId, callback) => {
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    return onSnapshot(courseRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  },

  // Get course by ID (one-time fetch)
  getCourseById: async (courseId) => {
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    const courseDoc = await getDoc(courseRef);
    if (courseDoc.exists()) {
      return { id: courseDoc.id, ...courseDoc.data() };
    }
    return null;
  },

  // Update course enrollment
  updateCourseEnrollment: async (courseId, studentData) => {
    try {
      const courseRef = doc(db, COURSES_COLLECTION, courseId);
      const courseDoc = await getDoc(courseRef);

      if (courseDoc.exists()) {
        const currentStudents = courseDoc.data().students || [];
        // Check if student is already enrolled
        if (!currentStudents.some((student) => student.id === studentData.id)) {
          await updateDoc(courseRef, {
            students: [...currentStudents, studentData],
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error updating course enrollment:", error);
      throw error;
    }
  },

  // Get enrolled students for a course
  getEnrolledStudents: async (courseId) => {
    try {
      const courseRef = doc(db, COURSES_COLLECTION, courseId);
      const courseDoc = await getDoc(courseRef);

      if (courseDoc.exists()) {
        return courseDoc.data().students || [];
      }
      return [];
    } catch (error) {
      console.error("Error getting enrolled students:", error);
      throw error;
    }
  },

  // Update course details
  updateCourseDetails: async (courseId, updateData) => {
    try {
      const courseRef = doc(db, COURSES_COLLECTION, courseId);
      await updateDoc(courseRef, updateData);
      return true;
    } catch (error) {
      console.error("Error updating course details:", error);
      throw error;
    }
  },
  // Toggle like for a course
  toggleCourseLike: async (courseId, userId) => {
    const courseRef = doc(db, COURSES_COLLECTION, courseId);
    const courseDoc = await getDoc(courseRef);

    if (courseDoc.exists()) {
      const courseData = courseDoc.data();
      const likedBy = courseData.likedBy || [];
      const isLiked = likedBy.includes(userId);

      await updateDoc(courseRef, {
        likes: increment(isLiked ? -1 : 1),
        likedBy: isLiked ? arrayRemove(userId) : arrayUnion(userId),
      });
    }
  },
};
