using MapPoints.API.Models;

namespace MapPoints.API.Services.Abstract
{
    public interface IMapPointRepository
    {
        Task<IEnumerable<MapPoint>> GetMapPointsAsync();
        Task<MapPoint> AddMapPointAsync(MapPoint mapPoint);
    }
}
