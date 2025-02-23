import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: 1,
  name: "yati gautam",
  email: "yatigautam9412@gmail.com",
  enrolledCourses: [
    {
      courseId: "QbsJU9EojHiJfeuZ0cYR",
      progress: 60,
      enrollmentDate: "2024-01-15"
    },
    {
      courseId: "R8wfDLMRb2dWAGFKk1u0",
      progress: 30,
      enrollmentDate: "2024-02-01"
    },
  ]
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      markCourseCompleted: (state, action) => {
        const courseId = action.payload;
        const course = state.enrolledCourses.find(c => c.courseId === courseId);
        if (course) {
          course.progress = 100;
        }
      },
      updateCourseProgress: (state, action) => {
        const { courseId, progress } = action.payload;
        const course = state.enrolledCourses.find(c => c.courseId === courseId);
        if (course) {
          course.progress = progress;
        }
      },
      enrollInCourse: (state, action) => {
        const courseId = action.payload;
        if (!state.enrolledCourses.some(c => c.courseId === courseId)) {
          state.enrolledCourses.push({
            courseId,
            progress: 0,
            enrollmentDate: new Date().toISOString().split('T')[0]
          });
        }
      },
    },
  });

export const { markCourseCompleted, updateCourseProgress, enrollInCourse } = userSlice.actions;
export default userSlice.reducer;