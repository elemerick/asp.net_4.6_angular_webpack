using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http.Routing;
using AspNetIdentity.WebApi.Infrastructure;
using WebApiAngular.Infrastructure;

namespace WebApiAngular.DTO
{
    public class DtoFactory
    {
        private UrlHelper _UrlHelper;
        private CustomUserManager _AppUserManager;

        public DtoFactory(HttpRequestMessage request, CustomUserManager appUserManager)
        {
            _UrlHelper = new UrlHelper(request);
            _AppUserManager = appUserManager;
        }

        public UserDto Create(ApplicationUser appUser)
        {
            return new UserDto
            {
             //   Url = _UrlHelper.Link("GetUserById", new { id = appUser.Id }),
                Id = appUser.Id,
                UserName = appUser.UserName,
             //   FullName = string.Format("{0} {1}", appUser.FirstName, appUser.LastName),
             //   Email = appUser.Email,
            //    EmailConfirmed = appUser.EmailConfirmed,
            //    Level = appUser.Level,
             //   JoinDate = appUser.JoinDate,
              //  Roles = _AppUserManager.GetRolesAsync(appUser.Id).Result,
               // Claims = _AppUserManager.GetClaimsAsync(appUser.Id).Result
            };
        }
    }
}