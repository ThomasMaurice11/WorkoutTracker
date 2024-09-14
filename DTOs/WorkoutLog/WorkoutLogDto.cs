namespace WorkoutTracker.DTOs.WorkoutLog
{
    public class WorkoutLogDto
    {
        public int WorkoutLogId { get; set; }
        public int ExerciseId { get; set; }
        public DateTime Date { get; set; }
        public decimal Weight { get; set; }
        public int Reps { get; set; }
    }

}
