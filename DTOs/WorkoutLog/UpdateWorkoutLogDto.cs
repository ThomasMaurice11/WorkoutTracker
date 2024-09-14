namespace WorkoutTracker.DTOs.WorkoutLog
{
    public class UpdateWorkoutLogDto
    {
        public int WorkoutLogId { get; set; }
        public decimal Weight { get; set; }
        public DateTime Date { get; set; }
        public int Reps { get; set; }
    }
}
