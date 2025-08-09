import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NicService } from 'app/api/nic-info.service';

@Component({
    selector: 'app-wap-logs',
    templateUrl: './wap-logs.component.html',
    styleUrls: ['./wap-logs.component.scss']
})
export class WapLogsComponent implements OnInit {

    loading = false;
    
    displayedColumns: string[] = [
        'time_stamp', 'client_ip', 'client_port',
        'host_ip', 'host_port', 'method', 'uri',
        'http_code', 'message', 'severity', 'ruleId'
    ];

    dataSource = new MatTableDataSource<any>([]);

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private nicService: NicService) {}

    ngOnInit(): void {
        this.fetchLogs();
    }

    fetchLogs(): void {
        this.loading = true;
        this.nicService.getModSecAuditLogsData().subscribe({
            next: (response) => {
                this.loading = false;
                console.log(response.data)
                if (response.api_status === 'success') {
                    console.log("success called");
                    console.log(response.data)
                    this.dataSource.data = response.data;
                    this.dataSource.paginator = this.paginator;
                }
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    refreshTable(): void {
        this.fetchLogs();
    }
}