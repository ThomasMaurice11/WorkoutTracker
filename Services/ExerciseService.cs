using WorkoutTracker.DTOs;
using WorkoutTracker.Models;
using Microsoft.EntityFrameworkCore;
using WorkoutTracker.DTOs.Exercise;
using WorkoutTracker.Data;

namespace WorkoutTracker.Services
{
    public class ExerciseService : IExerciseService
    {
        private readonly DataContext _context;

        public ExerciseService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<ExerciseDto>> GetAllExercises(int categoryId)
        {
            return await _context.Exercises
                .Where(e => e.CategoryId == categoryId)
                .Select(e => new ExerciseDto
                {
                    ExerciseId = e.ExerciseId,
                    ExerciseName = e.ExerciseName,
                    CategoryId = e.CategoryId
                }).ToListAsync();
        }

        public async Task<ExerciseDto> GetExerciseById(int id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise == null)
                return null;

            return new ExerciseDto
            {
                ExerciseId = exercise.ExerciseId,
                ExerciseName = exercise.ExerciseName,
                CategoryId = exercise.CategoryId
            };
        }

        public async Task<ExerciseDto> AddExercise(CreateExerciseDto exerciseDto)
        {
            var exercise = new Exercise
            {
                ExerciseName = exerciseDto.ExerciseName,
                CategoryId = exerciseDto.CategoryId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Exercises.Add(exercise);
            await _context.SaveChangesAsync();

            return new ExerciseDto
            {
                ExerciseId = exercise.ExerciseId,
                ExerciseName = exercise.ExerciseName,
                CategoryId = exercise.CategoryId
            };
        }

        public async Task UpdateExercise(UpdateExerciseDto exerciseDto)
        {
            var exercise = await _context.Exercises.FindAsync(exerciseDto.ExerciseId);
            if (exercise == null)
                throw new Exception("Exercise not found");

            exercise.ExerciseName = exerciseDto.ExerciseName;
            _context.Exercises.Update(exercise);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteExercise(int id)
        {
            var exercise = await _context.Exercises.FindAsync(id);
            if (exercise != null)
            {
                _context.Exercises.Remove(exercise);
                await _context.SaveChangesAsync();
            }
        }
    }
}
