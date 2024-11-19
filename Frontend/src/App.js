import React, { useState, useEffect } from "react";
import HomePage from "./pages/HomePage";
import ExercisePage from "./pages/ExercisePage";
import ExerciseStatsPage from "./pages/ExerciseStatsPage";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";

const App = () => {
  const [currentPage, setCurrentPage] = useState("login");
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [selectedExerciseId, setSelectedExerciseId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedHistory = JSON.parse(
      localStorage.getItem("navigationHistory") || "[]"
    );
    const storedPage = localStorage.getItem("currentPage") || "login";

    if (token) {
      setCurrentPage(storedPage === "login" ? "home" : storedPage);
    } else {
      setCurrentPage("login");
    }

    setNavigationHistory(storedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "navigationHistory",
      JSON.stringify(navigationHistory)
    );
  }, [navigationHistory]);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  const navigateToPage = (page) => {
    setNavigationHistory((prev) => [...prev, currentPage]);
    setCurrentPage(page);
  };

  const navigateToExercises = (categoryName, categoryId) => {
    setSelectedCategory(categoryName);
    setSelectedCategoryId(categoryId);
    navigateToPage("exercises");
  };

  const navigateToExerciseStats = (exercise, exerciseId) => {
    setSelectedExercise(exercise);
    setSelectedExerciseId(exerciseId);
    navigateToPage("exerciseStats");
  };

  const navigateBack = () => {
    if (navigationHistory.length > 0) {
      const previousPage = navigationHistory[navigationHistory.length - 1];
      setCurrentPage(previousPage);
      setNavigationHistory((prev) => prev.slice(0, -1));
    } else {
      setCurrentPage("home");
    }
  };

  return (
    <div className="App">
      {currentPage === "home" && (
        <HomePage navigateToExercises={navigateToExercises} />
      )}
      {currentPage === "exercises" && (
        <ExercisePage
          category={selectedCategory}
          categoryId={selectedCategoryId}
          navigateBack={navigateBack}
          navigateToExerciseStats={navigateToExerciseStats}
        />
      )}

      {currentPage === "exerciseStats" && (
        <ExerciseStatsPage
          exercise={selectedExercise}
          exerciseId={selectedExerciseId}
          navigateBack={navigateBack}
        />
      )}
      {currentPage === "login" && <LoginPage navigateTo={navigateToPage} />}
      {currentPage === "register" && (
        <RegisterPage navigateTo={navigateToPage} />
      )}
    </div>
  );
};

export default App;
