using WebApiAngular.Models;

namespace WebApiAngular.DAL
{
    public interface IHeroesRepository
    {
        Hero[] GetAllHeroes();
        Hero GetHeroById(int id);
    }
}