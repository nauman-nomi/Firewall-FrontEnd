import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
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

// Backend response shape
export interface NicTrafficResponse {
    api_status: string;
    message: string;
    interfaces: Array<{
        name: string;
        rx_bytes_per_sec: number;
        tx_bytes_per_sec: number;
    }>;
}

type XYDataPoint = { x: number; y: number };

type XYSeries = {
    name: string;
    data: XYDataPoint[];
};

@Component({
    selector: 'app-traffic-graph',
    templateUrl: './traffic-graph.component.html',
    styleUrls: ['./traffic-graph.component.scss'],
})
export class TrafficGraphComponent implements OnInit, OnDestroy {
    public series: XYSeries[] = [];

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
            labels: { show: false },
        } as ApexXAxis,

        yaxis: {
            min: 0,
            title: { text: 'MB/s' },
            labels: {
                formatter: (val) => `${val.toFixed(2)} MB/s`,
            },
        } as ApexYAxis,

        legend: { show: true, position: 'bottom' } as ApexLegend,

        dataLabels: { enabled: false } as ApexDataLabels,

        grid: { borderColor: '#e7e7e7' } as ApexGrid,

        fill: { opacity: 0.8 } as ApexFill,

        tooltip: {
            enabled: true,
            shared: true,
            y: {
                formatter: (val) => `${val.toFixed(2)} MB/s`,
            },
        } as ApexTooltip,
    };

    private timerId: any;
    private maxDataPoints = 10;
    private requestSub?: Subscription;

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.pollNicTraffic();
    }

    pollNicTraffic() {
        this.requestSub = this.fetchAndUpdateData().add(() => {
            this.timerId = setTimeout(() => this.pollNicTraffic(), 30000);
        });
    }

    fetchAndUpdateData() {
        return this.http
            .get<NicTrafficResponse>('http://127.0.0.1:8000/nicTraffic')
            .pipe(
                finalize(() => {
                    // Called after API request completes
                })
            )
            .subscribe({
                next: (response) => {
                    if (response.api_status !== 'success') {
                        console.error('NIC API error:', response.message);
                        return;
                    }

                    const newX = this.series.length > 0 && this.series[0].data.length > 0
                        ? this.series[0].data[this.series[0].data.length - 1].x + 1
                        : 1;

                    response.interfaces.forEach((iface) => {
                        // Add or update RX
                        this.updateOrCreateSeries(`${iface.name} RX`, newX, iface.rx_bytes_per_sec);

                        // Add or update TX
                        this.updateOrCreateSeries(`${iface.name} TX`, newX, iface.tx_bytes_per_sec);
                    });

                    // Refresh reference for chart change detection
                    this.series = [...this.series];
                },
                error: (err) => {
                    console.error('API error:', err);
                },
            });
    }

    updateOrCreateSeries(seriesName: string, x: number, y: number) {
        let serie = this.series.find(s => s.name === seriesName);

        if (!serie) {
            serie = { name: seriesName, data: [] };
            this.series.push(serie);
        }

        const scaledY = y / (1024 * 1024);
        serie.data.push({ x, y: scaledY });

        if (serie.data.length > this.maxDataPoints) {
            serie.data.shift();
        }
    }

    ngOnDestroy() {
        if (this.timerId) {
            clearTimeout(this.timerId);
        }
        this.requestSub?.unsubscribe();
    }
}
