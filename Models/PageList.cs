using System;
using System.Collections.Generic;

namespace Api_work.Models
{
  public class PageDate<T>
  {
    public int CurrentPage { get; set; }

    public int CountPage { get; set; }

    public int PageSize { get; set; }

    public List<T> Items { get; set; }
  }

  /// <summary>
  /// класс входных параметров 
  /// </summary>
  public class PagesParams
  {
    const int maxPageSize = 50;

    public int PageNumber { get; set; } = 1;

    private int _pageSize = 10;

    public int PageSize
    {
      get
      {
        return _pageSize;
      }
      set
      {
        _pageSize = (value > maxPageSize) ? maxPageSize : value;
      }
    }
  }

  
}