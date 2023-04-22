using System;
using Api_work.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.Sqlite;
using Dapper;

namespace Api_work.Service.Repository
{
    public interface IClientRepository
    {
        Task<bool> Create(Client client);
        
        Task<bool> Delete(int Id);

        Task<PageDate<Client>> GetList(PagesParams paramers);

        Task<Client> GetClient(int id);

        Task<bool> Update(Client client);
    }

    public class ClientRepository : IClientRepository
    {
        private string _connectStr;

        public ClientRepository(string connect)
        {
            _connectStr = connect;
        }

        public async Task<PageDate<Client>> GetList(PagesParams paramers)
        {
            var sql = @"Select Id, Name, Mark 
                        from clients
                        order by Id
                        LIMIT @getCount
                        OFFSET @skipCount;
                        ";
            var skipCount = (paramers.PageNumber - 1) * paramers.PageSize;
            List<Client> clients = new List<Client>();

            using(var bd = new SqliteConnection(_connectStr))
            {
               clients = (await bd.QueryAsync<Client>(sql, 
                    new { 
                        skipCount = skipCount,
                        getCount = paramers.PageSize
                    }
                    )).AsList();
            }

            int count;
            sql = @"select count(*) from clients";

            using(var bd = new SqliteConnection(_connectStr))
            {
                count = await bd.QueryFirstAsync<int>(sql);
            }

            return new PageDate<Client>() 
            {
                CurrentPage = paramers.PageNumber,
                Items = clients,
                PageSize = paramers.PageSize,
                CountPage = (int)Math.Ceiling( count / (double) paramers.PageSize )
            };
        }

        public async Task<bool> Create(Client client)
        {
            int count = 0;
            var sql = "insert into clients (Name, Mark) values (@Name, @Mark)";
            using(var bd = new SqliteConnection(_connectStr))
            {
                count =(await bd.ExecuteAsync(sql, client));
            }

            return (count > 0);
        }

        public async Task<bool> Delete(int id)
        {
            int count = 0;
            var sql =  "delete from clients where Id = @id";
            using(var bd = new SqliteConnection(_connectStr))
            {
                count = (await bd.ExecuteAsync(sql, new{ id = id } ));
            }

            return (count > 0);
        }

        public async Task<Client> GetClient(int id)
        {
            var sql =  "Select Id, Name, Mark from clients where Id = @id";
            using(var bd = new SqliteConnection(_connectStr))
            {
                return await bd.QueryFirstAsync<Client>(sql, new{ id = id } );
            }
        }

        public async Task<bool> Update(Client client)
        {
            int count = 0;
            var sql = @"update clients SET Name = @Name , Mark = @Mark where Id = @Id";
            using(var bd = new SqliteConnection(_connectStr))
            {
                count =  (await bd.ExecuteAsync(sql, client));
            }
            return (count > 0);
        }
    }
}