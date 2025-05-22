import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';


@Component({
    selector: 'app-main-dashboard',
    templateUrl: './main-dashboard.component.html',
    styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent {
  
    alert: { type: FuseAlertType; message: string } = {type   : 'success',message: ''};
    showAlert: boolean = false;
    loading: boolean = true;
    // System Information
    systemInfo = {
        hostname: 'FreeBSD',
        model: 'Dell PowerEdge R740',
        dateTime: new Date().toLocaleString(),
        serialNumber: 'ABC123XYZ456',
        cpuTemp: '42°C',
        cores: 16,
        totalStorage: '2 TB',
        usedStorage: '1.2 TB',
        totalMemory: '64 GB',
        usedMemory: '42 GB',
        powerConsumption: '120W',
        fanSpeed: '2400 RPM',
        loggedUsers: ['admin', 'user1', 'service-account']
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

    refresh()
    {

    }
}
