import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/homePage";
import Dashboard from "./pages/dashboard";
import CoursePage from "./pages/coursePage";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <Provider store={store}>
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/course/:id" element={<CoursePage />} />
          </Routes>
        </main>
      </div>
    </Router>
    </Provider>
  );
}

export default App;