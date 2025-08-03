import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WarningDialogComponent } from '../../common/dialogs/warning-dialog/warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddIdsNetworkComponent } from './add-ids-network/add-ids-network.component';
import { AddIdsPortComponent } from './add-ids-port/add-ids-port.component';
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
    idsnet_action: 'Delete'
  };

  displayedColumns: string[] = [
    'ids_network', 'idsnet_action'
  ];

  idsnetworks: any[] = [];



  // IDS Port code
  alertport: { type: FuseAlertType; messageport: string } = { type: 'success', messageport: '' };
  showAlertPort: boolean = false;
  loadingport: boolean = false;
  // loading = false;

  headerMappingPort: { [key: string]: string } = {
    http_ports: 'IDS Ports',
    idsport_action: 'Delete'
  };

  displayedColumnsPort: string[] = [
    'http_ports', 'idsport_action'
  ];

  idsport: any[] = [];



  constructor(private apiService: NicService, private cdr: ChangeDetectorRef, public dialog: MatDialog, private snackBar: MatSnackBar,) {


    this.getIDSNetworkFileList();
    this.getIDSPortFileList();

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
          return of({ status: 'error', message: 'Failed to fetch data' });
        })
      )
      .subscribe(response => {
        this.showAlert = false;
        this.loadingip = false;

        if (response.status === 'success') {

          this.idsnetworks = response.home_net.map((ip: string) => ({
            ids_network: ip,

          }));

          this.showTimedAlert("success", "Updated Successfully");
        } else {
          this.showTimedAlert("error", response.message || "Unknown error");
        }
      });
  }


  onEditRow(row: any): void {

    console.log("onEdit called");

    console.log("row.sep",row.sep);


    if (row.sep === "ids-network-delete") {

      console.log("ids-network-delete")

      const dialogRef = this.dialog.open(WarningDialogComponent, {
        width: '700px',
        disableClose: true,
        data: { title: 'Delete IDS Nework', row: row, message: "Are you sure you want to delete IDS Network " + row.ids_network + "?", action: "ids-network-delete" }
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









  showTimedAlertPort(type: FuseAlertType, messageport: string) {
    this.alertport.type = type;
    this.alertport.messageport = messageport;
    this.showAlertPort = true;

    // Automatically hide the alert after 5 seconds
    setTimeout(() => {
      this.showAlertPort = false;
    }, 2000);
  }

  getIDSPortFileList(): void {
    this.loadingport = true;

    this.apiService.getIDSPortsListData()
      .pipe(
        catchError(error => {
          this.showTimedAlertPort("error", "Error Fetching Data");
          this.loadingport = false;
          return of({ status: 'error', message: 'Failed to fetch data' });
        })
      )
      .subscribe(response => {
        this.showAlertPort = false;
        this.loadingport = false;

        if (response.status === 'success') {
          // response.home_net is the array of IPs
          this.idsport = response.http_ports.map((port: string) => ({
            http_ports: port,

          }));

          this.showTimedAlertPort("success", "Updated Successfully");
        } else {
          this.showTimedAlertPort("error", response.message || "Unknown error");
        }
      });
  }


  onEditRowPort(row: any): void {

    console.log("onEdit called");

    console.log("row.sep",row.sep);


    if (row.sep === "ids-port-delete") {

      console.log("ids-port-delete")

      const dialogRef = this.dialog.open(WarningDialogComponent, {
        width: '700px',
        disableClose: true,
        data: { title: 'Delete IDS Port', row: row, message: "Are you sure you want to delete IDS Port " + row.http_ports + "?", action: "ids-port-delete" }
      });
      dialogRef.afterClosed().subscribe(result => {
        // console.log('Dialog closed', result);
        this.refreshTablePort()
        this.showTimedAlertPort("success", "Updated successfully")
      });
    }
  }


  refreshTablePort() {
    this.loadingport = true;
    this.getIDSPortFileList();
  }


  AddIDSPort() {
    const dialogRef = this.dialog.open(AddIdsPortComponent, {
      width: '500px',
      disableClose: false,
      data: { title: 'Add IDS Port', row: "", sep: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refreshTablePort()
      this.showTimedAlertPort("success", "Updated successfully")
    });
  }












  ngOnInit(): void {
  }

}