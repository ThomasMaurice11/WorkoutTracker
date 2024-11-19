import React, { useState, useEffect } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Add from "../images/Add.png";
import Left from "../images/Left.png";
import X from "../images/X.png";

const ExercisePage = ({
  category,
  categoryId,
  navigateBack,
  navigateToExerciseStats,
}) => {
  const [exercises, setExercises] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newExercise, setNewExercise] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editedExercises, setEditedExercises] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) {
      setLoading(true);
      axios
        .get(
          `https://www.workouttracker.somee.com/api/Exercise/${categoryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .then((response) => {
          setExercises(response.data);
          setEditedExercises(response.data);
          setError("");
        })
        .catch((error) => {
          console.error("Error fetching exercises:", error);
          setError("Failed to fetch exercises. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [categoryId, token]);

  const handleAddExercise = () => {
    if (newExercise.trim() === "") {
      setError("Exercise name cannot be empty.");
      return;
    }

    axios
      .post(
        "https://www.workouttracker.somee.com/api/Exercise",
        {
          exerciseName: newExercise.trim(),
          categoryId: categoryId,
        },
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
          `https://www.workouttracker.somee.com/api/Exercise/${exercise.exerciseId}`,
          {
            exerciseId: exercise.exerciseId,
            exerciseName: exercise.exerciseName,
          },
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

  const handleDeleteExercise = (exerciseId) => {
    axios
      .delete(
        `https://www.workouttracker.somee.com/api/Exercise/${exerciseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setExercises(
          exercises.filter((exercise) => exercise.exerciseId !== exerciseId)
        );
        setEditedExercises(
          editedExercises.filter(
            (exercise) => exercise.exerciseId !== exerciseId
          )
        );
      })
      .catch((error) => {
        console.error("Error deleting exercise:", error);
        setError("Failed to delete exercise. Please try again.");
      });
  };

  const handleExerciseChange = (index, value) => {
    const updatedExercises = [...editedExercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      exerciseName: value,
    };
    setEditedExercises(updatedExercises);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedExercises = [...exercises];
    const [removed] = reorderedExercises.splice(result.source.index, 1);
    reorderedExercises.splice(result.destination.index, 0, removed);

    setExercises(reorderedExercises);
    setEditedExercises(reorderedExercises);
  };

  const handleExerciseClick = (exerciseName, exerciseId) => {
    navigateToExerciseStats(exerciseName, exerciseId);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-black min-h-screen">
      <header className="flex items-center text-xl mb-4 w-full">
        <button
          onClick={navigateBack}
          className="mr-6 bg-yellow-500 w-7 h-7 rounded-full flex items-center justify-center hover:bg-yellow-600 transition duration-300"
          aria-label="Back"
        >
          <img src={Left} alt="Back" className="w-3 h-3 sm:w-8 sm:h-8" />
        </button>
        <h1 className="font-monoton ml-2 text-yellow-500">
          {category} Exercises
        </h1>
        <button
          onClick={() => (editMode ? handleSaveEdits() : setEditMode(true))}
          className="ml-auto text-yellow-500 py-2 px-4 border border-yellow-500 rounded text-sm hover:bg-yellow-500 hover:text-black transition duration-300"
        >
          {editMode ? "Save" : "Edit"}
        </button>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="exercises">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg mt-5"
                >
                  {exercises.map((exercise, index) => (
                    <Draggable
                      key={exercise.exerciseId}
                      draggableId={exercise.exerciseId.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="relative"
                        >
                          {editMode ? (
                            <input
                              type="text"
                              value={editedExercises[index].exerciseName}
                              onChange={(e) =>
                                handleExerciseChange(index, e.target.value)
                              }
                              className="bg-white-900 text-black-400 text-lg font-semibold p-4 rounded-lg w-full mb-2 focus:outline-none focus:ring focus:ring-yellow-500"
                            />
                          ) : (
                            <button
                              className="bg-yellow-500 text-black-400 text-lg font-semibold p-3 rounded-2xl hover:bg-gray-800 transition duration-300 w-full mt-3"
                              onClick={() =>
                                handleExerciseClick(
                                  exercise.exerciseName,
                                  exercise.exerciseId
                                )
                              }
                            >
                              {exercise.exerciseName}
                            </button>
                          )}
                          {editMode && (
                            <button
                              className="absolute right-4 top-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full hover:bg-red-600 transition duration-300"
                              onClick={() =>
                                handleDeleteExercise(exercise.exerciseId)
                              }
                            >
                              <img src={X} alt="Delete" className="w-3.6 h-5" />
                            </button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <button
            className="mt-6 w-16 h-16  rounded-full flex items-center justify-center "
            onClick={() => setShowModal(true)}
          >
            <img src={Add} alt="Add Exercise" className="w-8 h-8" />
          </button>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="bg-black-900 p-6 rounded-lg shadow-lg w-11/12 sm:w-96 text-white">
            <h2 className="text-lg font-bold mb-4">Add New Exercise</h2>
            <input
              type="text"
              value={newExercise}
              onChange={(e) => setNewExercise(e.target.value)}
              placeholder="Enter exercise name"
              className="bg-white-800 text-black border border-gray-700 p-2 rounded mb-4 w-full focus:outline-none focus:ring focus:ring-yellow-500"
            />
            <div className="flex justify-end">
              <button
                onClick={handleAddExercise}
                className="bg-yellow-500 text-black py-2 px-4 rounded mr-2 hover:bg-yellow-600 transition duration-300"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePage;
