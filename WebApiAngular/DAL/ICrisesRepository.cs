using WebApiAngular.Models;

namespace WebApiAngular.DAL
{
    public interface ICrisesRepository
    {
        Crisis[] GetAllCrises();
        Crisis GetCrisisById(int id);
    }
}