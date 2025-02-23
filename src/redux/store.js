import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./slices/coursesSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    courses: coursesReducer,
    user: userReducer
  }
});

export default store;
