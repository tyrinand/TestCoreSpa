using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Api_work.Service.Repository;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Threading.Tasks;

namespace Eng
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      var connect = Configuration["ConnectionStrings:SaleDatabase"];
      services.AddTransient<IClientRepository, ClientRepository>(provider => new ClientRepository(connect));
      services.AddTransient<ISoftRepository, SoftRepository>(provider => new SoftRepository(connect));
      services.AddTransient<ISaleRepository, SaleRepository>(provider => new SaleRepository(connect));
      services.AddTransient<IAuthRepository, AuthRepository>(provider => new AuthRepository(connect));

      services.AddControllersWithViews();
      services.AddSwaggerGen();

      services.AddAuthentication(options =>
      { //куки авторизация для VO
        options.DefaultScheme = "Cookies";
      }).AddCookie("Cookies", options =>
      {
        options.Cookie.Name = "auth_cookie";
        options.Events = new CookieAuthenticationEvents
        {
          OnRedirectToLogin = redirectContext =>
          {
            redirectContext.HttpContext.Response.StatusCode = 403;
            return Task.CompletedTask;
          }
        };
      });

      // In production, the React files will be served from this directory
      services.AddSpaStaticFiles(configuration =>
      {
        configuration.RootPath = "ClientApp/build";
      });
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      app.UseDeveloperExceptionPage();
      app.UseStaticFiles();
      app.UseSpaStaticFiles();
      
      app.UseRouting();

      app.UseAuthentication();
      app.UseAuthorization();

      app.UseSwagger();
      app.UseSwaggerUI();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllerRoute(
                  name: "default",
                  pattern: "{controller}/{action=Index}/{id?}");
      });

      app.UseSpa(spa =>
      {
        spa.Options.SourcePath = "ClientApp";

        if (env.IsDevelopment())
        {
          spa.UseReactDevelopmentServer(npmScript: "start");
        }
      });
    }
  }
}
