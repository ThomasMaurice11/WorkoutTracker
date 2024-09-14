namespace WorkoutTracker.Models
{
    public class WorkoutLog
    {
        public int WorkoutLogId { get; set; }
        public DateTime Date { get; set; }
        public decimal Weight { get; set; }
        public int Reps { get; set; }

        // Foreign key and Navigation property
        public int ExerciseId { get; set; }
        public Exercise Exercise { get; set; }
    }
}
