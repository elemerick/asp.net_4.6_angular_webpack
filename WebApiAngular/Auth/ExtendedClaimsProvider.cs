using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using AspNetIdentity.WebApi.Infrastructure;

namespace WebApiAngular.Auth
{
    public static class ExtendedClaimsProvider
    {
        // This class can be used to enforce creating custom claims for the user based on the information related to him

        public static IEnumerable<Claim> GetClaims(ApplicationUser user)
        {

            List<Claim> claims = new List<Claim>();

            var daysInWork = 91;

            if (daysInWork > 90)
            {
                claims.Add(CreateClaim("FTE", "1"));

            }
            else
            {
                claims.Add(CreateClaim("FTE", "0"));
            }


            claims.Add(new Claim(ClaimTypes.Role, "Admin"));

            return claims;
        }

        public static Claim CreateClaim(string type, string value)
        {
            return new Claim(type, value, ClaimValueTypes.String);
        }

    }
}