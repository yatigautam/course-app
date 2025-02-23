import { createSlice } from '@reduxjs/toolkit';

const coursesSlice = createSlice({
  name: 'courses',
  initialState: [],
  reducers: {
    setCourses: (state, action) => {
      return action.payload;
    },
    updateCourse: (state, action) => {
      const index = state.findIndex(course => course.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    }
  }
});

export const { setCourses, updateCourse } = coursesSlice.actions;
export default coursesSlice.reducer;