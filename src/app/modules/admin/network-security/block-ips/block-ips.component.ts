import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WarningDialogComponent } from '../../common/dialogs/warning-dialog/warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddBlockIpComponent } from './add-block-ip/add-block-ip.component';

@Component({
  selector: 'app-block-ips',
  templateUrl: './block-ips.component.html',
  styleUrls: ['./block-ips.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlockIpsComponent implements OnInit {

  alert: { type: FuseAlertType; message: string } = { type: 'success', message: '' };
  showAlert: boolean = false;
  loading: boolean = false;

  headerMapping: { [key: string]: string } = {
    ip: 'IP',
    block_status: 'Status',
    block_action: 'Action'
  };

  displayedColumns: string[] = [
    'ip', 'block_status', 'block_action'
  ];

  blockIps: any[] = [];

  constructor(private apiService: NicService, private cdr: ChangeDetectorRef, public dialog: MatDialog) {


    this.getBlockFileList();

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

  getBlockFileList(): void {
    this.loading = true;

    this.apiService.getBlockIpListData()
      .pipe(
        catchError(error => {
          this.showTimedAlert("error", "Error Fetching Data");
          this.loading = false;
          return of({ api_status: 'error', message: 'Failed to fetch data' });
        })
      )
      .subscribe(response => {
        this.showAlert = false;
        if (response.api_status === 'success') {
          this.loading = false;

          this.blockIps = response.data.map((ip: string) => ({ ip }));

          this.showTimedAlert("success", "Updated Successfully");
        } else {
          this.showTimedAlert("error", response.message || "Unknown error");
          this.loading = false;
        }
      });
  }

  onEditRow(row: any): void {
    if (row.sep === "block-ip-delete") {

      const dialogRef = this.dialog.open(WarningDialogComponent, {
        width: '700px',
        disableClose: true,
        data: { title: 'Delete Block', row: row, message: "Are you sure you want to delete Block IP " + row.ip + "?", action: "block-ip-delete" }
      });
      dialogRef.afterClosed().subscribe(result => {
        // console.log('Dialog closed', result);
        this.refreshTable()
        this.showTimedAlert("success", "Updated successfully")
      });
    }
  }

  refreshTable() {
    this.loading = true;
    this.getBlockFileList();
  }

  AddBlockIP() {
    const dialogRef = this.dialog.open(AddBlockIpComponent, {
      width: '500px',
      disableClose: false,
      data: { title: 'Add Block IP', row: "", sep: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refreshTable()
      this.showTimedAlert("success", "Updated successfully")
    });
  }

  ngOnInit(): void {
  }

}
