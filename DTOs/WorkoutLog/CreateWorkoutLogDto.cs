namespace WorkoutTracker.DTOs.WorkoutLog
{
    public class CreateWorkoutLogDto
    {
        public int ExerciseId { get; set; }
        public decimal Weight { get; set; }
        public int Reps { get; set; }
    }
}
