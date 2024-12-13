using App.Core.App.User.Command;
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
    }
}
