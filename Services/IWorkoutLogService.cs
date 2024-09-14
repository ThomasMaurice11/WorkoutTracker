using WorkoutTracker.DTOs.WorkoutLog;

namespace WorkoutTracker.Services
{
    public interface IWorkoutLogService
    {
        Task<List<WorkoutLogDto>> GetAllWorkoutLogs(int exerciseId);
        Task<WorkoutLogDto> GetWorkoutLogById(int id);
        Task<WorkoutLogDto> AddWorkoutLog(CreateWorkoutLogDto logDto);
        Task UpdateWorkoutLog(UpdateWorkoutLogDto logDto);
        Task DeleteWorkoutLog(int id);
    }
}
