using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WorkoutTracker.DTOs.WorkoutCategory;
using WorkoutTracker.Models;
using WorkoutTracker.Services;

namespace WorkoutTracker.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class WorkoutCategoriesController : ControllerBase
    {
        private readonly IWorkoutCategoryService _workoutCategoryService;
        private readonly IJwtTokenService _jwtService;


        public WorkoutCategoriesController(IWorkoutCategoryService workoutCategoryService, IJwtTokenService jwtService)
        {
            _workoutCategoryService = workoutCategoryService;
            _jwtService = jwtService;

        }

        [HttpGet]
        public async Task<IActionResult> GetWorkoutCategories()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var userId = _jwtService.GetUserIdFromToken(token);
            var categories = await _workoutCategoryService.GetWorkoutCategories(userId);
            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWorkoutCategory(int id)
        {
            var category = await _workoutCategoryService.GetWorkoutCategoryById(id);
            if (category == null) return NotFound();
            return Ok(category);
        }

        [HttpPost]
        public async Task<IActionResult> AddWorkoutCategory(CreateWorkoutCategoryDto categoryDto)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            var userId = _jwtService.GetUserIdFromToken(token);
            var createdCategory = await _workoutCategoryService.AddWorkoutCategory(categoryDto, userId);
            return CreatedAtAction(nameof(GetWorkoutCategory), new { id = createdCategory.CategoryId }, createdCategory);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWorkoutCategory(int id, UpdateWorkoutCategoryDto categoryDto)
        {
            if (id != categoryDto.CategoryId) return BadRequest();
            await _workoutCategoryService.UpdateWorkoutCategory(categoryDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorkoutCategory(int id)
        {
            await _workoutCategoryService.DeleteWorkoutCategory(id);
            return NoContent();
        }
    }


}
