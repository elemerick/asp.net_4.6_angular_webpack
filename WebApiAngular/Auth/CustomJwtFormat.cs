using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataHandler.Encoder;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Text;
using Thinktecture.IdentityModel.Tokens;

namespace WebApiAngular.Auth
{
    public class CustomJwtFormat : ISecureDataFormat<AuthenticationTicket>
    {
        // This class is responsible for generating the JWT access token

        private static readonly byte[] _secret = TextEncodings.Base64Url.Decode(ConfigurationManager.AppSettings["secret"]);
        private readonly string _issuer = string.Empty;
        private static readonly string audienceId = ConfigurationManager.AppSettings["as:AudienceId"];

        public CustomJwtFormat(string issuer)
        {
            _issuer = issuer;
        }

        public string Protect(AuthenticationTicket data)
        {
            if (data == null)
            {
                throw new ArgumentNullException(nameof(data));
            }

            var signingKey = new HmacSigningCredentials(_secret); // create a HMAC-SHA256 signing key
            var issued = data.Properties.IssuedUtc;
            var expires = data.Properties.ExpiresUtc;
            
            var token = new JwtSecurityToken(_issuer, audienceId, data.Identity.Claims, issued.Value.UtcDateTime, expires.Value.UtcDateTime, signingKey);
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }

        public AuthenticationTicket Unprotect(string protectedText)
        {
            throw new NotImplementedException();
        }
    }
}