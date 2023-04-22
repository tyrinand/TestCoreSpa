using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using Api_work.Models;
using Api_work.Service.Repository;
using Microsoft.AspNetCore.Authorization;

namespace Api_work.Controllers
{
  [Authorize]
  [ApiController]
  public class SoftController : ControllerBase
  {
    private readonly ILogger<SoftController> _logger;

    private ISoftRepository _repo;

    public SoftController(ILogger<SoftController> logger, ISoftRepository repository)
    {
      _logger = logger;
      _repo = repository;
    }

    [HttpGet]
    [Route("/api/[controller]")]
    public async Task<PageDate<Soft>> GetSoft([FromQuery] PagesParams pagesParams)
    {
      return await _repo.GetList(pagesParams);
    }

    [HttpGet("/api/[controller]/{id}")]
    public async Task<Soft> GetSoft(int id)
    {
      return await _repo.GetSoft(id);
    }

    [HttpPost]
    [Route("/api/[controller]")]
    public async Task<bool> CreateSoft(Soft soft)
    {
      return await _repo.Create(soft);
    }

    [HttpDelete("/api/[controller]/{id}")]
    public async Task<bool> DeleteClient(int id)
    {
      return await _repo.Delete(id);
    }

    [HttpPut]
    [Route("/api/[controller]")]
    public async Task<bool> Update(Soft soft)
    {
      return await _repo.Update(soft);
    }
  }
}