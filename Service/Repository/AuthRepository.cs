using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using Dapper;

namespace Api_work.Service.Repository
{
  public interface IAuthRepository
  {
    Task WriteHistoryAuthAsync();

    Task WriteLogOutAsync();

    Task<string> GetHistoryAsync();
  }


  public class AuthRepository : IAuthRepository
  {
    private string _connectStr;

    public AuthRepository(string connect)
    {
      _connectStr = connect;
    }

    public async Task WriteHistoryAuthAsync()
    {
      var sql = @"INSERT INTO authEvent (Name) VALUES ( 'Login' )";

      using (var bd = new SqliteConnection(_connectStr))
      {
        await bd.ExecuteAsync(sql);
      }
    }

    public async Task WriteLogOutAsync()
    {
      var sql = @"INSERT INTO authEvent (Name) VALUES ( 'LogOut' )";

      using (var bd = new SqliteConnection(_connectStr))
      {
        await bd.ExecuteAsync(sql);
      }
    }

    public async Task<string> GetHistoryAsync()
    {
      var sqlLoginCount =   @"SELECT count(1) from authEvent A where A.Name = 'Login' ";
      var sqlLogOutCount =  @"SELECT count(1) from authEvent A where A.Name = 'LogOut'";

      int loginCount = 0;
      int logOutCount = 0;

      using (var bd = new SqliteConnection(_connectStr))
      {
        loginCount = await bd.QuerySingleAsync<int>(sqlLoginCount);
        logOutCount = await bd.QuerySingleAsync<int>(sqlLogOutCount);
      }

      return $"Login count : {loginCount}, LogOut count : {logOutCount}";
    }
  }


}