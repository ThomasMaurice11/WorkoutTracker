using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using WorkoutTracker.Models;

namespace WorkoutTracker.Services
{
    public interface IJwtTokenService
    {
        Task<string> GenerateToken(ApplicationUser user);
        string GetUserIdFromToken(string token);
    }
}
