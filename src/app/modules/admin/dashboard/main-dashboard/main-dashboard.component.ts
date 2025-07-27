import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Component({
    selector: 'app-main-dashboard',
    templateUrl: './main-dashboard.component.html',
    styleUrls: ['./main-dashboard.component.scss']
})

export class MainDashboardComponent {

    alert: { type: FuseAlertType; message: string } = { type: 'success', message: '' };
    showAlert: boolean = false;
    loading: boolean = true;

    datetimeInterval: any;
    sysInfoInterval: any;

    dateTime: any;
    // System Information
    systemInfo = {
        hostname: 'NA',
        model: 'NA',
        serialNumber: 'Not Fetch',
        cpuTemp: '0',
        cores: '0',
        powerConsumption: '0',
        interfacesCount: '',
        failed_login_attempts: '',
        blocked_ip_count: '',
        firewallRules: '',
        open_ports_count: '',
        AntivirusStatus: '',
        FirewallStatus: '',
        defaultGateway: '',
        dns: '',
        open_ports: '',
        loggedInUsers: [],
        top_processes: [],
        fanSpeed: '',
        acceptedPackets: '',
        droppedPackets: ''
    };


    tasks = [
        { id: 1, schedule: '0 2 * * *', command: 'backup-db' },
        { id: 2, schedule: '*/5 * * * *', command: 'check-updates' },
        { id: 3, schedule: '0 0 * * 0', command: 'weekly-report' }
    ];

    // Network Information
    networkInfo = {
        defaultGateway: '192.168.1.1',
        dns: '8.8.8.8, 8.8.4.4',
        nics: [
            { name: 'eth0', bandwidth: '1 Gbps', traffic: '450 Mbps', latency: '24 ms' },
            { name: 'eth1', bandwidth: '1 Gbps', traffic: '120 Mbps', latency: '18 ms' },
            { name: 'wlan0', bandwidth: '300 Mbps', traffic: '85 Mbps', latency: '32 ms' }
        ],
        totalNics: 3
    };

    // Security Information
    securityInfo = {
        firewallRules: '0',
        droppedPackets: '0',
        acceptedPackets: '0',
        blockedIps: ['0'],
        blockedIpCount: '0',
        firewallStatus: '0',
        antivirusStatus: 'NA',
        openPorts: ['0'],
        failedLogins: 'NA'
    };

    fanPacket = {
        fanSpeed: '0',
        acceptedPackets: '0',
        droppedPackets: '0',
    };



    startupPrograms = ['nginx', 'mysql', 'redis', 'pm2', 'cron'];
    installedSoftware = ['nginx/1.18.0', 'mysql/8.0.25', 'nodejs/14.17.0', 'redis/6.2.4'];

    private intervalId: any;

    refresh() {

    }

    constructor(private getdashboardService: NicService, private cdr: ChangeDetectorRef) {
        this.getDashboard();
    }

    ngOnDestroy() {
        clearInterval(this.datetimeInterval);
        clearInterval(this.sysInfoInterval);
    }

