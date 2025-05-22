import { Component, Input, OnInit } from '@angular/core';
import {ApexChart,ApexDataLabels,ApexFill,ApexLegend,ApexNonAxisChartSeries,ApexPlotOptions,ApexResponsive,ApexStroke} from 'ng-apexcharts';

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    plotOptions: ApexPlotOptions;
    stroke?: ApexStroke;
    dataLabels?: ApexDataLabels;
    fill: ApexFill;
    responsive?: ApexResponsive[];
    legend: ApexLegend,
};

@Component({
    selector: 'app-guage-chart',
    templateUrl: './guage-chart.component.html',
    styleUrls: ['./guage-chart.component.scss']
})
export class GuageChartComponent implements OnInit {
    @Input() category: any; 
    title:string="";
    stats:string="";
    

    public chartOptions: Partial<ChartOptions> = {};
    
    ngOnInit(): void {
        if(this.category =="ram"){
            this.title = "RAM";
            this.stats = "8 / 16 GB";
            this.initializeChartRAM();
            this.startRamUsageSimulation();
        }
        else if(this.category == "storage")
        {
            this.title = "Storage";
            this.stats = "100 / 200 TB";
            this.initializeChartStorage();
            this.startStorageUsageSimulation();
        }
        else if(this.category == "processor")
        {
            this.title = "Processor";
            this.stats = "1.6 / 2.4 GHz"
            this.initializeChartProcessor();
            this.startProcessorUsageSimulation();
        }
    }

    private initializeChartRAM(): void {
        this.chartOptions = {
            series: [0],
            chart: {
                type: 'radialBar',
                height: 200,
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    dynamicAnimation: {
                        speed: 1000
                    }
                }
            },
            legend: { show: true, position: 'bottom' },
            labels: [''],
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 135,
                    hollow: {
                        size: '60%'
                    },
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
            fill: {
                colors: ['#00BFFF']
            }
        };
    }

    private startRamUsageSimulation(): void {
        setInterval(() => {
            const simulatedUsage = this.generateRandomUsage();
            this.chartOptions.series = [simulatedUsage];
        }, 2000);
    }

    private initializeChartStorage(): void {
        this.chartOptions = {
            series: [0],
            chart: {
                type: 'radialBar',
                height: 200,
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    dynamicAnimation: {
                        speed: 1000
                    }
                }
            },
            legend: { show: true, position: 'bottom' },
            labels: [''],
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 135,
                    hollow: {
                        size: '60%'
                    },
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
            fill: {
                colors: ['#FFA500']
            }
        };
    }

    private startStorageUsageSimulation(): void {
        setInterval(() => {
            const simulatedUsage = this.generateRandomUsage();
            this.chartOptions.series = [simulatedUsage];
        }, 2000);
    }

    private initializeChartProcessor(): void {
        this.chartOptions = {
            series: [0],
            chart: {
                type: 'radialBar',
                height: 200,
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    dynamicAnimation: {
                        speed: 1000
                    }
                }
            },
            legend: { show: true, position: 'bottom' },
            labels: [''],
            plotOptions: {
                radialBar: {
                    startAngle: -135,
                    endAngle: 135,
                    hollow: {
                        size: '60%'
                    },
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
            fill: {
                colors: ['#008000']
            }
        };
    }

    private startProcessorUsageSimulation(): void {
        setInterval(() => {
            const simulatedUsage = this.generateRandomUsage();
            this.chartOptions.series = [simulatedUsage];
        }, 2000);
    }

    private generateRandomUsage(): number {
        return Math.floor(Math.random() * 101); // 0 to 100%
    }
}