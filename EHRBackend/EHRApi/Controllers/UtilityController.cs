using App.Core.App.Utility.Query;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace EHRApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UtilityController : ControllerBase
    {
        private readonly IMediator _mediator;

        public UtilityController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpGet("Country")]
        public async Task<IActionResult> GetCountries()
        {
            var result = await _mediator.Send(new GetAllCountriesQuery());
            return Ok(result);
        }

        [HttpGet("State")]
        public async Task<IActionResult> GetStates(int id)
        {
            var result = await _mediator.Send(new GetStatesByCountryIdQuery { Id = id });
            return Ok(result);
        }

        [HttpGet("Roles")]
        public async Task<IActionResult> GetAllRoles()
        {
            var result = await _mediator.Send(new GetUserTypeQuery());
            return Ok(result);
        }

        [HttpGet("Gender")]
        public async Task<IActionResult> GetAllGender()
        {
            var result = await _mediator.Send(new GetGenderQuery());
            return Ok(result);
        }
        [HttpGet("BloodGroup")]
        public async Task<IActionResult> GetAllBloodGroups()
        {
            var result = await _mediator.Send(new GetBloodGroupQuery());
            return Ok(result);
        }
        [HttpGet("Specialisation")]
        public async Task<IActionResult> GetAllSpecialisation()
        {
            var result = await _mediator.Send(new GetSpecialisationQuery());
            return Ok(result);
        }
    }
}