    getDashboard() {

        // this.getSystemInfo();
        this.getFanPacketInfo();


        setTimeout(() => {
            this.getDateTime();
        }, 1000); // 5000 milliseconds = 5 seconds

        setTimeout(() => {
            this.getSystemInfo();
        }, 3000); // 5000 milliseconds = 5 seconds

        setTimeout(() => {
            this.getSysInformation();
        }, 5000); // 5000 milliseconds = 5 seconds

        if (!this.datetimeInterval) {
            this.datetimeInterval = setInterval(() => this.getDateTime(), 10000);
        }

        if (!this.sysInfoInterval) {
            this.sysInfoInterval = setInterval(() => this.getSystemInfo(), 600000);
        }

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

    getDateTime() {
        this.getdashboardService.getDateTimeAPI()
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
            .subscribe(response => {
                this.showAlert = false;
                if (response.api_status === 'success') {
                    // Assign values to individual variables
                    this.dateTime = response.dateTime;
                    //this.loading = false;
                    //this.showAlert = true;
                    //this.showTimedAlert("success", "Updated Successfully")
                    // this.alert.message = "Updated Successfully";
                    // this.alert.type = "success";
                }
                else {
                    this.showTimedAlert("error", response.message || "Unknown error")
                    // this.showAlert = true;
                    // this.alert.message = response.message || "Unknown error";
                    // this.alert.type = "error";
                    this.loading = false;
                }

            });
        //this.cdr.detectChanges(); 
    }

    getSystemInfo() {
        this.getdashboardService.getSystemInfoAPI()
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
            .subscribe(response => {
                this.showAlert = false;
                if (response.api_status === 'success') {
                    // Assign values to individual variables
                    this.systemInfo.hostname = response.hostname;
                    this.systemInfo.model = response.model;
                    this.systemInfo.serialNumber = response.serialNumber;
                    this.systemInfo.cpuTemp = response.cpuTemp;
                    this.systemInfo.cores = response.cores;

                    this.systemInfo.interfacesCount = response.interfacesCount;
                    this.systemInfo.failed_login_attempts = response.failed_login_attempts;
                    this.systemInfo.blocked_ip_count = response.blocked_ip_count;
                    this.systemInfo.firewallRules = response.firewallRules;


                    this.systemInfo.FirewallStatus = response.FirewallStatus;
                    this.systemInfo.defaultGateway = response.defaultGateway;
                    this.systemInfo.dns = response.dns;

                    //this.loading = false;
                    //this.showAlert = true;
                    //this.showTimedAlert("success", "Updated Successfully")
                    // this.alert.message = "Updated Successfully";
                    // this.alert.type = "success";
                }
                else {
                    this.showTimedAlert("error", response.message || "Unknown error")
                    // this.showAlert = true;
                    // this.alert.message = response.message || "Unknown error";
                    // this.alert.type = "error";
                    this.loading = false;
                }

            });
    }

    getSysInformation() {
        this.getdashboardService.getSysInformationAPI()
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
            .subscribe(response => {
                this.showAlert = false;
                if (response.api_status === 'success') {
                    // Assign values to individual variables
                    this.systemInfo.loggedInUsers = response.logged_in_users;
                    this.systemInfo.top_processes = response.top_processes;
                    this.systemInfo.powerConsumption = response.powerConsumption;
                    this.systemInfo.open_ports_count = response.open_ports_count;
                    this.systemInfo.open_ports = response.open_ports;
                    const clamavStatus = response.antivirus_status || '';

                    if (clamavStatus.toLowerCase().includes('running')) {
                        this.systemInfo.AntivirusStatus = 'Enabled';
                    } else {
                        this.systemInfo.AntivirusStatus = 'Disabled';
                    }

                    //this.loading = false;
                    //this.showAlert = true;
                    //this.showTimedAlert("success", "Updated Successfully")
                    // this.alert.message = "Updated Successfully";
                    // this.alert.type = "success";
                }
                else {
                    this.showTimedAlert("error", response.message || "Unknown error")
                    // this.showAlert = true;
                    // this.alert.message = response.message || "Unknown error";
                    // this.alert.type = "error";
                    this.loading = false;
                }

            });
    }



    getFanPacketInfo() {
        this.getdashboardService.getFanPacketAPI()
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
            .subscribe(response => {
                this.showAlert = false;
                if (response.api_status === 'success') {
                    // Assign values to individual variables
                    this.fanPacket.fanSpeed = response.fanSpeed;
                    this.fanPacket.acceptedPackets = response.acceptedPackets;
                    this.fanPacket.droppedPackets = response.droppedPackets;

                }
                else {
                    this.showTimedAlert("error", response.message || "Unknown error")
                    // this.showAlert = true;
                    // this.alert.message = response.message || "Unknown error";
                    // this.alert.type = "error";
                    this.loading = false;
                }

            });
    };

}
