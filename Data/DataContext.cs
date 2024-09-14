using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WorkoutTracker.Models;

namespace WorkoutTracker.Data
{
    public class DataContext : IdentityDbContext<ApplicationUser>
    {
        public DataContext(DbContextOptions<DataContext> options)
        : base(options) { }
       
        public DbSet<WorkoutCategory> WorkoutCategories { get; set; }
        public DbSet<Exercise> Exercises { get; set; }
        public DbSet<WorkoutLog> WorkoutLogs { get; set; }
      

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

       
           modelBuilder.Entity<ApplicationUser>()
                .HasMany(u => u.WorkoutCategories)
                .WithOne(c => c.ApplicationUser)
                .HasForeignKey(c => c.UserId);

            modelBuilder.Entity<WorkoutCategory>()
                .HasMany(c => c.Exercises)
                .WithOne(e => e.WorkoutCategory)
                .HasForeignKey(e => e.CategoryId);

            modelBuilder.Entity<Exercise>()
                .HasMany(e => e.WorkoutLogs)
                .WithOne(wl => wl.Exercise)
                .HasForeignKey(wl => wl.ExerciseId);


            modelBuilder.Entity<WorkoutCategory>()
            .HasKey(wc => wc.CategoryId);


            modelBuilder.Entity<WorkoutLog>()
            .Property(wl => wl.Weight)
            .HasColumnType("decimal(18,2)");
        }
    }
}
