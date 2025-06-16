import { Component, Input, OnInit } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';
import {ApexChart,ApexDataLabels,ApexFill,ApexLegend,ApexNonAxisChartSeries,ApexPlotOptions,ApexResponsive,ApexStroke} from 'ng-apexcharts';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

    alert: { type: FuseAlertType; message: string } = {type   : 'success',message: ''};
    showAlert: boolean = false;
    loading: boolean = true;
    data:any;
    

    public chartOptions: Partial<ChartOptions> = {};

    constructor(private getdashboardService: NicService)
    {

    }
    
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

    getUsageStats()
    {
        this.getdashboardService.getUsageStatsAPI()
            .pipe(
                catchError(error => {
                    //this.showTimedAlert("error", "Error Fetching Data")
                    // this.showAlert = true;
                    // this.alert.type="error";
                    // this.alert.message = "Error Fetching Data";
                    //this.loading = false;
                    return of({ api_status: 'error', message: 'Failed to fetch data' }); 
                })
            )
            .subscribe(response => 
            {
                this.showAlert = false;
                if (response.api_status === 'success') 
                {
                    // Assign values to individual variables
                    this.data = response;
                    console.log(this.data);
                    //this.loading = false;
                    //this.showAlert = true;
                    //this.showTimedAlert("success", "Updated Successfully")
                    // this.alert.message = "Updated Successfully";
                    // this.alert.type = "success";
                } 
                else 
                {
                    this.showTimedAlert("error", response.message || "Unknown error")
                    // this.showAlert = true;
                    // this.alert.message = response.message || "Unknown error";
                    // this.alert.type = "error";
                    this.loading = false;
                }
                
            });
    }
    
    showTimedAlert(type: FuseAlertType, message: string) {
        this.alert.type = type;
        this.alert.message = message;
        this.showAlert = true;
    
        // Automatically hide the alert after 5 seconds
        setTimeout(() => {
          this.showAlert = false;
        }, 2000);
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