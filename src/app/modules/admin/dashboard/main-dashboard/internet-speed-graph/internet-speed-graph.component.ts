import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApexChart, ApexXAxis, ApexStroke, ApexMarkers, ApexLegend, ApexDataLabels, ApexYAxis, ApexGrid, ApexFill, ApexTooltip,} from 'ng-apexcharts';

type XYDataPoint = { x: number; y: number };
type XYSeries = { name: string; data: XYDataPoint[];};

@Component({
    selector: 'app-internet-speed-graph',
    templateUrl: './internet-speed-graph.component.html',
    styleUrls: ['./internet-speed-graph.component.scss']
})
export class InternetSpeedGraphComponent implements OnInit 
{
    public series: XYSeries[] = [
      { name: 'Upload', data: [] },
      { name: 'Download', data: [] },
    ];
    
    constructor(private http: HttpClient) {}

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
  
        xaxis: {
          type: 'numeric',
          labels: {
            show: false  // <-- Hide the x-axis labels here
          },
          // title: { text: 'Time (s)' },
        } as ApexXAxis,
  
        yaxis: {
            min: 0,
            // max: 100,
            // title: { text: 'Value' },
        } as ApexYAxis,
  
        legend: { show: true, position: 'bottom' } as ApexLegend,
  
        dataLabels: { enabled: false } as ApexDataLabels,
  
        grid: { borderColor: '#e7e7e7' } as ApexGrid,
  
        fill: { opacity: 0.8 } as ApexFill,
  
        tooltip: { enabled: true, shared: true } as ApexTooltip,
    };
  
    private timerId: any;
    private maxDataPoints = 20;
  
    ngOnInit() {
        // this.timerId = setInterval(() => this.updateSeriesData(), 5000);
        this.timerId = setInterval(() => this.fetchAndUpdateData(), 5000);
    }

    fetchAndUpdateData() {
        this.http.get<any>('http://raonazariqbal.nayatel.net:8080/api/internetspeed.py').subscribe({
          next: (response) => {
            // Assuming API returns: { upload: number, download: number }
            const upload = response.upload;
            const download = response.download;
    
            const lastX = this.series[0].data.length > 0
              ? this.series[0].data[this.series[0].data.length - 1].x
              : 0;
            const newX = lastX + 1;
    
            this.series[0].data.push({ x: newX, y: upload });
            this.series[1].data.push({ x: newX, y: download });
    
            if (this.series[0].data.length > this.maxDataPoints) {
              this.series[0].data.shift();
              this.series[1].data.shift();
            }
    
            // Trigger change detection
            this.series = [...this.series];
          },
          error: (error) => {
            console.error('API error:', error);
          }
        });
      }
  
    updateSeriesData() {
        const lastX =
            this.series[0].data.length > 0
                ? this.series[0].data[this.series[0].data.length - 1].x
                : 0;
        const newX = lastX + 1;
  
        this.series.forEach((serie) => {
            if (serie.data.length >= this.maxDataPoints) {
                serie.data.shift();
            }
            const randomVal = Math.floor(Math.random() * 80) + 10; // 10 - 90
            serie.data.push({ x: newX, y: randomVal });
        });
  
        // Refresh the series reference for change detection
        this.series = [...this.series];
    }
  
    ngOnDestroy() {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
    }
}