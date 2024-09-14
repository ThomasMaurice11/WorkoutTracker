using Microsoft.AspNetCore.Mvc;
using WorkoutTracker.DTOs;
using WorkoutTracker.Services;
using System.Security.Claims;
using WorkoutTracker.DTOs.Exercise;
using Microsoft.AspNetCore.Authorization;

namespace WorkoutTracker.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ExerciseController : ControllerBase
    {
        private readonly IExerciseService _exerciseService;

        public ExerciseController(IExerciseService exerciseService)
        {
            _exerciseService = exerciseService;
        }

        

        [HttpGet("{categoryId}")]
        public async Task<IActionResult> GetExercises(int categoryId)
        {
            var exercises = await _exerciseService.GetAllExercises(categoryId);
            return Ok(exercises);
        }

        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetExerciseById(int id)
        {
            var exercise = await _exerciseService.GetExerciseById(id);
            if (exercise == null)
                return NotFound("Exercise not found.");

            return Ok(exercise);
        }

        [HttpPost]
        public async Task<IActionResult> CreateExercise([FromBody] CreateExerciseDto exerciseDto)
        {
            
            

            var createdExercise = await _exerciseService.AddExercise(exerciseDto);
            return CreatedAtAction(nameof(GetExerciseById), new { id = createdExercise.ExerciseId }, createdExercise);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExercise(int id, [FromBody] UpdateExerciseDto exerciseDto)
        {
            exerciseDto.ExerciseId = id;
            await _exerciseService.UpdateExercise(exerciseDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExercise(int id)
        {
            await _exerciseService.DeleteExercise(id);
            return NoContent();
        }
    }
}
