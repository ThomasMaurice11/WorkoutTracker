using WorkoutTracker.DTOs.Exercise;

namespace WorkoutTracker.Services
{
    public interface IExerciseService
    {
        Task<List<ExerciseDto>> GetAllExercises(int categoryId);
        Task<ExerciseDto> GetExerciseById(int id);
        Task<ExerciseDto> AddExercise(CreateExerciseDto exerciseDto);
        Task UpdateExercise(UpdateExerciseDto exerciseDto);
        Task DeleteExercise(int id);
    }
}
