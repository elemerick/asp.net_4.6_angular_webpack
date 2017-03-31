using System;
using System.Configuration;
using System.Threading.Tasks;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataHandler.Encoder;
using Microsoft.Owin.Security.Jwt;
using Microsoft.Owin.Security.OAuth;
using Owin;
using WebApiAngular.Auth;
using WebApiAngular.Infrastructure;

// The package “Microsoft.Owin.Security.Jwt” is responsible for protecting the Resource server resources using JWT, it only validate and de-serialize JWT tokens.

namespace WebApiAngular
{
    public partial class Startup
    {
        public void ConfigureOAuth(IAppBuilder app)
        {
            // Configure the db context, user manager to use a single instance per request
            app.CreatePerOwinContext<CustomUserManager>(CustomUserManager.Create);

            ConfigureOAuthTokenGeneration(app);

            ConfigureOAuthTokenConsumption(app);
        }

        private void ConfigureOAuthTokenConsumption(IAppBuilder app)
        {
            var issuer = ConfigurationManager.AppSettings["issuer"]; // a unique identifier for the entity that issued the token
            var secret = TextEncodings.Base64Url.Decode(ConfigurationManager.AppSettings["secret"]); // secret key used to sign token
            string audienceId = ConfigurationManager.AppSettings["as:AudienceId"];

            // Enable bearer authentication. Api controllers with an [Authorize] attribute will be validated with JWT
            app.UseJwtBearerAuthentication(new JwtBearerAuthenticationOptions
            {
                AuthenticationMode = AuthenticationMode.Active,
                AllowedAudiences = new[] { audienceId }, // audience - the resource server
                IssuerSecurityTokenProviders = new IIssuerSecurityTokenProvider[]
                {
                    new SymmetricKeyIssuerSecurityTokenProvider(issuer, secret)
                },
                Provider = new CustomJWTAuthenticationProvider()
            });
        }

        private void ConfigureOAuthTokenGeneration(IAppBuilder app)
        {
            var issuer = ConfigurationManager.AppSettings["issuer"]; // a unique identifier for the entity that issued the token
            
            //  OAuth 2.0 endpoint so that the client can request a token (by passing a user name and password):
            app.UseOAuthAuthorizationServer(new OAuthAuthorizationServerOptions
            {
                AllowInsecureHttp = true, //For Dev enviroment only (on production should be AllowInsecureHttp = false)
                TokenEndpointPath = new PathString("/oauth/token"), // The path for generating JWT
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                Provider = new CustomOAuthProvider(),  // the implementation on how to authenticate and validate user
                AccessTokenFormat = new CustomJwtFormat(issuer) // the implementation on how to generate the access token using JWT formats
            });
        }
    }
}