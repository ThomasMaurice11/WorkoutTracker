using Microsoft.EntityFrameworkCore;
using WorkoutTracker.Data;
using WorkoutTracker.DTOs.WorkoutCategory;
using WorkoutTracker.Models;

namespace WorkoutTracker.Services
{
    public class WorkoutCategoryService : IWorkoutCategoryService
    {
        private readonly DataContext _context;

        public WorkoutCategoryService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<WorkoutCategoryDto>> GetWorkoutCategories(string userId)
        {
            return await _context.WorkoutCategories
                .Where(c => c.UserId == userId)
                .Select(c => new WorkoutCategoryDto
                {
                    CategoryId = c.CategoryId,
                    Name = c.CategoryName
                }).ToListAsync();
        }

        public async Task<WorkoutCategoryDto> GetWorkoutCategoryById(int categoryId)
        {
            var category = await _context.WorkoutCategories.FindAsync(categoryId);
            if (category == null) return null;

            return new WorkoutCategoryDto
            {
                CategoryId = category.CategoryId,
                Name = category.CategoryName
            };
        }

        public async Task<WorkoutCategoryDto> AddWorkoutCategory(CreateWorkoutCategoryDto categoryDto, string userId)
        {
            var category = new WorkoutCategory
            {
                CategoryName = categoryDto.Name,
                UserId = userId
            };

            _context.WorkoutCategories.Add(category);
            await _context.SaveChangesAsync();

            return new WorkoutCategoryDto
            {
                CategoryId = category.CategoryId,
                Name = category.CategoryName
            };
        }

        public async Task UpdateWorkoutCategory(UpdateWorkoutCategoryDto categoryDto)
        {
            var category = await _context.WorkoutCategories.FindAsync(categoryDto.CategoryId);
            if (category == null) throw new ArgumentException("Category not found");

            category.CategoryName = categoryDto.Name;
            _context.Entry(category).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteWorkoutCategory(int categoryId)
        {
            var category = await _context.WorkoutCategories.FindAsync(categoryId);
            if (category != null)
            {
                _context.WorkoutCategories.Remove(category);
                await _context.SaveChangesAsync();
            }
        }
    }

    }
