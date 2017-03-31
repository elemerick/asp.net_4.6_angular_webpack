using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using WebApiAngular.DTO;
using WebApiAngular.Infrastructure;
using WebApiAngular.Models;

namespace WebApiAngular.Controllers
{
    public class BaseApiController : ApiController
    {
        private DtoFactory _dtoFactory;
        private CustomUserManager _AppUserManager = null;

        public BaseApiController()
        {
        }

        protected CustomUserManager AppUserManager
        {
            get
            {
                return _AppUserManager ?? Request.GetOwinContext().GetUserManager<CustomUserManager>();
            }
        }

        protected DtoFactory TheDtoFactory
        {
            get
            {
                if (_dtoFactory == null)
                {
                    _dtoFactory = new DtoFactory(Request, AppUserManager);
                }
                return _dtoFactory;
            }
        }

        protected IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }
    }
}