namespace WorkoutTracker.Models
{
    using Microsoft.AspNetCore.Identity;

    public class ApplicationUser : IdentityUser
    {
        public ICollection<WorkoutCategory> WorkoutCategories { get; set; }
    }
}
