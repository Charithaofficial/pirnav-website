using Microsoft.AspNetCore.Mvc;
using Pirnav.API.Helpers;
using System.Security.Claims;

namespace Pirnav.API.Controllers.Base
{
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected IActionResult Success(string message, object? data = null)
        {
            return Ok(new ApiResponse<object>(true, message, data));
        }

        protected IActionResult Fail(string message)
        {
            return BadRequest(new ApiResponse<object>(false, message));
        }

        protected IActionResult UnauthorizedResponse(string message)
        {
            return Unauthorized(new ApiResponse<object>(false, message));
        }

        
        protected int GetUserId()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return 0;

            return int.Parse(userId);
        }
    }
}