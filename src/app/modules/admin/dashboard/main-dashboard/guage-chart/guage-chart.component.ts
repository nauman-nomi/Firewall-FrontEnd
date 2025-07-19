import { ChangeDetectorRef, Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';

import { catchError, switchMap } from 'rxjs/operators';

import {
    ApexChart, ApexDataLabels, ApexFill, ApexLegend, ApexNonAxisChartSeries,
    ApexPlotOptions, ApexResponsive, ApexStroke
} from 'ng-apexcharts';
import { Subscription, interval, of } from 'rxjs';


export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    plotOptions: ApexPlotOptions;
    stroke?: ApexStroke;
    dataLabels?: ApexDataLabels;
    fill: ApexFill;
    responsive?: ApexResponsive[];
    legend: ApexLegend;
};

@Component({
    selector: 'app-guage-chart',
    templateUrl: './guage-chart.component.html',
    styleUrls: ['./guage-chart.component.scss']
})
export class GuageChartComponent implements OnInit, OnDestroy {
    @Input() category: 'ram' | 'storage' | 'processor' = 'ram';
    title: string = '';
    stats: string = '';
    alert: { type: FuseAlertType; message: string } = { type: 'success', message: '' };
    showAlert: boolean = false;
    chartOptions: Partial<ChartOptions> = {};
    private pollSub!: Subscription;

    constructor(private getdashboardService: NicService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.setTitle();
        this.initializeChart();

        // Poll every 10 seconds
        this.pollSub = interval(10000).pipe(
            switchMap(() =>
                this.getdashboardService.getUsageStatsAPI().pipe(
                    catchError(error => {
                        console.error('API error occurred:', error);
                        return of(null); // Gracefully return null to keep polling alive
                    })
                )
            )
        ).subscribe(response => {
            if (response && response.api_status === 'success') {
                this.updateChart(response);
            } else {
                console.warn('Invalid or failed response from getUsageStatsAPI');
            }
        });
    }

    ngOnDestroy(): void {
        if (this.pollSub) {
            this.pollSub.unsubscribe();
        }
    }

    private setTitle(): void {
        if (this.category === 'ram') {
            this.title = 'RAM';
        } else if (this.category === 'storage') {
            this.title = 'Storage';
        } else if (this.category === 'processor') {
            this.title = 'Processor';
        }
    }

    private initializeChart(): void {
        let color = this.category === 'ram' ? '#00BFFF'
            : this.category === 'storage' ? '#FFA500'
                : '#008000';

        this.chartOptions = {
            series: [0],
            chart: {
                type: 'radialBar',
                height: 200,
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    dynamicAnimation: { speed: 1000 }
                }
            },
            legend: { show: true, position: 'bottom' },
            labels: [''],
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 135,
                    hollow: { size: '60%' },
                    track: {
                        background: '#f0f0f0',
                        strokeWidth: '97%',
                        margin: 5
                    },
                    dataLabels: {
                        name: {
                            fontSize: '16px',
                            color: '#333',
                            offsetY: -70
                        },
                        value: {
                            formatter: (val: number) => `${val}%`,
                            fontSize: '20px',
                            color: '#111',
                            offsetY: 0,
                            show: true
                        }
                    }
                }
            },
            fill: { colors: [color] }
        };
    }

    private updateChart(response: any): void {
        if (this.category === 'ram') {
            const total = this.parseGB(response.total_ram);
            const free = this.parseMB(response.ram_usage.free);
            const used = total > 0 ? 100 - ((free / total) * 100) : 0;
            this.stats = `${(total - free).toFixed(1)} / ${total} GB`;
            this.chartOptions.series = [Math.round(used)];
        } else if (this.category === 'processor') {
            const cpuUsage = 100 - parseFloat(response.cpu_usage.idle || '0');
            this.stats = `${cpuUsage.toFixed(1)}%`;
            this.chartOptions.series = [Math.round(cpuUsage)];
        } else if (this.category === 'storage') {
            const used = parseFloat((response.storage_usage?.capacity || '0').replace('%', ''));
            const size = response.storage_usage?.size || '';
            const usedSize = response.storage_usage?.used || '';
            this.stats = `${usedSize} / ${size}`;
            this.chartOptions.series = [used];
        }
        this.cdr.detectChanges();
    }

    private parseGB(str: string): number {
        return parseFloat(str.replace('GB', '').trim());
    }

    private parseMB(str: string): number {
        return parseFloat(str.replace('M', '').trim()) / 1024;
    }

    showTimedAlert(type: FuseAlertType, message: string) {
        this.alert = { type, message };
        this.showAlert = true;
        setTimeout(() => this.showAlert = false, 2000);
    }
}
