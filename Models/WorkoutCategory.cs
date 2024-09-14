namespace WorkoutTracker.Models
{
    public class WorkoutCategory
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public DateTime CreatedAt { get; set; }

        // Foreign key and Navigation property
        public string UserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }

        public ICollection<Exercise> Exercises { get; set; }
    }

}
