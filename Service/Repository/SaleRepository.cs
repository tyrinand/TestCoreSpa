using System;
using Api_work.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using Dapper;

namespace Api_work.Service.Repository
{
  public interface ISaleRepository
  {
    Task<PageDate<SaleView>> GetList(PagesParams paramers);

    Task<SaleForm> GetSale(int? id);

    Task<bool> Create(Sale sale);

    Task<bool> Delete(int id);

    Task<bool> Update(Sale sale);
  }

  public class SaleRepository : ISaleRepository
  {
    private string _connectStr;

    public SaleRepository(string connect)
    {
      _connectStr = connect;
    }

    public async Task<PageDate<SaleView>> GetList(PagesParams paramers)
    {
      var sql = @"SELECT s.Id,
                        s.Datebuy as DateBuy,
                        s.Count,
                        s.Summ,
                        c.Name as ClientName,
                        sf.Name as SoftName,
                        sf.Price as PriceOne
                    FROM sales s
                    join clients c on c.Id = s.Id_client
                    join softs sf on sf.Id = s.Id_soft
                    order by s.Id
                    LIMIT  @getCount
                    OFFSET @skipCount;";

      var skipCount = (paramers.PageNumber - 1) * paramers.PageSize;
      List<SaleView> sales = new List<SaleView>();

      using (var bd = new SqliteConnection(_connectStr))
      {
        sales = (await bd.QueryAsync<SaleView>(sql,
        new
        {
          skipCount = skipCount,
          getCount = paramers.PageSize
        })).AsList();
      }

      int count;
      sql = "select count(*) from sales";
      using (var bd = new SqliteConnection(_connectStr))
      {
        count = await bd.QueryFirstAsync<int>(sql);
      }

      return new PageDate<SaleView>()
      {
        CurrentPage = paramers.PageNumber,
        Items = sales,
        PageSize = paramers.PageSize,
        CountPage = (int)Math.Ceiling(count / (double)paramers.PageSize)
      };
    }

    public async Task<SaleForm> GetSale(int? id)
    {
      var sale = new Sale() { Id = 0, Datebuy = null, IdClient = null, IdSoft = null, Count = 0, Summ = 0 };
      var sql = "";

      if (id != null)
      {
        sql = @"SELECT s.Id, 
                      s.Datebuy as DateBuy, 
                      s.Count, 
                      s.Summ, 
                      s.Id_client as IdClient, 
                      s.Id_soft as IdSoft   
                      FROM sales s 
                      WHERE s.Id = @id";

        using (var bd = new SqliteConnection(_connectStr))
        {
          sale = await bd.QueryFirstAsync<Sale>(sql, new { id = id });
        }
      }

      var clients = new List<Client>();
      var softs = new List<Soft>();

      sql = @"Select Id, Name, Mark  from clients order by Id";

      using (var bd = new SqliteConnection(_connectStr))
      {
        clients = (await bd.QueryAsync<Client>(sql)).AsList();
      }

      sql = "SELECT Id, Name, Description, Price, Count FROM softs order by Id";
      using (var bd = new SqliteConnection(_connectStr))
      {
        softs = (await bd.QueryAsync<Soft>(sql)).AsList();
      }

      return new SaleForm()
      {
        sale = sale,
        clients = clients,
        softs = softs
      };
    }

    public async Task<bool> Create(Sale sale)
    {
      int count = 0;
      var sql = @"INSERT INTO sales (
                      Datebuy,
                      Id_client,
                      Id_soft,
                      Count,
                      Summ
                  )
                  VALUES (
                      @Datebuy,
                      @IdClient,
                      @IdSoft,
                      @Count,
                      @Summ
                  );";

      using (var bd = new SqliteConnection(_connectStr))
      {
        count = (await bd.ExecuteAsync(sql, sale));
      }

      return (count > 0);
    }

    public async Task<bool> Delete(int id)
    {
      int count = 0;
      var sql = @"delete from sales where Id = @id";

      using (var bd = new SqliteConnection(_connectStr))
      {
        count =  (await bd.ExecuteAsync(sql, new { id = id }));
      }

      return (count > 0);
    }

    public async Task<bool> Update(Sale sale)
    {
      int count = 0;
      var sql = @"UPDATE sales
                SET 
                    Datebuy = @Datebuy,
                    Id_client = @IdClient,
                    Id_soft = @IdSoft,
                    Count = @Count,
                    Summ = @Summ
                WHERE Id = @Id ";
      using (var bd = new SqliteConnection(_connectStr))
      {
        count =  (await bd.ExecuteAsync(sql, sale));
      }

      return (count > 0);
    }
  }
}