using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using AspNetIdentity.WebApi.Infrastructure;
using Microsoft.AspNet.Identity;

namespace WebApiAngular.Infrastructure
{
    // CRUD for User in DB. Put here your custom logic for user DB
    public class CustomUserStore : IUserStore<ApplicationUser>, IUserPasswordStore<ApplicationUser>
    {
        // test users in memory, remove it in prod
        static readonly List<ApplicationUser> Users = new List<ApplicationUser>() {
            new ApplicationUser("administrator"),
            new ApplicationUser("tester")
        };

        private bool disposed = false;

        public Task CreateAsync(ApplicationUser user)
        {
            return Task.Run(() => Users.Add(user));
        }

        public Task<ApplicationUser> FindByNameAsync(string userName)
        {
            return Task.Run(() => Users.FirstOrDefault(u => u.UserName == userName));
        }

        public Task UpdateAsync(ApplicationUser user)
        {
            return Task.Run(() =>
            {
                var olduser = Users.FirstOrDefault(u => u.Id == user.Id);
                olduser.PasswordHash = user.PasswordHash;
            });
        }

        public Task DeleteAsync(ApplicationUser user)
        {
            return Task.Run(() => Users.Remove(user));
        }

        public Task<ApplicationUser> FindByIdAsync(string userId)
        {
            return Task.Run(() => Users.FirstOrDefault(u => u.Id == userId));
        }

        public Task SetPasswordHashAsync(ApplicationUser user, string passwordHash)
        {
            return Task.Run(() =>
            {
                user.PasswordHash = passwordHash;
            });
        }

        public Task<string> GetPasswordHashAsync(ApplicationUser user)
        {
            return Task.Run(() => user.PasswordHash);
        }

        public Task<bool> HasPasswordAsync(ApplicationUser user)
        {
            return Task.Run(() =>
            {
                return !string.IsNullOrWhiteSpace(user.PasswordHash);
            });
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        // Protected implementation of Dispose pattern.
        protected virtual void Dispose(bool disposing)
        {
            if (disposed) return;

            if (disposing)
            {
                 // Dispose();
                // Free any other managed objects here.
                //
            }

            // Free any unmanaged objects here.
            //
            disposed = true;
        }
    }
}