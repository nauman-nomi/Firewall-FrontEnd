import { Component, OnInit } from '@angular/core';


import { MatDialog } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { WarningDialogComponent } from '../../common/dialogs/warning-dialog/warning-dialog.component';
import { EmailGwFormComponent } from './email-gw-form/email-gw-form.component';
import { NicService } from 'app/api/nic-info.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ViewEmailGwDetailsComponent } from './view-email-gw-details/view-email-gw-details.component';


@Component({
  selector: 'app-email-gateway',
  templateUrl: './email-gateway.component.html',
  styleUrls: ['./email-gateway.component.scss']
})
export class EmailGatewayComponent implements OnInit {

  alert: { type: FuseAlertType; message: string } = { type: 'success', message: '' };
  showAlert: boolean = false;
  loading: boolean = true;

  data: any[] = [];

  headerMapping: { [key: string]: string } = {
    domain: 'Domain Name',
    ip: 'IP',
    port: 'Port',
    smtptype: 'Type',
    emailgw_action: 'Action'
  };

  displayedColumns: string[] = [
    'domain', 'ip', 'port', 'smtptype', 'emailgw_action'
  ];

  constructor(public dialog: MatDialog, private getEmailGwService: NicService) {
    this.getEmailGwInfo();
  }

  refreshTable() {
    this.getEmailGwInfo();
  }

  getEmailGwInfo() {
    this.loading = true;
    this.getEmailGwService.getEmailGwListAPI()
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
        //if (response.api_status === 'success') 
        if (true) {
          // Assign values to individual variables
          this.data = response.data;
          console.log(response);
          this.loading = false;
          this.showAlert = true;
          this.showTimedAlert("success", "Updated Successfully")
          this.alert.message = "Updated Successfully";
          this.alert.type = "success";
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
    // this.data = [{"domain_name": "abc.com","ip_port": "192.168.3.3:80","modSec": "ON","web_type": "http","ip_whitelist": "1.2.3.4/24","method_whitelist": "GET,POST"
    // },{"domain_name": "123.com","ip_port": "192.168.3.4:80","modSec": "OFF","web_type": "https","ip_whitelist": "1.2.3.4","method_whitelist": "GET,POST,DELETE"
    // }];
  }

  ngOnInit(): void {
  }

  addEmailGW() {
    const dialogRef = this.dialog.open(EmailGwFormComponent, {
      width: '700px',
      // disableClose: true,
      data: { title: 'Add Email Gateway', row: "", sep: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('Dialog closed', result);
      this.refreshTable()
      this.showTimedAlert("success", "Updated successfully")
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

  onEditRow(row: any): void {
    if (row.sep == "emailgw-delete") {
      console.log("delete");
      console.log(row);
      const dialogRef = this.dialog.open(WarningDialogComponent, {
        width: '700px',
        disableClose: true,
        data: { title: 'Delete Email Gateway Security', row: row, message: "Are you sure you want to delete Email Gateway Security?", action: "delete-email-gw-sec" }
      });
      dialogRef.afterClosed().subscribe(result => {
        // console.log('Dialog closed', result);
        this.refreshTable()
        this.showTimedAlert("success", "Updated successfully")
      });
    }
    else if (row.sep == "emailgw-edit") {
      const dialogRef = this.dialog.open(EmailGwFormComponent, {
        width: '700px',
        // disableClose: true,
        data: { title: 'Edit Email Gateway', row: row, sep: 'edit' }
      });
      dialogRef.afterClosed().subscribe(result => {
        // console.log('Dialog closed', result);
        this.refreshTable()
        this.showTimedAlert("success", "Updated successfully")
      });
    }
    else if (row.sep == "emailgw-view") {
      const dialogRef = this.dialog.open(ViewEmailGwDetailsComponent, {
        width: '700px',
        // disableClose: true,
        data: { title: 'View Email Gateway', row: row, sep: 'view' }
      });
      dialogRef.afterClosed().subscribe(result => {
        // console.log('Dialog closed', result);
        //this.refreshTable()
        //this.showTimedAlert("success","Updated successfully")
      });
    }
  }

}
