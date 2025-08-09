import { Component, OnInit } from '@angular/core';
import { NicService } from 'app/api/nic-info.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mailscanner-logs',
  templateUrl: './mailscanner-logs.component.html',
  styleUrls: ['./mailscanner-logs.component.scss']
})
export class MailscannerLogsComponent implements OnInit {

  displayedColumns: string[] = ['log'];
  dataSourceAll = new MatTableDataSource<any>([]);
  dataSourceReject = new MatTableDataSource<any>([]);
  dataSourceSent = new MatTableDataSource<any>([]);

  constructor(private nicService: NicService) { }

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs() {
    this.nicService.getMailLogsData().subscribe((data: any) => {
      this.dataSourceAll.data = data.all_logs;
      this.dataSourceReject.data = data.reject_logs;
      this.dataSourceSent.data = data.sent_logs;
    });
  }
}