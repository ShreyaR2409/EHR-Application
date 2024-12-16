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
        public IActionResult CreatePaymentIntent()
        {
            try
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = 2000, // Payment amount in cents
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" }
                };
                var service = new PaymentIntentService();
                PaymentIntent intent = service.Create(options);

                // Log for debugging
                Console.WriteLine($"PaymentIntent created. Client secret: {intent.ClientSecret}");

                return Ok(new { client_secret = intent.ClientSecret });
            }
            catch (Exception ex)
            {
                // Log the exception message
                Console.WriteLine($"Error creating payment intent: {ex.Message}");
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
