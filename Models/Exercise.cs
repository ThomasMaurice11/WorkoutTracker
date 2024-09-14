namespace WorkoutTracker.Models
{
    public class Exercise
    {
        public int ExerciseId { get; set; }
        public string ExerciseName { get; set; }
        public DateTime CreatedAt { get; set; }

        // Foreign key and Navigation property
        public int CategoryId { get; set; }
        public WorkoutCategory WorkoutCategory { get; set; }

        public ICollection<WorkoutLog> WorkoutLogs { get; set; }
    }
}
