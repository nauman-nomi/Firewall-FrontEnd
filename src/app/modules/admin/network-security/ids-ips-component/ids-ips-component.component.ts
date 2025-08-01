import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WarningDialogComponent } from '../../common/dialogs/warning-dialog/warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddIdsNetworkComponent } from './add-ids-network/add-ids-network.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ids-ips-component',
  templateUrl: './ids-ips-component.component.html',
  styleUrls: ['./ids-ips-component.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class IdsIpsComponentComponent implements OnInit {

  alert: { type: FuseAlertType; message: string } = { type: 'success', message: '' };
    showAlert: boolean = false;
    loadingip: boolean = false;
    loading = false;
  
    headerMapping: { [key: string]: string } = {
      ids_network: 'IDS Network',
      idsnet_action: 'Action'
    };
  
    idsnetwork: string[] = [
      'ids_network', 'idsnet_action'
    ];
  
    idsnetworks: any[] = [];
  
    constructor(private apiService: NicService, private cdr: ChangeDetectorRef, public dialog: MatDialog, private snackBar: MatSnackBar,) {
  
  
      this.getIDSNetworkFileList();
  
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
  
    getIDSNetworkFileList(): void {
      this.loadingip = true;
  
      this.apiService.getIDSNetworkListData()
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
  
            this.idsnetworks = response.data.map((http_ports: string) => ({ http_ports }));
  
            this.showTimedAlert("success", "Updated Successfully");
          } else {
            this.showTimedAlert("error", response.message || "Unknown error");
            this.loadingip = false;
          }
        });
    }
  
    onEditRow(row: any): void {
      if (row.sep === "ids-network-delete") {
  
        const dialogRef = this.dialog.open(WarningDialogComponent, {
          width: '700px',
          disableClose: true,
          data: { title: 'Delete IDS Nework', row: row, message: "Are you sure you want to delete IDS Network " + row.ip + "?", action: "ids-network-delete" }
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
      this.getIDSNetworkFileList();
    }

  
    AddIDSNetwork() {
      const dialogRef = this.dialog.open(AddIdsNetworkComponent, {
        width: '500px',
        disableClose: false,
        data: { title: 'Add IDS Network', row: "", sep: 'add' }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.refreshTable()
        this.showTimedAlert("success", "Updated successfully")
      });
    }
  
  

  
    ngOnInit(): void {
    }
  
  }
