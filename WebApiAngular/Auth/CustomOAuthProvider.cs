using System.Security.Claims;
using System.Threading.Tasks;
using AspNetIdentity.WebApi.Infrastructure;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using WebApiAngular.Infrastructure;

namespace WebApiAngular.Auth
{
    public class CustomOAuthProvider : OAuthAuthorizationServerProvider
    {
        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            // receiving the username and password from the request and validate them against our ASP.NET Identity system
            // and creates the claims to be added to the JWT

            // you need to do your DB checks here against memebrship system
            // check by Identity 
            var userManager = context.OwinContext.GetUserManager<CustomUserManager>();
            ApplicationUser user = await userManager.FindAsync(context.UserName, context.Password);

            if (user == null)
            {
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                return;
            }

            // user logged in successfully
            // check here if user blocked or not
            // update here SecurityStamp of logged user
            // update LastRequestTokenTime timestamp



            ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(userManager, "JWT");

            oAuthIdentity.AddClaims(ExtendedClaimsProvider.GetClaims(user)); // add custom claims on the fly
            oAuthIdentity.AddClaims(RolesFromClaims.CreateRolesBasedOnClaims(oAuthIdentity)); // add Role claims on the fly

            var ticket = new AuthenticationTicket(oAuthIdentity, null);
            context.Validated(ticket); //this will transfer identity to an OAuth 2.0 JWT access token
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            // responsible for validating if the Resource server(audience) is already registered in Authorization server by reading the client_id value from the request
            // in this case front-end client is trusted, no need to validate it
            context.Validated();
            return Task.FromResult<object>(null);
        }
    }
}