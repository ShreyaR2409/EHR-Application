using App.Core.App.Appointment.Command;
using App.Core.App.Appointment.Query;
using App.Core.Model.Appointment;
using Domain.Entities.Appointments;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EHRApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly IMediator _mediator;

        public AppointmentController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("AddAppointment")]
        public async Task<IActionResult> AddAppointment(AddAppointmentDto appointment)
        {
            var result = await _mediator.Send(new AddAppointmentCommand { Appointment = appointment });
            return Ok(result);
        }

        [HttpPut("UpdateAppointment")]
        public async Task<IActionResult> UpdateAppointment(UpdateAppointmentDto updateAppointmentDto)
        {
            var result = await _mediator.Send(new UpdateAppointmentCommand { Appointment = updateAppointmentDto });
            return Ok(result);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetAppointments(int userId, [FromQuery] string role)
        {
            var query = new GetAppointmentsQuery
            {
                UserId = userId,
                Role = role
            };
            var appointments = await _mediator.Send(query);
            return Ok(appointments);
        }

        [HttpPost("MarkAsComplete")]
        public async Task<IActionResult> MarkAsComplete(int AppointmentId)
        {
            var result = await _mediator.Send(new MarkAppointmentAsCompletedCommand { AppointmentId = AppointmentId });
            return Ok(result);
        }

        [HttpPost("MarkAsCancelled")]
        public async Task<IActionResult> MarkAsCancelled(int AppointmentId)
        {
            var result = await _mediator.Send(new CancelAppointmenCommand { AppointmentId = AppointmentId });
            return Ok(result);
        }

        [HttpGet("AppointmentDetails")]
        public async Task<IActionResult> GetAppointmentDetails(int Id)
        {
            var query = new GetAppointmentDetailsById
            {
                AppointmentId = Id
            };
            var appointments = await _mediator.Send(query);
            return Ok(appointments);
        }
    }
}
