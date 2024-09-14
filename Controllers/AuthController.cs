using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WorkoutTracker.DTOs;
using WorkoutTracker.Models;
using WorkoutTracker.Services;

[Route("api/[controller]")]

[ApiController]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly JwtTokenService _jwtTokenService;

    public AuthController(UserManager<ApplicationUser> userManager, JwtTokenService jwtTokenService)
    {
        _userManager = userManager;
        _jwtTokenService = jwtTokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterModel model)
    {
        if (ModelState.IsValid)
        {
            var user = new ApplicationUser { UserName = model.Username, Email = model.Email };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
                return Ok();

            return BadRequest(result.Errors);
        }
        return BadRequest("Invalid registration details");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        if (ModelState.IsValid)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var token = await _jwtTokenService.GenerateToken(user);
                return Ok(new { Token = token });
            }
            return Unauthorized();
        }
        return BadRequest("Invalid login details");
    }
}

