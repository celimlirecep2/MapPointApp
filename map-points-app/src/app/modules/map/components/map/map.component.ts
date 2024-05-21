import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MapPoint, MapPointService } from 'src/services/map-point.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: L.Map | any;
  markers: L.Marker[] = [];
  mapPoints: MapPoint[] = [];
  allMapPointsList: MapPoint[] = [];
  centerMarker: L.CircleMarker | any;

  constructor(private mapPointService: MapPointService) { }

  ngOnInit(): void {
    this.initMap();
    this.loadMapPoints();
  }

  initMap(): void {
    this.map = L.map('map').setView([39.9334, 32.8597], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.centerMarker = L.circleMarker(this.map.getCenter(), {
      color: 'red',
      radius: 1
    }).addTo(this.map);

    this.map.on('move', () => {
      this.centerMarker.setLatLng(this.map.getCenter());
    });

  }

  saveMapPoint(): void {
    const center = this.map.getCenter();
    const mapPoint: MapPoint = {
      id: 0,
      lat: center.lat,
      lng: center.lng,
      dateTime: new Date().toISOString()
    };

    this.mapPointService.addMapPoint(mapPoint).subscribe(newMapPoint => {
      this.mapPoints.push(newMapPoint);
      this.allMapPointsList.push(newMapPoint);
    });

  }

  loadMapPoints(): void {
    this.mapPointService.getMapPoints().subscribe(mapPoints => {
      this.mapPoints = mapPoints;
      this.allMapPointsList = this.mapPoints;
    });
  }



  addMarker(mapPoint: MapPoint): void {
    const findIndex = this.markers.findIndex(marker => {
      const { lat, lng } = marker.getLatLng();
      return mapPoint.lat === lat && mapPoint.lng === lng;
    });

    if (findIndex != -1) return;
    const marker = L.marker([mapPoint.lat, mapPoint.lng]).addTo(this.map);
    marker.bindPopup(`ID: ${mapPoint.id} <br> ${this.formatDateTime(mapPoint.dateTime)}`);
    marker.on('click', () => {
      this.map.setView(marker.getLatLng(), this.map.getZoom());
    });

    this.markers.push(marker);
  }
  formatDateTime(dateTime: string): string {
    const date = new Date(dateTime);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  removeMapPoint(id: number, event: MouseEvent): void {
    event.stopPropagation();
    const markerToRemove = this.markers.find(marker => {
      const { lat, lng } = marker.getLatLng();
      return this.mapPoints.some(mp => mp.id === id && mp.lat === lat && mp.lng === lng);
    });

    if (markerToRemove) {
      this.map.removeLayer(markerToRemove);
      this.markers = this.markers.filter(marker => marker !== markerToRemove);
    }
    
    this.mapPoints = this.mapPoints.filter(mp => mp.id !== id);
  }

  refreshMarkers(): void {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
    this.mapPoints.forEach(point => this.addMarker(point));
  }

  downLoadAllJson() {
    this.downloadJson(JSON.stringify(this.allMapPointsList));
  }

  downLoadEdittingJson() {
    this.downloadJson(JSON.stringify(this.mapPoints));
  }

  downloadJson(uriComponent: string): void {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(uriComponent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mapPoints.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}
