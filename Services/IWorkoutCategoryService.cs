using WorkoutTracker.DTOs.WorkoutCategory;
using WorkoutTracker.Models;

namespace WorkoutTracker.Services
{
    public interface IWorkoutCategoryService
    {
        Task<List<WorkoutCategoryDto>> GetWorkoutCategories(string userId);
        Task<WorkoutCategoryDto> GetWorkoutCategoryById(int categoryId);
        Task<WorkoutCategoryDto> AddWorkoutCategory(CreateWorkoutCategoryDto categoryDto, string userId);
        Task UpdateWorkoutCategory(UpdateWorkoutCategoryDto categoryDto);
        Task DeleteWorkoutCategory(int categoryId);
    }

}
