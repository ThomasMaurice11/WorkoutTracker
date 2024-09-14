using Microsoft.AspNetCore.Mvc;
using WorkoutTracker.DTOs;
using WorkoutTracker.Services;
using System.Security.Claims;
using WorkoutTracker.DTOs.WorkoutLog;
using Microsoft.AspNetCore.Authorization;

namespace WorkoutTracker.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class WorkoutLogController : ControllerBase
    {
        private readonly IWorkoutLogService _workoutLogService;

        public WorkoutLogController(IWorkoutLogService workoutLogService)
        {
            _workoutLogService = workoutLogService;
        }

        
        [HttpGet("{exerciseId}")]
        public async Task<IActionResult> GetWorkoutLogs(int exerciseId)
        {
            var logs = await _workoutLogService.GetAllWorkoutLogs(exerciseId);
            return Ok(logs);
        }

        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetWorkoutLogById(int id)
        {
            var log = await _workoutLogService.GetWorkoutLogById(id);
            if (log == null)
                return NotFound("Workout log not found.");

            return Ok(log);
        }

        [HttpPost]
        public async Task<IActionResult> CreateWorkoutLog([FromBody] CreateWorkoutLogDto logDto)
        {
         

            var createdLog = await _workoutLogService.AddWorkoutLog(logDto);
            return CreatedAtAction(nameof(GetWorkoutLogById), new { id = createdLog.WorkoutLogId }, createdLog);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorkoutLog(int id, [FromBody] UpdateWorkoutLogDto logDto)
        {
            logDto.WorkoutLogId = id;
            await _workoutLogService.UpdateWorkoutLog(logDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkoutLog(int id)
        {
            await _workoutLogService.DeleteWorkoutLog(id);
            return NoContent();
        }
    }
}
