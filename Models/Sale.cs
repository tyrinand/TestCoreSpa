using System;
using System.Collections.Generic;

namespace Api_work.Models
{
  public class Sale
  {
    public int Id { get; set; }

    public DateTime? Datebuy { get; set; }

    public int? IdClient { get; set; }

    public int? IdSoft { get; set; }

    public int Count { get; set; }

    public decimal Summ { get; set; }
  }

  public class SaleView
  {
    public int Id { get; set; }

    public string SoftName { get; set; }

    public decimal PriceOne { get; set; }

    public int Count { get; set; }

    public decimal Summ { get; set; }

    public string ClientName { get; set; }
    public DateTime DateBuy { get; set; }

    public string DateBuyStr
    {
      get
      {
        return DateBuy.ToString("dd.MM.yyyy");
      }
    }
  }

  public class SaleForm
  {
    public Sale sale { get; set; }

    public List<Client> clients { get; set; }

    public List<Soft> softs { get; set; }
  }


}