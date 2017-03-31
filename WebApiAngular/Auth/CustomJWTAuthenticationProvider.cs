using System;
using System.Threading.Tasks;
using Microsoft.Owin.Security.OAuth;

namespace WebApiAngular.Auth
{
    public class CustomJWTAuthenticationProvider : OAuthBearerAuthenticationProvider
    {
        public override Task RequestToken(OAuthRequestTokenContext context)
        {
            if (context == null) throw new ArgumentNullException("context");

            var tokenParam = context.OwinContext.Request.Query["authorization"];
            if (!string.IsNullOrEmpty(tokenParam) && context.Request.Uri.AbsolutePath.Contains("signalr")) context.Token = tokenParam;

            return base.RequestToken(context);
        }
    }

}