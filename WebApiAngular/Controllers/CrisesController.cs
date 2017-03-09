﻿using System.Web.Http;
using WebApiAngular.DAL;
using WebApiAngular.Models;

namespace WebApiAngular.Controllers
{
    [RoutePrefix("api/crises")]
    public class CrisesController : ApiController
    {
        private ICrisesRepository _crisesRepo;

        public CrisesController(ICrisesRepository crisesRepo)
        {
            _crisesRepo = crisesRepo;
        }

        // GET: api/crises
        public IHttpActionResult Get()
        {
            Crisis[] crises = _crisesRepo.GetAllCrises();
            return Ok(crises);
        }

        // GET: api/crises/5
        public IHttpActionResult Get(int id)
        {
            if (id <= 0)
            {
                return NotFound();
            }

            Crisis crisis = _crisesRepo.GetCrisisById(id);
            return Ok(crisis);
        }

        // POST: api/crises
        public IHttpActionResult Post([FromBody]string value)
        {
            return Ok();
        }

        // PUT: api/crises/5
        public IHttpActionResult Put(int id, [FromBody]string value)
        {
            return Ok();
        }

        // DELETE: api/crises/5
        public IHttpActionResult Delete(int id)
        {
            return Ok();
        }
    }
}
