import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MapPoint {
  id: number;
  lat: number;
  lng: number;
  dateTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapPointService {
  private apiUrl = 'https://localhost:5000/api/mappoints'; // API URL'ini buraya ekleyin

  constructor(private http: HttpClient) { }

  getMapPoints(): Observable<MapPoint[]> {
    return this.http.get<MapPoint[]>(this.apiUrl);
  }

  addMapPoint(mapPoint: MapPoint): Observable<MapPoint> {
    return this.http.post<MapPoint>(this.apiUrl, mapPoint);
  }

  removeMapPoint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
