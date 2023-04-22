using System;

namespace Api_work.Models
{

  public class Auth
  {
    public string Login { get; set; }
    public string Password { get; set; }
  }

   public class AuthState
  {
    /// <summary>
    /// авторизован ли пользователь 
    /// </summary>
    /// <value></value>
    public bool  isAuth {get ;set; }

    /// <summary>
    /// Логин
    /// </summary>
    /// <value></value>
    public string Login {get; set;}

    /// <summary>
    /// Сообщения об ошибке 
    /// </summary>
    /// <value></value>
    public string ErrorMessage {get; set;}
  }

}