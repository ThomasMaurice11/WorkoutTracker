import React, { useState, useEffect } from "react";
import Add from "../images/Add.png";
import X from "../images/X.png";
import axios from "axios";

const HomePage = ({ navigateToExercises }) => {
  const [exercises, setExercises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newExercise, setNewExercise] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedExercises, setEditedExercises] = useState([]);
  const [setSelectedExercise] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      setLoading(true);
      axios
        .get("https://www.workouttracker.somee.com/api/WorkoutCategories", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setExercises(response.data);
          setEditedExercises(response.data);
          setError("");
        })
        .catch((error) => {
          console.error("Error fetching exercises:", error);
          setError("Failed to fetch workout categories. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No authentication token found.");
    }
  }, [token]);

  const handleAddExercise = () => {
    if (newExercise.trim() === "") {
      setError("Exercise name cannot be empty.");
      return;
    }
    if (exercises.some((exercise) => exercise.name === newExercise.trim())) {
      setError("Exercise already exists.");
      return;
    }

    axios
      .post(
        "https://www.workouttracker.somee.com/api/WorkoutCategories",
        { name: newExercise.trim() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setExercises([...exercises, response.data]);
        setEditedExercises([...editedExercises, response.data]);
        setNewExercise("");
        setShowModal(false);
        setError("");
      })
      .catch((error) => {
        console.error("Error adding exercise:", error);
        setError("Failed to add exercise. Please try again.");
      });
  };

  const handleSaveEdits = () => {
    editedExercises.forEach((exercise) => {
      axios
        .put(
          `https://www.workouttracker.somee.com/api/WorkoutCategories/${exercise.categoryId}`,
          { name: exercise.name, categoryId: exercise.categoryId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )
        .catch((error) => {
          console.error("Error updating exercise:", error);
          setError("Failed to update exercise. Please try again.");
        });
    });
    setExercises(editedExercises);
    setEditMode(false);
  };

  const handleDeleteExercise = (categoryId) => {
    axios
      .delete(
        `https://www.workouttracker.somee.com/api/WorkoutCategories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setExercises(
          exercises.filter((exercise) => exercise.categoryId !== categoryId)
        );
        setEditedExercises(
          editedExercises.filter(
            (exercise) => exercise.categoryId !== categoryId
          )
        );
        setSelectedExercise(null);
      })
      .catch((error) => {
        console.error("Error deleting exercise:", error);
        setError("Failed to delete exercise. Please try again.");
      });
  };

  const gridHeightClass = () => {
    if (exercises.length === 1) return "h-80";
    if (exercises.length === 2) return "h-80";
    return "h-full";
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setError("");
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center p-6 w-full h-screen bg-black">
      <div className="flex items-center justify-between w-full mb-6">
        <h1 className=" ml-1 text-3xl font-monoton text-yellow-500">
          Workout (msh hshlhaaa 3'ir mt3ml announce) h3ml kol youm page b2aa
          hahahaha{" "}
        </h1>
        <button
          onClick={handleLogout}
          className=" text-yellow-500 py-1 px-2 border border-yellow-500 rounded text-sm hover:bg-yellow-500 hover:text-black transition duration-300"
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div
            className={`grid grid-cols-2 md:grid-cols-2 gap-4 w-full ${gridHeightClass()}`}
          >
            {editMode
              ? editedExercises.map((exercise, index) => (
                  <div key={exercise.categoryId} className="relative">
                    <input
                      type="text"
                      value={exercise.name}
                      onChange={(e) => {
                        const updatedExercises = [...editedExercises];
                        updatedExercises[index] = {
                          ...updatedExercises[index],
                          name: e.target.value,
                        };
                        setEditedExercises(updatedExercises);
                      }}
                      className=" text-lg font-monoton p-4 rounded-lg w-full h-full mb-2"
                    />
                    <button
                      onClick={() => handleDeleteExercise(exercise.categoryId)}
                      className="absolute top-2 right-2 text-red-500"
                    >
                      <img src={X} alt="Delete" className="w-6 h-6" />
                    </button>
                  </div>
                ))
              : exercises.map((exercise) => (
                  <button
                    key={exercise.categoryId}
                    className="bg-yellow-400 text-xl font-monoton p-4 rounded-lg"
                    onClick={() =>
                      navigateToExercises(exercise.name, exercise.categoryId)
                    }
                  >
                    {exercise.name}
                  </button>
                ))}
          </div>

          <button
            className="mt-6 w-16 h-16 bg-white-500 rounded-full flex items-center justify-center hover:bg-gray-200 transition duration-300"
            onClick={() => setShowModal(true)}
          >
            <img src={Add} alt="Add Exercise" className="w-8 h-8" />
          </button>

          <button
            onClick={() => (editMode ? handleSaveEdits() : setEditMode(true))}
            className="ml-1\ text-yellow-500 py-2 px-4 rounded text-sm"
          >
            {editMode ? "Save" : "Edit"}
          </button>

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-black p-6 rounded-lg shadow-lg w-11/12 sm:w-96">
                <h2 className="text-lg font-bold mb-4 text-white">
                  Add New Workout
                </h2>
                <input
                  type="text"
                  value={newExercise}
                  onChange={(e) => setNewExercise(e.target.value)}
                  placeholder="Enter exercise name"
                  className="border border-gray-300 p-2 rounded mb-4 w-full"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleAddExercise}
                    className="bg-yellow-400 text-white py-2 px-4 rounded mr-2"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 text-black py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
