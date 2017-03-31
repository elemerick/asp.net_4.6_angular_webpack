using System.Web.Http;
using Microsoft.AspNet.SignalR;
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

            var hubConfiguration = new HubConfiguration();
            hubConfiguration.EnableJavaScriptProxies = false;
#if DEBUG
            hubConfiguration.EnableDetailedErrors = true;
#endif
            app.MapSignalR(hubConfiguration);

            app.UseWebApi(httpConfig);
        }
    }
}