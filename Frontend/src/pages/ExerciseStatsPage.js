import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Left from "../images/Left.png";
import history from "../images/history.png";
import Add from "../images/Add.png";
import X from "../images/X.png";

const API_BASE_URL = "https://www.workouttracker.somee.com/api/WorkoutLog";

const ExerciseStatsPage = ({ exercise, exerciseId, navigateBack }) => {
  const [allHistory, setAllHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);

  const [editWorkout, setEditWorkout] = useState({
    reps: "",
    weight: "",
  });

  const [newWorkout, setNewWorkout] = useState({
    reps: "",
    weight: "",
  });

  const token = localStorage.getItem("authToken");

  const fetchWorkoutLogs = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${exerciseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setAllHistory(response.data || []);
    } catch (error) {
      console.error("Error fetching workout logs:", error);
    }
  }, [exerciseId, token]);

  useEffect(() => {
    fetchWorkoutLogs();
  }, [fetchWorkoutLogs]);

  const handleShowHistory = () => setShowHistory(true);
  const handleHideHistory = () => setShowHistory(false);

  const handleAddWorkout = async () => {
    if (newWorkout.reps && newWorkout.weight) {
      try {
        const response = await axios.post(
          API_BASE_URL,
          {
            exerciseId,
            weight: newWorkout.weight,
            reps: newWorkout.reps,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setAllHistory([response.data, ...allHistory]);
        setNewWorkout({
          reps: "",
          weight: "",
        });
        setShowAddModal(false);
      } catch (error) {
        console.error("Error adding workout log:", error);
      }
    }
  };

  const handleEditWorkout = async () => {
    if (editWorkout.reps && editWorkout.weight) {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/${currentEditIndex}`,
          {
            weight: editWorkout.weight,
            reps: editWorkout.reps,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const updatedHistory = allHistory.map((log) =>
          log.workoutLogId === currentEditIndex ? response.data : log
        );
        setAllHistory(updatedHistory);
        setEditWorkout({
          reps: "",
          weight: "",
        });
        setCurrentEditIndex(null);
        setShowEditModal(false);
      } catch (error) {
        console.error("Error updating workout log:", error);
      }
    }
  };

  const handleDeleteWorkout = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setAllHistory(allHistory.filter((log) => log.workoutLogId !== id));
    } catch (error) {
      console.error("Error deleting workout log:", error);
    }
  };

  const sortedHistory = [...allHistory].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const groupedHistory = sortedHistory.reduce((groups, workout) => {
    const date = workout.date.split("T")[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(workout);
    return groups;
  }, {});

  return (
    <div className="flex flex-col items-center p-6 bg-black text-white min-h-screen">
      <header className="flex items-center text-xl mb-4">
        <button
          onClick={navigateBack}
          className="mr-6 bg-yellow-500 w-7 h-7 rounded-full flex items-center justify-center hover:bg-yellow-600 transition duration-300"
          style={{ cursor: "pointer" }}
        >
          <img src={Left} alt="Back" className="w-3 h-3 sm:w-8 sm:h-8" />
        </button>
        <h1 className="font-monoton ml-2">{exercise} Stats</h1>
        <button
          onClick={handleShowHistory}
          className="ml-4 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ cursor: "pointer" }}
        >
          <img src={history} alt="History" className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </header>

      {showHistory ? (
        <div className="w-full max-w-lg space-y-6">
          <button
            onClick={handleHideHistory}
            className="bg-yellow-500 text-white p-2 rounded hover:bg-gray-600 transition duration-300"
          >
            Hide
          </button>
          {Object.keys(groupedHistory).length > 0 ? (
            Object.keys(groupedHistory).map((date) => (
              <div
                key={date}
                className="bg-yellow-400 text-black rounded-lg p-4"
              >
                <h3 className="text-center font-semibold mb-2">
                  Workout on {new Date(date).toLocaleDateString()}
                </h3>
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b-2 border-gray-800 p-2">Reps</th>
                      <th className="border-b-2 border-gray-800 p-2">Weight</th>
                      <th className="border-b-2 border-gray-800 p-2">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedHistory[date]
                      .slice()
                      .reverse()
                      .map((entry) => (
                        <tr key={entry.workoutLogId}>
                          <td className="p-2">{entry.reps}</td>
                          <td className="p-2">{entry.weight}</td>
                          <td className="p-2">
                            <button
                              onClick={() => {
                                setCurrentEditIndex(entry.workoutLogId);
                                setEditWorkout({
                                  reps: entry.reps,
                                  weight: entry.weight,
                                });
                                setShowEditModal(true);
                              }}
                              className="text-white p-2 rounded-full hover:bg-gray-600 transition duration-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteWorkout(entry.workoutLogId)
                              }
                              className="text-white p-2 rounded ml-2"
                            >
                              <img src={X} alt="Delete" className="w-6 h-6" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))
          ) : (
            <p>No workout history available.</p>
          )}
        </div>
      ) : (
        <div className="w-full max-w-lg space-y-6">
          {Object.keys(groupedHistory)
            .slice(0, 2)
            .map((date) => (
              <div
                key={date}
                className="bg-yellow-400 text-black rounded-lg p-4"
              >
                <h3 className="text-center font-semibold mb-2">
                  Workout on {new Date(date).toLocaleDateString()}
                </h3>
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b-2 border-gray-800 p-2">Reps</th>
                      <th className="border-b-2 border-gray-800 p-2">Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedHistory[date]
                      .slice()
                      .reverse()
                      .map((entry) => (
                        <tr key={entry.workoutLogId}>
                          <td className="p-2">{entry.reps}</td>
                          <td className="p-2">{entry.weight}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
        </div>
      )}

      <button
        className="mt-6 w-10 h-10  rounded-full flex items-center justify-center "
        onClick={() => setShowAddModal(true)}
      >
        <img src={Add} alt="Add Exercise" className="w-8 h-8" />
      </button>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-black p-6 rounded-lg">
            <div className="flex items-center">
              <h2 className="text-lg mb-4 mr-4">Add Workout</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white p-2 rounded hover:bg-gray-700 transition duration-300"
              >
                <img src={X} alt="Delete" className="w-6 h-6 ml-28 mb-4" />
              </button>
            </div>

            <label className="block mb-2">
              Reps:
              <input
                type="number"
                value={newWorkout.reps}
                onChange={(e) =>
                  setNewWorkout({ ...newWorkout, reps: e.target.value })
                }
                className="ml-6 p-1 rounded text-black"
              />
            </label>
            <label className="block mb-4 mr-2 ">
              Weight:
              <input
                type="number"
                value={newWorkout.weight}
                onChange={(e) =>
                  setNewWorkout({ ...newWorkout, weight: e.target.value })
                }
                className="ml-2 p-1 rounded text-black"
              />
            </label>
            <button
              onClick={handleAddWorkout}
              className="bg-yellow-500 text-black p-3 rounded hover:bg-yellow-600 transition duration-300 ml-20 w-1/2 text-lg"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-black p-6 rounded-lg">
            <h2 className="text-lg mb-4">Edit Workout</h2>
            <label className="block mb-2">
              Reps:
              <input
                type="number"
                value={editWorkout.reps}
                onChange={(e) =>
                  setEditWorkout({ ...editWorkout, reps: e.target.value })
                }
                className="ml-2 p-1 rounded"
              />
            </label>
            <label className="block mb-4">
              Weight:
              <input
                type="number"
                value={editWorkout.weight}
                onChange={(e) =>
                  setEditWorkout({ ...editWorkout, weight: e.target.value })
                }
                className="ml-2 p-1 rounded"
              />
            </label>
            <button
              onClick={handleEditWorkout}
              className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition duration-300"
            >
              Save
            </button>
            <button
              onClick={() => setShowEditModal(false)}
              className="ml-2 bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseStatsPage;
