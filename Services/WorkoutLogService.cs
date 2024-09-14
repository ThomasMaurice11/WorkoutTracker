using WorkoutTracker.DTOs;
using WorkoutTracker.Models;
using Microsoft.EntityFrameworkCore;
using WorkoutTracker.DTOs.WorkoutLog;
using WorkoutTracker.Data;

namespace WorkoutTracker.Services
{
    public class WorkoutLogService : IWorkoutLogService
    {
        private readonly DataContext _context;

        public WorkoutLogService(DataContext context)
        {
            _context = context;
        }

        public async Task<List<WorkoutLogDto>> GetAllWorkoutLogs(int exerciseId)
        {
            return await _context.WorkoutLogs
                .Where(wl => wl.ExerciseId == exerciseId)
                .Select(wl => new WorkoutLogDto
                {
                    WorkoutLogId = wl.WorkoutLogId,
                    Date = wl.Date,
                    Weight = wl.Weight,
                    Reps = wl.Reps,
                    ExerciseId = wl.ExerciseId
                }).ToListAsync();
        }

        public async Task<WorkoutLogDto> GetWorkoutLogById(int id)
        {
            var log = await _context.WorkoutLogs.FindAsync(id);
            if (log == null)
                return null;

            return new WorkoutLogDto
            {
                WorkoutLogId = log.WorkoutLogId,
                Date = log.Date,
                Weight = log.Weight,
                Reps = log.Reps,
                ExerciseId = log.ExerciseId
            };
        }

        public async Task<WorkoutLogDto> AddWorkoutLog(CreateWorkoutLogDto logDto)
        {
            var log = new WorkoutLog
            {
                Date = DateTime.UtcNow,
                Weight = logDto.Weight,
                Reps = logDto.Reps,
                ExerciseId = logDto.ExerciseId
            };

            _context.WorkoutLogs.Add(log);
            await _context.SaveChangesAsync();

            return new WorkoutLogDto
            {
                WorkoutLogId = log.WorkoutLogId,
                Date = log.Date,
                Weight = log.Weight,
                Reps = log.Reps,
                ExerciseId = log.ExerciseId
            };
        }

        public async Task UpdateWorkoutLog(UpdateWorkoutLogDto logDto)
        {
            var log = await _context.WorkoutLogs.FindAsync(logDto.WorkoutLogId);
            if (log == null)
                throw new Exception("Workout log not found");

            log.Date = logDto.Date;
            log.Weight = logDto.Weight;
            log.Reps = logDto.Reps;

            _context.WorkoutLogs.Update(log);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteWorkoutLog(int id)
        {
            var log = await _context.WorkoutLogs.FindAsync(id);
            if (log != null)
            {
                _context.WorkoutLogs.Remove(log);
                await _context.SaveChangesAsync();
            }
        }
    }
}
