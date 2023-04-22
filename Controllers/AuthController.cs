using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Api_work.Models;
using Api_work.Service.Repository;

namespace SkrinDesktop.Main.Controllers
{
  [ApiController]
  public class AuthController : ControllerBase
  {
    private readonly ILogger<AuthController> _logger;

    private IAuthRepository _repo;

    public AuthController(ILogger<AuthController> logger, IAuthRepository repo)
    {
      _logger = logger;
      _repo = repo;
    }

    [HttpPost]
    [Route("/api/[controller]/")]
    public async Task<AuthState> Auth(Auth auth)
    {
      string authLogin = "test";
      string authPassword = "test";
      bool status = false;

      if ((auth.Login.ToLower() == authLogin) && (auth.Password.ToLower() == authPassword))
      {
        status = true;
      }

      if (status == false)
        return new AuthState() { Login = "", isAuth = false, ErrorMessage = "Incorrect login password pair" };

      var claims = new List<Claim>
      {
        new Claim(ClaimsIdentity.DefaultNameClaimType, "Test"),
      };

      ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
      await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));

      await _repo.WriteHistoryAuthAsync();
      return new AuthState() { Login = "Test", isAuth = true, ErrorMessage = null };
    }

    [HttpGet]
    [Route("/api/[controller]/")]
    public AuthState AuthAuto()
    {
      var user = HttpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimsIdentity.DefaultNameClaimType)?.Value;

      if (String.IsNullOrEmpty(user) == false)
      {
        return new AuthState() { Login = "Test", isAuth = true, ErrorMessage = null };
      }
      else
      {
        return new AuthState() { Login = "", isAuth = false, ErrorMessage = null };
      }
    }


    [HttpPost]
    [Route("/api/[controller]/Logout")]
    public async Task<AuthState> Logout()
    {
      await _repo.WriteLogOutAsync();
      await HttpContext.SignOutAsync();
      return new AuthState() { ErrorMessage = null, isAuth = false, Login = null };
    }

    [HttpGet]
    [Route("/api/[controller]/GetHistory")]
    public async Task<string> GetHistory()
    {
      return await _repo.GetHistoryAsync();
    }

  }
}
