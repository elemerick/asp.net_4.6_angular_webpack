using Microsoft.AspNet.Identity;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace AspNetIdentity.WebApi.Infrastructure
{
    public class ApplicationUser : IUser
    {
        public ApplicationUser(string name)
        {
            Id = Guid.NewGuid().ToString();
            UserName = name;
        }

        public string Id { get; private set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
        public string SecurityStamp { get; set; }


        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {
            // this method is responsible to get the authenticated user identity(all roles and claims mapped to the user)
            // The “UserManager” class contains a method named “CreateIdentityAsync” to do this task, 
            // it will basically query the DB and get all the roles and claims for this user

            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            
            // Add custom user claims here
            userIdentity.AddClaim(new Claim("sub", Id));

            return userIdentity;
        }
    }
}