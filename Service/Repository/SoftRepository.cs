using System;
using Api_work.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using Dapper;

namespace Api_work.Service.Repository
{
  public interface ISoftRepository
  {
    Task<PageDate<Soft>> GetList(PagesParams paramers);

    Task<Soft> GetSoft(int id);

    Task<bool> Create(Soft soft);

    Task<bool> Delete(int id);

    Task<bool> Update(Soft soft);
  }

  public class SoftRepository : ISoftRepository
  {

    private string _connectStr;

    public SoftRepository(string connect)
    {
      _connectStr = connect;
    }

    public async Task<Soft> GetSoft(int id)
    {
      var sql = @"Select Id, Name, Description, Price, Count  FROM softs where Id = @id";

      using (var bd = new SqliteConnection(_connectStr))
      {
        return await bd.QueryFirstAsync<Soft>(sql, new { id = id });
      }
    }

    public async Task<bool> Create(Soft soft)
    {
      int count = 0;
      var sql = @"Insert into softs (Name, Description, Price, Count) values (@Name, @Description, @Price, @Count)";

      using (var bd = new SqliteConnection(_connectStr))
      {
        count =  (await bd.ExecuteAsync(sql, soft));
      }

      return (count > 0);
    }


    public async Task<bool> Delete(int id)
    {
      int count = 0;
      var sql = "delete from softs where Id = @id";

      using (var bd = new SqliteConnection(_connectStr))
      {
        count = (await bd.ExecuteAsync(sql, new { id = id }));
      }
      return (count > 0);
    }

    public async Task<bool> Update(Soft soft)
    {
      int count = 0;
      var sql = @"update softs Set Name = @Name, Description = @Description, Price = @Price, Count = @Count where  Id = @Id";
      using (var bd = new SqliteConnection(_connectStr))
      {
        count =  (await bd.ExecuteAsync(sql, soft));
      }
      return (count > 0);
    }

    public async Task<PageDate<Soft>> GetList(PagesParams paramers)
    {
      var sql = @"SELECT Id,
                            Name,
                            Description,
                            Price,
                            Count
                        FROM softs
                        order by Id
                        LIMIT @getCount
                        OFFSET @skipCount;
                        ";

      var skipCount = (paramers.PageNumber - 1) * paramers.PageSize;
      List<Soft> softs = new List<Soft>();

      using (var bd = new SqliteConnection(_connectStr))
      {
        softs = (await bd.QueryAsync<Soft>(
            sql, new
            {
              skipCount = skipCount,
              getCount = paramers.PageSize
            }
        )).AsList();

      }

      int count;
      sql = @"select count(*) from softs";
      using (var bd = new SqliteConnection(_connectStr))
      {
        count = bd.QueryFirst<int>(sql);
      }

      return new PageDate<Soft>()
      {
        CurrentPage = paramers.PageNumber,
        Items = softs,
        PageSize = paramers.PageSize,
        CountPage = (int)Math.Ceiling(count / (double)paramers.PageSize)
      };
    }

  }
}