using System.Web.Http;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(WebApiAngular.Startup))]

namespace WebApiAngular
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            HttpConfiguration httpConfig = new HttpConfiguration();

            UnityConfig.RegisterComponents(httpConfig);

            ConfigureOAuth(app);

            ConfigureWebApi(httpConfig);

            httpConfig.IncludeErrorDetailPolicy = IncludeErrorDetailPolicy.LocalOnly;

            app.UseWebApi(httpConfig);
        }
    }
}