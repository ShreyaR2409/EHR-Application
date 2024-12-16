using App.Core.App.User.Command;
using App.Core.App.User.Querys;
using App.Core.App.Utility.Query;
using App.Core.Model.User;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EHRApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IMediator _mediator;
        public UserController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegistrationDto registrationDto)
        {
            var userId = await _mediator.Send(new CreateUserCommand { Registration = registrationDto });
            return Ok(userId);
        }

        [HttpPost("login")]
        public async Task<IActionResult> login(LoginDto loginDto)
        {
            var login = await _mediator.Send(new LoginUserCommand { LoginDto = loginDto });
            return Ok(login);
        }

        [HttpPost("VerifyOtp")]
        public async Task<IActionResult> VerifyOtp(OtpDto verifyOtpDto)
        {
            var result = await _mediator.Send(new VerifyOtpCommand { OtpDto = verifyOtpDto });
            if (result == null)
            {
                return BadRequest("Invalid OTP");
            }
            return Ok(result);
        }

        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword(string Email)
        {
            var result = await _mediator.Send(new ForgetPasswordCommand { Email = Email });
           return Ok(result);
        }

        [HttpGet("GetUserByUsername")]
        public async Task<IActionResult> GetUser(string username)
        {
            var result = await _mediator.Send(new GetUserByUsername { UserName = username });
            return Ok(result);
        }

        [HttpPut("UpdateUser/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] RegistrationDto RegistrationDto)
        {

            var result = await _mediator.Send(new UpdateUserCommand
            {
                UserId = id,
                RegistrationDto = RegistrationDto
            });

            if (result == null)
            {
                return NotFound("User not found or update failed.");
            }

            return Ok(result);
        }

        [HttpPut("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            var result = await _mediator.Send(new ChangePasswordCommand { ChangePassword = changePasswordDto });

           return Ok(result);
        }

        [HttpGet("PatientList")]
        public async Task<IActionResult> GetPatients()
        {
            var result = await _mediator.Send(new GetAllPatient());
            return Ok(result);
        }

        [HttpGet("ProviderList")]
        public async Task<IActionResult> GetProviders()
        {
            var result = await _mediator.Send(new GetAllProvider());
            return Ok(result);
        }

        [HttpGet("ProviderBySpecialisation")]
        public async Task<IActionResult> GetStates(int id)
        {
            var result = await _mediator.Send(new GetProviderBySpecialisationId { Id = id });
            return Ok(result);
        }

        [HttpGet("AllSpecialisation")]
        public async Task<IActionResult> GetSpecialisation()
        {
            var result = await _mediator.Send(new GetAllSpecialisation());
            return Ok(result);
        }
    }
}
