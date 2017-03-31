using System.Web.Http;
using WebApiAngular.DAL;
using WebApiAngular.Models;

namespace WebApiAngular.Controllers
{
    [RoutePrefix("api/heroes")]
    public class HeroesController : BaseApiController
    {
        private IHeroesRepository _heroesRepo;

        public HeroesController(IHeroesRepository heroesRepo)
        { 
            _heroesRepo = heroesRepo;
        }

        // GET: api/heroes
        public IHttpActionResult Get()
        {
            Hero[] heroes = _heroesRepo.GetAllHeroes();
            return Ok(heroes);
        }

        // GET: api/heroes/5
        public IHttpActionResult Get(int id)
        {
            if(id <= 0)
            {
                return NotFound();
            }

            Hero hero = _heroesRepo.GetHeroById(id);
            return Ok(hero);
        }

        // POST: api/heroes
        public IHttpActionResult Post([FromBody]string value)
        {
            return Ok();
        }

        // PUT: api/heroes/5
        public IHttpActionResult Put(int id, [FromBody]string value)
        {
            return Ok();
        }

        // DELETE: api/heroes/5
        public IHttpActionResult Delete(int id)
        {
            return Ok();
        }
    }
}
