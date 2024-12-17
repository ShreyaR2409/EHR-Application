using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using System;
using System.Collections.Generic;

namespace EHRApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly string stripeSecretKey = "sk_test_51QV49dBUAXa9znkEZMN2W0OKoz7JmDVD6atPji9VX8ZWptcjMYtGqZIvspR9ZOFTVhquds9e24bMKby7kWkjFfQz008sdMac7i";

        public PaymentController()
        {
            StripeConfiguration.ApiKey = stripeSecretKey;
        }

        [HttpPost("create-payment-intent")]
        public IActionResult CreatePaymentIntent([FromBody] PaymentRequest request)
        {
            try
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = request.Amount * 100, // Convert amount to cents
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" }
                };
                var service = new PaymentIntentService();
                PaymentIntent intent = service.Create(options);

                return Ok(new { client_secret = intent.ClientSecret });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class PaymentRequest
    {
        public int Amount { get; set; } // Amount in USD
    }
}
