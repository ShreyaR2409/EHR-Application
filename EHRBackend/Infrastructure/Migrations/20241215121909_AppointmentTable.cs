using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AppointmentTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Appointments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    ProviderId = table.Column<int>(type: "int", nullable: false),
                    AppointmentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AppointmentTime = table.Column<TimeSpan>(type: "time", nullable: false),
                    ChiefComplaint = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AppointmentStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Fee = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Appointments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Appointments_users_PatientId",
                        column: x => x.PatientId,
                        principalTable: "users",
                        principalColumn: "UserId",
                    onDelete: ReferentialAction.Restrict);  // Change to Restrict
                    table.ForeignKey(
                        name: "FK_Appointments_users_ProviderId",
                        column: x => x.ProviderId,
                        principalTable: "users",
                        principalColumn: "UserId",
                    onDelete: ReferentialAction.Restrict);  // Change to Restrict
                });

            migrationBuilder.CreateTable(
                name: "SoapNotes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AppointmentId = table.Column<int>(type: "int", nullable: false),
                    Subjective = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Objective = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Assessment = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Plan = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoapNotes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SoapNotes_Appointments_AppointmentId",
                        column: x => x.AppointmentId,
                        principalTable: "Appointments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_PatientId",
                table: "Appointments",
                column: "PatientId");

            migrationBuilder.CreateIndex(
                name: "IX_Appointments_ProviderId",
                table: "Appointments",
                column: "ProviderId");

            migrationBuilder.CreateIndex(
                name: "IX_SoapNotes_AppointmentId",
                table: "SoapNotes",
                column: "AppointmentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SoapNotes");

            migrationBuilder.DropTable(
                name: "Appointments");
        }
    }
}
