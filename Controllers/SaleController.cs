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
  public class SaleController : ControllerBase
  {
    private readonly ILogger<SaleController> _logger;
    private ISaleRepository _repo;

    public SaleController(ILogger<SaleController> logger, ISaleRepository repository)
    {
      _logger = logger;
      _repo = repository;
    }


    [HttpGet]
    [Route("/api/[controller]")]
    public async Task<PageDate<SaleView>> GetSales([FromQuery] PagesParams pagesParams)
    {
      return await _repo.GetList(pagesParams);
    }

    [HttpGet("/api/SaleForm/{id?}")]
    public async Task<SaleForm> GetSale(int? id = null)
    {
      return await _repo.GetSale(id);
    }

    [HttpPost]
    [Route("/api/[controller]")]
    public async Task<bool> CreateSale(Sale sale)
    {
      return await _repo.Create(sale);
    }

    [HttpDelete("/api/[controller]/{id}")]
    public async Task<bool> DeleteSale(int id)
    {
      return await _repo.Delete(id);
    }

    [HttpPut]
    [Route("/api/[controller]")]
    public async Task<bool> Update(Sale sale)
    {
      return await _repo.Update(sale);
    }
  }


}