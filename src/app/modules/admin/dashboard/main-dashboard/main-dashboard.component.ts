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
  
    alert: { type: FuseAlertType; message: string } = {type   : 'success',message: ''};
    showAlert: boolean = false;
    loading: boolean = true;

    dateTime :any;
    // System Information
    systemInfo = {
        hostname: 'FreeBSD',
        model: 'Dell PowerEdge R740',
        serialNumber: 'ABC123XYZ456',
        cpuTemp: '42°C',
        cores: 16,
        powerConsumption: '120W',
        interfacesCount:'',
        failed_login_attempts:'',
        blocked_ip_count:'',
        firewallRules:'',
        open_ports_count:'',
        AntivirusStatus:'',
        FirewallStatus:'',
        defaultGateway:'',
        dns:'',
        open_ports:'',
        loggedInUsers: [],
        top_processes: [],



        totalStorage: '2 TB',
        usedStorage: '1.2 TB',
        totalMemory: '64 GB',
        usedMemory: '42 GB',
        fanSpeed: '2400 RPM',
        
    };

    // Resource Usage
    storage = {
        total: 2000,
        used: 1200,
        percentage: 60
    };

    memory = {
        total: 64,
        used: 42,
        percentage: 65.6
    };

    cpu = {
        total: 100,
        used: 78,
        percentage: 78
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
        firewallRules: 42,
        droppedPackets: 128,
        acceptedPackets: 12542,
        blockedIps: ['192.168.1.100', '10.0.0.15', '45.33.12.8'],
        blockedIpCount: 3,
        firewallStatus: 'Active',
        antivirusStatus: 'Enabled',
        openPorts: [22, 80, 443, 3306],
        failedLogins: 3
    };

    // Processes & Services
    topProcesses = [
        { pid: 1234, name: 'nginx', cpu: 12.4, memory: 2.1 },
        { pid: 5678, name: 'mysql', cpu: 8.7, memory: 5.3 },
        { pid: 9012, name: 'node', cpu: 6.2, memory: 1.8 },
        { pid: 3456, name: 'redis', cpu: 3.5, memory: 0.9 }
    ];

    startupPrograms = ['nginx', 'mysql', 'redis', 'pm2', 'cron'];
    installedSoftware = ['nginx/1.18.0', 'mysql/8.0.25', 'nodejs/14.17.0', 'redis/6.2.4'];

    private intervalId: any;

    refresh()
    {

    }

    constructor(private getdashboardService: NicService,private cdr: ChangeDetectorRef)
    {
        this.getDashboard();
    }
    ngOnDestroy() {
        clearInterval(this.intervalId); // Clean up
      }

    getDashboard()
    {
        
        this.getDateTime();
        this.getSystemInfo();
        // this.intervalId = setInterval(() => {
        //     this.getDateTime();
        // }, 1000); // Every second

        // this.intervalId = setInterval(() => {
        //     this.getSystemInfo();
        // }, 60000); // Every Minutes

        

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

    getDateTime()
    {
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
            .subscribe(response => 
            {
                this.showAlert = false;
                if (response.api_status === 'success') 
                {
                    // Assign values to individual variables
                    this.dateTime = response.dateTime;
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
        //this.cdr.detectChanges(); 
    }

    getSystemInfo()
    {
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
            .subscribe(response => 
            {
                this.showAlert = false;
                if (response.api_status === 'success') 
                {
                    // Assign values to individual variables
                    this.systemInfo.hostname = response.hostname;
                    this.systemInfo.model = response.model;
                    this.systemInfo.serialNumber = response.serialNumber;
                    this.systemInfo.cpuTemp = response.cpuTemp;
                    this.systemInfo.cores = response.cores;
                    this.systemInfo.powerConsumption = response.powerConsumption;
                    this.systemInfo.interfacesCount = response.interfacesCount;
                    this.systemInfo.failed_login_attempts = response.failed_login_attempts;
                    this.systemInfo.blocked_ip_count = response.blocked_ip_count;
                    this.systemInfo.firewallRules = response.firewallRules;
                    this.systemInfo.open_ports_count = response.open_ports_count;
                    this.systemInfo.AntivirusStatus = response.AntivirusStatus;
                    this.systemInfo.FirewallStatus = response.FirewallStatus;
                    this.systemInfo.defaultGateway = response.defaultGateway.trim().split(/\s+/)[1];
                    this.systemInfo.dns = response.dns.trim().split(/\s+/)[1];
                    this.systemInfo.open_ports = response.open_ports;
                    this.systemInfo.loggedInUsers = response.logged_in_users;
                    this.systemInfo.top_processes = response.top_processes;


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
}
