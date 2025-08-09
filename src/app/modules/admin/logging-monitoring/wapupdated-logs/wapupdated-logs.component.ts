import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { NicService } from 'app/api/nic-info.service';

@Component({
  selector: 'app-wapupdated-logs',
  templateUrl: './wapupdated-logs.component.html',
  styleUrls: ['./wapupdated-logs.component.scss']
})
export class WapupdatedLogsComponent implements OnInit {

  displayedColumns: string[] = ['log'];
  dataSourceHistory = new MatTableDataSource<string>();
  dataSourceStatus = new MatTableDataSource<string>();
  dataSourceUpdate = new MatTableDataSource<string>();

  constructor(private nicService: NicService) { }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs() {
    this.nicService.getModSecCRSUpdateHistoryData().subscribe(res => {
      this.dataSourceHistory.data = res.logs;
    });
    this.nicService.getModSecCRSUpdateStatusData().subscribe(res => {
      this.dataSourceStatus.data = res.logs;
    });
    this.nicService.getModSecUpdateData().subscribe(res => {
      this.dataSourceUpdate.data = res.logs;
    });
  }
}
