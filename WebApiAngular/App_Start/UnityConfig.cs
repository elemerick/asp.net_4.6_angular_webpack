using Microsoft.Practices.Unity;
using System.Web.Http;
using Unity.WebApi;
using WebApiAngular.DAL;

namespace WebApiAngular
{
    public static class UnityConfig
    {
        public static void RegisterComponents(HttpConfiguration config)
        {
            // Unity configuration
            var container = new UnityContainer();

            // register all your components with the container here
            // e.g. container.RegisterType<ITestService, TestService>();

            container.RegisterType<IHeroesRepository, HeroesRepository>();
            container.RegisterType<ICrisesRepository, CrisesRepository>();

            config.DependencyResolver = new UnityDependencyResolver(container);
        }
    }
}