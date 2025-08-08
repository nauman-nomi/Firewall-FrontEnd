import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription} from 'rxjs';
import { finalize } from 'rxjs/operators';
import {
  ApexChart,
  ApexXAxis,
  ApexStroke,
  ApexMarkers,
  ApexLegend,
  ApexDataLabels,
  ApexYAxis,
  ApexGrid,
  ApexFill,
  ApexTooltip,
} from 'ng-apexcharts';
import { environment } from 'environments/environment.prod';

export interface SpeedTestResponse {
  api_status: string;
  message: string;
  ping: string;
  download: string;
  upload: string;
}



type XYDataPoint = { x: number; y: number };
type XYSeries = { name: string; data: XYDataPoint[] };

@Component({
  selector: 'app-internet-speed-graph',
  templateUrl: './internet-speed-graph.component.html',
  styleUrls: ['./internet-speed-graph.component.scss'],
})
export class InternetSpeedGraphComponent implements OnInit, OnDestroy {

  public series: XYSeries[] = [
    { name: 'Upload', data: [] },
    { name: 'Download', data: [] },
  ];

  public connectionStatus: string = '';


  public chartOptions = {
    chart: {
      height: 230,
      type: 'line',
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: { show: true },
      zoom: { enabled: true },
    } as ApexChart,

    stroke: { curve: 'smooth', width: 3 } as ApexStroke,
    markers: { size: 4 } as ApexMarkers,
    xaxis: { type: 'numeric', labels: { show: false } } as ApexXAxis,
    yaxis: {
      min: 0,
      title: { text: 'Speed (Mbit/s)' },
    } as ApexYAxis,
    legend: { show: true, position: 'bottom' } as ApexLegend,
    dataLabels: { enabled: false } as ApexDataLabels,
    grid: { borderColor: '#e7e7e7' } as ApexGrid,
    fill: { opacity: 0.8 } as ApexFill,
    tooltip: { enabled: true, shared: true } as ApexTooltip,
  };

  private timerId: any;
  private maxDataPoints = 10;
  private requestSub?: Subscription;

  constructor(private http: HttpClient) {
        setTimeout(() => {
            this.pollSpeedTest();
        }, 3000); // 5000 milliseconds = 5 seconds
  }

  ngOnInit() {
    this.pollSpeedTest();
  }

  pollSpeedTest() {
    this.requestSub = this.fetchAndUpdateData().add(() => {
      // Wait 30s, then call the API again
      this.timerId = setTimeout(() => this.pollSpeedTest(), 30000);
    });
  }



  fetchAndUpdateData() {
    return this.http
      .get<any>(environment.apiUrl+'internetSpeed')
      .pipe(
        finalize(() => {
          // runs after request finishes
        })
      )
      .subscribe({
        next: (response) => {
          if (response.api_status !== 'success') {
            console.error('Speedtest API error:', response.message);
            this.connectionStatus = 'Internet not available';
            return;
          }

          this.connectionStatus = null; // Clear message if data received

          const upload = this.extractNumber(response.upload || '');
          const download = this.extractNumber(response.download || '');

          const lastX =
            this.series[0].data.length > 0
              ? this.series[0].data[this.series[0].data.length - 1].x
              : 0;
          const newX = lastX + 1;

          this.series[0].data.push({ x: newX, y: upload });
          this.series[1].data.push({ x: newX, y: download });

          if (this.series[0].data.length > this.maxDataPoints) {
            this.series[0].data.shift();
            this.series[1].data.shift();
          }

          this.series = [...this.series];
        },
        error: (error) => {
          console.error('API error:', error);
          this.connectionStatus = 'Internet not available';
        },
      });
  }

  extractNumber(value: string): number {
    if (!value) return 0;
    const match = value.match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearTimeout(this.timerId);
    }
    this.requestSub?.unsubscribe();
  }
}
