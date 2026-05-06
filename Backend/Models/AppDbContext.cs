using System;
using Microsoft.EntityFrameworkCore;

namespace Pirnav.API.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AdminUser> AdminUsers { get; set; }
    public virtual DbSet<ContactMessage> ContactMessages { get; set; }
    public virtual DbSet<Job> Jobs { get; set; }
    public virtual DbSet<JobApplication> JobApplications { get; set; }
    public virtual DbSet<Service> Services { get; set; }
    public virtual DbSet<Interview> Interviews { get; set; }
    public DbSet<Manager> Managers { get; set; }

    public DbSet<Lead> Leads { get; set; }

    public DbSet<DemoRequest> DemoRequests { get; set; }

    public DbSet<InterviewFeedback> InterviewFeedbacks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<AdminUser>().ToTable("adminusers");
modelBuilder.Entity<ContactMessage>().ToTable("contactmessages");
modelBuilder.Entity<Job>().ToTable("jobs");
modelBuilder.Entity<JobApplication>().ToTable("jobapplications");
modelBuilder.Entity<Service>().ToTable("services");
modelBuilder.Entity<Interview>().ToTable("interviews");
modelBuilder.Entity<Manager>().ToTable("managers");
modelBuilder.Entity<Lead>().ToTable("leads");
modelBuilder.Entity<DemoRequest>().ToTable("demorequests");
modelBuilder.Entity<InterviewFeedback>().ToTable("interviewfeedbacks");
        // =======================
        // ADMIN USERS
        // =======================
        modelBuilder.Entity<AdminUser>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Username).HasMaxLength(100);
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Role).HasMaxLength(50);

            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasDefaultValueSql("(getdate())");
        });

        // =======================
        // CONTACT MESSAGES
        // =======================
        modelBuilder.Entity<ContactMessage>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.Subject).HasMaxLength(200);

            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasDefaultValueSql("(getdate())");
        });

        // =======================
        // JOBS
        // =======================
        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasDefaultValueSql("(getdate())");

            entity.Property(e => e.IsActive)
                .HasDefaultValue(true);

            //  Increased sizes (FIX)
            entity.Property(e => e.JobTitle).HasMaxLength(500);
            entity.Property(e => e.WorkLocation).HasMaxLength(300);
            entity.Property(e => e.JobType).HasMaxLength(200);
            entity.Property(e => e.Status).HasMaxLength(100);
            entity.Property(e => e.Experience).HasMaxLength(200);
            entity.Property(e => e.CTC).HasMaxLength(200);
            entity.Property(e => e.HighestQualification).HasMaxLength(300);

            // IMPORTANT 
            entity.Property(e => e.JobDescription).HasColumnType("nvarchar(max)");
            entity.Property(e => e.MandatorySkills).HasColumnType("nvarchar(max)");
        });

        // =======================
        // JOB APPLICATIONS
        // =======================
        modelBuilder.Entity<JobApplication>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Email).HasMaxLength(150);
            entity.Property(e => e.ResumePath).HasMaxLength(300);

            entity.Property(e => e.AppliedDate)
                .HasColumnType("datetime")
                .HasDefaultValueSql("(getdate())");

            entity.HasIndex(e => new { e.JobId, e.Email })
                .IsUnique();

            entity.HasOne(d => d.Job)
                .WithMany(p => p.JobApplications)
                .HasForeignKey(d => d.JobId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =======================
        // SERVICES
        // =======================
        modelBuilder.Entity<Service>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.Icon).HasMaxLength(200);

            entity.Property(e => e.IsActive)
                .HasDefaultValue(true);

            entity.Property(e => e.CreatedDate)
                .HasColumnType("datetime")
                .HasDefaultValueSql("(getdate())");
        });

        // =======================
        // INTERVIEW STATUS ENUM
        // =======================
        modelBuilder.Entity<Interview>()
            .Property(i => i.Status)
            .HasConversion<string>();

        // =======================
        // MANAGER SEED DATA
        // =======================
        modelBuilder.Entity<Manager>().HasData(
            new Manager
            {
                Id = 1,
                Name = "Shyam",
                Email = "prasadkumar.madiga@pirnav.com"
            },
            new Manager
            {
                Id = 2,
                Name = "Kiana",
                Email = "kiana@pirnav.com"
            }
        );

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}