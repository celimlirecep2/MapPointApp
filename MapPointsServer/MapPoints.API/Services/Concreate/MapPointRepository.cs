using MapPoints.API.Models;
using MapPoints.API.Services.Abstract;
using System.Text.Json;

namespace MapPoints.API.Services.Concreate
{
    public class MapPointRepository : IMapPointRepository
    {
        private readonly string _directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "Database");
        private readonly string _filePath;

        public MapPointRepository()
        {
            _filePath = Path.Combine(_directoryPath, "mappoints.json");

            if (!Directory.Exists(_directoryPath))
            {
                Directory.CreateDirectory(_directoryPath); 
            }

            if (!File.Exists(_filePath))
            {
                File.Create(_filePath).Close(); 
                SaveMapPointsToFile(new List<MapPoint>()); 
            }
        }

        public Task<IEnumerable<MapPoint>> GetMapPointsAsync()
        {
            var mapPoints = LoadMapPointsFromFile();
            return Task.FromResult<IEnumerable<MapPoint>>(mapPoints);
        }

        public Task<MapPoint> AddMapPointAsync(MapPoint mapPoint)
        {
            var mapPoints = LoadMapPointsFromFile();
            mapPoint.Id = mapPoints.Any() ? mapPoints.Max(mp => mp.Id) + 1 : 1;
            mapPoints.Add(mapPoint);
            SaveMapPointsToFile(mapPoints);
            return Task.FromResult(mapPoint);
        }

        public Task<MapPoint> RemoveMapPointAsync(int id)
        {
            var mapPoints = LoadMapPointsFromFile();
            var mapPoint = mapPoints.FirstOrDefault(mp => mp.Id == id);
            if (mapPoint != null)
            {
                mapPoints.Remove(mapPoint);
                SaveMapPointsToFile(mapPoints);
            }
            return Task.FromResult(mapPoint);
        }

        private List<MapPoint> LoadMapPointsFromFile()
        {
            var json = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<MapPoint>>(json) ?? new List<MapPoint>();
        }

        private void SaveMapPointsToFile(List<MapPoint> mapPoints)
        {
            var json = JsonSerializer.Serialize(mapPoints, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, json);
        }
    }
}
