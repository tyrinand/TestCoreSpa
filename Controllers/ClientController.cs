using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Api_work.Models;
using Api_work.Service.Repository;
using Microsoft.AspNetCore.Authorization;

namespace Api_work.Controllers
{
    [Authorize]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly ILogger<ClientController> _logger;
        private readonly IClientRepository _repo;

        public ClientController(ILogger<ClientController> logger, IClientRepository repository)
        {
            _logger = logger;
            _repo = repository;
        }

        [HttpGet]
        [Route("/api/[controller]")]
        public async Task<PageDate<Client>> GetClients([FromQuery] PagesParams pagesParams)
        {
           return await _repo.GetList(pagesParams);
        }

        [HttpGet("/api/[controller]/{id}")]
        public async Task<Client> GetClient(int id)
        {
           return await _repo.GetClient(id);
        }

        [HttpPost]
        [Route("/api/[controller]")]
        public async Task<bool> CreateClient(Client client)
        {
            return await _repo.Create(client);
        }

        [HttpDelete("/api/[controller]/{id}")]
        public async Task<bool> DeleteClient(int id)
        {
            return await _repo.Delete(id);
        }

        [HttpPut]
        [Route("/api/[controller]")]
        public async Task<bool> UpdateClient(Client client)
        {
            return await _repo.Update(client);
        }
    }
}


