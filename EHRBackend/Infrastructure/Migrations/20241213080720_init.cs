using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "bloodGroups",
                columns: table => new
                {
                    BloodGroupId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BloodGroupName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_bloodGroups", x => x.BloodGroupId);
                });

            migrationBuilder.CreateTable(
                name: "country",
                columns: table => new
                {
                    CountryId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CountryName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_country", x => x.CountryId);
                });

            migrationBuilder.CreateTable(
                name: "gender",
                columns: table => new
                {
                    GenderId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GenderName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_gender", x => x.GenderId);
                });

            migrationBuilder.CreateTable(
                name: "specialisations",
                columns: table => new
                {
                    SpecialisationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SpecialisationName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_specialisations", x => x.SpecialisationId);
                });

            migrationBuilder.CreateTable(
                name: "userTypes",
                columns: table => new
                {
                    UserTypeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserTypeName = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_userTypes", x => x.UserTypeId);
                });

            migrationBuilder.CreateTable(
                name: "states",
                columns: table => new
                {
                    StateId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StateName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CountryId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_states", x => x.StateId);
                    table.ForeignKey(
                        name: "FK_states_country_CountryId",
                        column: x => x.CountryId,
                        principalTable: "country",
                        principalColumn: "CountryId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FirstName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Dob = table.Column<DateOnly>(type: "date", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GenderId = table.Column<int>(type: "int", nullable: false),
                    BloodGroupId = table.Column<int>(type: "int", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CountryId = table.Column<int>(type: "int", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StateId = table.Column<int>(type: "int", nullable: false),
                    PinCode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserTypeId = table.Column<int>(type: "int", nullable: false),
                    Qualification = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SpecialisationId = table.Column<int>(type: "int", nullable: true),
                    RegistrationNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VisitingCharge = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProfileImage = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_users", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_users_bloodGroups_BloodGroupId",
                        column: x => x.BloodGroupId,
                        principalTable: "bloodGroups",
                        principalColumn: "BloodGroupId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_users_country_CountryId",
                        column: x => x.CountryId,
                        principalTable: "country",
                        principalColumn: "CountryId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_users_gender_GenderId",
                        column: x => x.GenderId,
                        principalTable: "gender",
                        principalColumn: "GenderId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_users_specialisations_SpecialisationId",
                        column: x => x.SpecialisationId,
                        principalTable: "specialisations",
                        principalColumn: "SpecialisationId");
                    table.ForeignKey(
                        name: "FK_users_userTypes_UserTypeId",
                        column: x => x.UserTypeId,
                        principalTable: "userTypes",
                        principalColumn: "UserTypeId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "otps",
                columns: table => new
                {
                    OtpId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LatestOtp = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_otps", x => x.OtpId);
                    table.ForeignKey(
                        name: "FK_otps_users_UserId",
                        column: x => x.UserId,
                        principalTable: "users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_otps_UserId",
                table: "otps",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_states_CountryId",
                table: "states",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_users_BloodGroupId",
                table: "users",
                column: "BloodGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_users_CountryId",
                table: "users",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_users_GenderId",
                table: "users",
                column: "GenderId");

            migrationBuilder.CreateIndex(
                name: "IX_users_SpecialisationId",
                table: "users",
                column: "SpecialisationId");

            migrationBuilder.CreateIndex(
                name: "IX_users_UserTypeId",
                table: "users",
                column: "UserTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "otps");

            migrationBuilder.DropTable(
                name: "states");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "bloodGroups");

            migrationBuilder.DropTable(
                name: "country");

            migrationBuilder.DropTable(
                name: "gender");

            migrationBuilder.DropTable(
                name: "specialisations");

            migrationBuilder.DropTable(
                name: "userTypes");
        }
    }
}
