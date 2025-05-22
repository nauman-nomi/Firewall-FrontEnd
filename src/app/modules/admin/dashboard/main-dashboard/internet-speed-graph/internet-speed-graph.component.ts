import { Component, OnInit, ViewChild } from '@angular/core';
import {ApexChart,ApexAxisChartSeries,ApexXAxis,ApexTitleSubtitle,ApexStroke,ApexDataLabels, ChartComponent, ApexGrid, ApexFill, ApexOptions } from 'ng-apexcharts';

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
    stroke: ApexStroke;
    dataLabels: ApexDataLabels;
    grid:ApexGrid;
    fill: ApexFill;
    
};

@Component({
    selector: 'app-internet-speed-graph',
    templateUrl: './internet-speed-graph.component.html',
    styleUrls: ['./internet-speed-graph.component.scss']
})
export class InternetSpeedGraphComponent implements OnInit 
{
    @ViewChild('chart') chartComponent!: ChartComponent;
  
    public speedData: number[] = [];
    public labels: string[] = [];
    public maxPoints = 10;
    public chartOptions: Partial<ApexOptions> = 
    {
        series: [
            {
              name: 'Download Speed (Mbps)',
              data: [],
            },
          ],
          chart: {
            type: 'area',
            height: 250,
            animations: {
              enabled: true,
              easing: 'linear',
              dynamicAnimation: { speed: 500 },
            },
          },
          xaxis: {
            categories: [],
            labels: {
              show: false,
            },
          },
          stroke: {
            curve: 'smooth',
            width: 3,
            colors: ['#87CEEB'] // <-- Curve color here
          },
          colors: ['#FF5733'], // <-- Primary series color
          dataLabels: { enabled: false },
          grid: { borderColor: '#e7e7e7' },
          fill: {
            type: 'gradient',
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.6,
              opacityTo: 0.1,
              stops: [0, 90, 100]
            }
          },
          title: {
            text: 'Live Internet Speed (Simulated)',
            align: 'center'
          },
        };
  
    ngOnInit(): void {
        setInterval(() => this.addRandomSpeed(), 2000);
    }
  
    addRandomSpeed() {
        const randomSpeed = +(Math.random() * 90 + 10).toFixed(1);
        const now = new Date().toLocaleTimeString();
    
        // Add new value to arrays
        this.speedData.push(randomSpeed);
        this.labels.push(now);
    
        // Keep maxPoints length
        if (this.speedData.length > this.maxPoints) {
            this.speedData.shift();
            this.labels.shift();
        }
    
        // Update chart with NEW arrays (important!)
        this.chartComponent.updateSeries([
            {
                name: 'Download Speed (Mbps)',
                data: [...this.speedData],
            },
        ]);
    
        this.chartComponent.updateOptions({
            xaxis: { categories: [...this.labels] },
        });
    }
}