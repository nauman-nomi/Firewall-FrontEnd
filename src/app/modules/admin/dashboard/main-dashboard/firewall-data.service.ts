// firewall-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirewallDataService {
  constructor(private http: HttpClient) {}

  getSystemInfo(): Observable<any> {
    // In a real app, this would be an HTTP call to your backend
    return of({
      hostname: 'firewall-01',
      osName: 'Ubuntu',
      osVersion: '20.04 LTS',
      systemModel: 'Dell PowerEdge R640',
      serialNumber: 'ABC123456789',
      cpuTemperature: 45,
      coreCount: 8,
      totalStorage: 500 * 1024 * 1024 * 1024, // 500GB in bytes
      usedStorage: 150 * 1024 * 1024 * 1024, // 150GB in bytes
      totalMemory: 16 * 1024 * 1024 * 1024, // 16GB in bytes
      usedMemory: 8 * 1024 * 1024 * 1024, // 8GB in bytes
      processorUsage: 30,
      powerConsumption: 120,
      fanSpeed: 2500
    }).pipe(delay(500));
  }

  getLiveSystemInfo(): Observable<any> {
    // Simulate live data with small random variations
    return of({
      cpuTemperature: Math.floor(40 + Math.random() * 10),
      usedStorage: (150 + Math.random() * 5) * 1024 * 1024 * 1024,
      usedMemory: (8 + Math.random() * 2) * 1024 * 1024 * 1024,
      processorUsage: Math.floor(25 + Math.random() * 15),
      powerConsumption: Math.floor(110 + Math.random() * 20),
      fanSpeed: Math.floor(2400 + Math.random() * 200)
    }).pipe(delay(500));
  }

  getNetworkInfo(): Observable<any> {
    return of({
      defaultGateway: '192.168.1.1',
      dnsServers: ['8.8.8.8', '8.8.4.4'],
      nics: [
        { name: 'eth0', ipAddress: '192.168.1.100', trafficIn: 50 * 1024 * 1024, trafficOut: 20 * 1024 * 1024, latency: 12 },
        { name: 'eth1', ipAddress: '10.0.0.1', trafficIn: 30 * 1024 * 1024, trafficOut: 15 * 1024 * 1024, latency: 8 },
        { name: 'wlan0', ipAddress: '192.168.1.101', trafficIn: 10 * 1024 * 1024, trafficOut: 5 * 1024 * 1024, latency: 25 }
      ],
      bandwidthUsage: 100
    }).pipe(delay(500));
  }

  getLiveNetworkInfo(): Observable<any> {
    return of({
      nics: [
        { name: 'eth0', trafficIn: (50 + Math.random() * 20) * 1024 * 1024, trafficOut: (20 + Math.random() * 10) * 1024 * 1024, latency: Math.floor(10 + Math.random() * 5) },
        { name: 'eth1', trafficIn: (30 + Math.random() * 15) * 1024 * 1024, trafficOut: (15 + Math.random() * 8) * 1024 * 1024, latency: Math.floor(8 + Math.random() * 4) },
        { name: 'wlan0', trafficIn: (10 + Math.random() * 5) * 1024 * 1024, trafficOut: (5 + Math.random() * 3) * 1024 * 1024, latency: Math.floor(20 + Math.random() * 10) }
      ]
    }).pipe(delay(500));
  }

  getFirewallInfo(): Observable<any> {
    return of({
      totalRules: 125,
      droppedPackets: 3421,
      acceptedPackets: 12543,
      blockedIps: ['192.168.1.50', '10.0.0.15', '45.33.12.8', '78.46.125.3'],
      blockedIpCount: 4,
      firewallStatus: 'active',
      antivirusStatus: 'active',
      openPorts: [22, 80, 443, 53, 123],
      failedLoginAttempts: 3
    }).pipe(delay(500));
  }

  getLiveFirewallInfo(): Observable<any> {
    return of({
      droppedPackets: 3421 + Math.floor(Math.random() * 50),
      acceptedPackets: 12543 + Math.floor(Math.random() * 200),
      blockedIps: ['192.168.1.50', '10.0.0.15', '45.33.12.8', '78.46.125.3', `1.2.3.${Math.floor(Math.random() * 255)}`],
      blockedIpCount: 4 + Math.floor(Math.random() * 2),
      failedLoginAttempts: 3 + Math.floor(Math.random() * 2)
    }).pipe(delay(500));
  }

  getProcesses(): Observable<any> {
    return of([
      { name: 'firewalld', pid: 1234, cpuUsage: 15, memoryUsage: 200 * 1024 * 1024 },
      { name: 'nginx', pid: 2345, cpuUsage: 8, memoryUsage: 150 * 1024 * 1024 },
      { name: 'sshd', pid: 3456, cpuUsage: 2, memoryUsage: 50 * 1024 * 1024 },
      { name: 'systemd', pid: 1, cpuUsage: 1, memoryUsage: 100 * 1024 * 1024 },
      { name: 'snmpd', pid: 4567, cpuUsage: 3, memoryUsage: 80 * 1024 * 1024 }
    ]).pipe(delay(500));
  }

  getLiveProcesses(): Observable<any> {
    return of([
      { name: 'firewalld', pid: 1234, cpuUsage: 15 + Math.random() * 5, memoryUsage: (200 + Math.random() * 20) * 1024 * 1024 },
      { name: 'nginx', pid: 2345, cpuUsage: 8 + Math.random() * 3, memoryUsage: (150 + Math.random() * 15) * 1024 * 1024 },
      { name: 'sshd', pid: 3456, cpuUsage: 2 + Math.random(), memoryUsage: (50 + Math.random() * 5) * 1024 * 1024 },
      { name: 'systemd', pid: 1, cpuUsage: 1 + Math.random(), memoryUsage: (100 + Math.random() * 10) * 1024 * 1024 },
      { name: 'snmpd', pid: 4567, cpuUsage: 3 + Math.random(), memoryUsage: (80 + Math.random() * 8) * 1024 * 1024 }
    ]).pipe(delay(500));
  }

  getLoggedInUsers(): Observable<any> {
    return of(['admin', 'monitor']).pipe(delay(500));
  }

  getScheduledTasks(): Observable<any> {
    return of([
      '0 3 * * * /usr/bin/apt update',
      '0 4 * * * /usr/bin/apt upgrade -y',
      '*/5 * * * * /usr/bin/backup-script',
      '0 0 * * * /usr/bin/logrotate'
    ]).pipe(delay(500));
  }

  getStartupPrograms(): Observable<any> {
    return of(['firewalld', 'nginx', 'sshd', 'snmpd']).pipe(delay(500));
  }

  getInstalledSoftware(): Observable<any> {
    return of([
      { name: 'Ubuntu Base', version: '20.04', installDate: '2022-01-15' },
      { name: 'Firewalld', version: '0.9.3', installDate: '2022-01-15' },
      { name: 'Nginx', version: '1.18.0', installDate: '2022-01-16' },
      { name: 'ClamAV', version: '0.103.2', installDate: '2022-01-17' },
      { name: 'Snort', version: '2.9.17', installDate: '2022-01-18' }
    ]).pipe(delay(500));
  }
}