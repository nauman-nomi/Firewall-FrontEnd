import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WarningDialogComponent } from '../../common/dialogs/warning-dialog/warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddWhitelistIpComponent } from './add-whitelist-ip/add-whitelist-ip.component';

@Component({
  selector: 'app-whitelist-ips',
  templateUrl: './whitelist-ips.component.html',
  styleUrls: ['./whitelist-ips.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WhitelistIpsComponent implements OnInit {

  alert: { type: FuseAlertType; message: string } = { type: 'success', message: '' };
  showAlert: boolean = false;
  loadingip: boolean = false;

  headerMapping: { [key: string]: string } = {
    ip: 'IP',
    whitelist_status: 'Status',
    whitelist_action: 'Action'
  };

  displayedColumns: string[] = [
    'ip', 'whitelist_status', 'whitelist_action'
  ];

  whitelistIps: any[] = [];

  constructor(private apiService: NicService, private cdr: ChangeDetectorRef, public dialog: MatDialog) {


    this.getWhitelistFileList();

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

  getWhitelistFileList(): void {
    this.loadingip = true;

    this.apiService.getWhitelistIpListData()
      .pipe(
        catchError(error => {
          this.showTimedAlert("error", "Error Fetching Data");
          this.loadingip = false;
          return of({ api_status: 'error', message: 'Failed to fetch data' });
        })
      )
      .subscribe(response => {
        this.showAlert = false;
        if (response.api_status === 'success') {
          this.loadingip = false;

          console.log(response.data);

          this.whitelistIps = response.data.map((ip: string) => ({ ip }));

          this.showTimedAlert("success", "Updated Successfully");
        } else {
          this.showTimedAlert("error", response.message || "Unknown error");
          this.loadingip = false;
        }
      });
  }

  onEditRow(row: any): void {
    if (row.sep === "whitelist-ip-delete") {

      const dialogRef = this.dialog.open(WarningDialogComponent, {
        width: '700px',
        disableClose: true,
        data: { title: 'Delete Whitelist', row: row, message: "Are you sure you want to delete Whitelist IP " + row.ip + "?", action: "whitelist-ip-delete" }
      });
      dialogRef.afterClosed().subscribe(result => {
        // console.log('Dialog closed', result);
        this.refreshTable()
        this.showTimedAlert("success", "Updated successfully")
      });
    }
  }

  refreshTable() {
    this.loadingip = true;
    this.getWhitelistFileList();
  }

  AddWhitelistIP() {
    const dialogRef = this.dialog.open(AddWhitelistIpComponent, {
      width: '500px',
      disableClose: false,
      data: { title: 'Add Whitelist IP', row: "", sep: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refreshTable()
      this.showTimedAlert("success", "Updated successfully")
    });
  }

  ngOnInit(): void {
  }

}
