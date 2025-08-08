import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NicService } from 'app/api/nic-info.service';
import { FuseAlertType } from '@fuse/components/alert';
import { of } from 'rxjs';

@Component({
  selector: 'app-firewall-logs',
  templateUrl: './firewall-logs.component.html',
  styleUrls: ['./firewall-logs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FirewallLogsComponent implements OnInit {

  alert: { type: FuseAlertType; message: string } = { type: 'success', message: '' };
  showAlert: boolean = false;
  loading: boolean = false;

  firewallLogs: any[] = [];

  displayedColumns: string[] = ['rule', 'label', 'packets', 'bytes', 'last_active'];
  
  headerMapping: { [key: string]: string } = {
    rule: 'Rule',
    label: 'Label',
    packets: 'Packets',
    bytes: 'Bytes',
    last_active: 'Last Active'
  };

  constructor(private NicService: NicService) {}

  ngOnInit(): void {
    this.fetchLogs();
  }

  showTimedAlert(type: FuseAlertType, message: string) {
    this.alert.type = type;
    this.alert.message = message;
    this.showAlert = true;
    setTimeout(() => (this.showAlert = false), 2000);
  }

  fetchLogs(): void {
    this.loading = true;

    this.NicService.getFirewallLogsData()
      .pipe(
        // catchError(error => {
        //   this.showTimedAlert('error', 'Failed to fetch firewall logs');
        //   this.loading = false;
        //   return of({ api_status: 'fail', data: [] });
        // })
      )
      .subscribe(response => {
        this.loading = false;
        if (response.api_status === 'success') {
          this.firewallLogs = response.data.rules;
          this.showTimedAlert('success', 'Logs updated successfully');
        } else {
          this.showTimedAlert('error', response.message || 'Unknown error');
        }
      });
  }

  refreshTable(): void {
    this.fetchLogs();
  }
}
