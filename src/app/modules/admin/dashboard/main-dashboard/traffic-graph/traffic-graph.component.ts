import { Component, OnDestroy, OnInit } from '@angular/core';
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

type XYDataPoint = { x: number; y: number };

type XYSeries = {
  name: string;
  data: XYDataPoint[];
};

@Component({
  selector: 'app-traffic-graph',
  templateUrl: './traffic-graph.component.html',
  styleUrls: ['./traffic-graph.component.scss']
})
export class TrafficGraphComponent implements OnInit, OnDestroy {
    public series: XYSeries[] = [
        { name: 'NIC 1', data: [] },
        { name: 'NIC 2', data: [] },
        { name: 'NIC 3', data: [] },
    ];

    public chartOptions = {
        chart: {
            height: 250,
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
            max: 100,
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
        this.timerId = setInterval(() => this.updateSeriesData(), 5000);
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