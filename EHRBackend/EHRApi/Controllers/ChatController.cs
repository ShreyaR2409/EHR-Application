using Domain.Entities.Appointments;
using Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EHRApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChatController(AppDbContext context)
        {
            _context = context;
        }

        // Validate if patient and provider have a confirmed appointment
        [HttpGet("validate/{patientId}/{providerId}")]
        public async Task<IActionResult> ValidateAppointment(int patientId, int providerId)
        {
            var appointment = await _context.Appointments
                .FirstOrDefaultAsync(a => a.PatientId == patientId
                                       && a.ProviderId == providerId
                                       && a.AppointmentStatus == "Scheduled");

            if (appointment == null)
                return Unauthorized("No confirmed appointment found.");

            return Ok("Appointment validated.");
        }

        // Store chat messages
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessage message)
        {
            _context.ChatMessages.Add(message);
            await _context.SaveChangesAsync();

            return Ok("Message sent.");
        }

        // Retrieve chat history
        [HttpGet("history/{patientId}/{providerId}")]
        public async Task<IActionResult> GetChatHistory(string patientId, string providerId)
        {
            var messages = await _context.ChatMessages
                .Where(m => (m.SenderId == patientId && m.ReceiverId == providerId) ||
                            (m.SenderId == providerId && m.ReceiverId == patientId))
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }
    }
}