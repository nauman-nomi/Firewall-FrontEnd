import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { NicService } from 'app/api/nic-info.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FuseAlertType } from '@fuse/components/alert';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WarningDialogComponent } from '../../common/dialogs/warning-dialog/warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddGeoBlockIpComponent } from './add-geoblock-ip/add-geoblock-ip.component';



@Component({
  selector: 'app-geo-blocking',
  templateUrl: './geo-blocking.component.html',
  encapsulation: ViewEncapsulation.None
})

export class GeoBlockingComponent implements OnInit {
  // counrty code
  countries: string[] = [];
  countryCode: string = '';
  loading = false;

  // ips code
  alert: { type: FuseAlertType; message: string } = { type: 'success', message: '' };
  showAlert: boolean = false;
  loadingip: boolean = false;

  headerMapping: { [key: string]: string } = {
    ip: 'IP',
    geoblock_status: 'Status',
    geoblock_action: 'Action'
  };

  displayedColumns: string[] = [
    'ip', 'geoblock_status', 'geoblock_action'
  ];

  geoblockIps: any[] = [];
    showTimedAlert(type: FuseAlertType, message: string) {
    this.alert.type = type;
    this.alert.message = message;
    this.showAlert = true;

    // Automatically hide the alert after 5 seconds
    setTimeout(() => {
      this.showAlert = false;
    }, 2000);
  }
  getGeoBlockFileList(): void {
      this.loadingip = true;
  
      this.nicService.getGeoBlockIpListData()
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
  
            this.geoblockIps = response.data.map((ip: string) => ({ ip }));
  
            this.showTimedAlert("success", "Updated Successfully");
          } else {
            this.showTimedAlert("error", response.message || "Unknown error");
            this.loadingip = false;
          }
        });
    }
  
    onEditRow(row: any): void {
      if (row.sep === "geoblock-ip-delete") {
  
        const dialogRef = this.dialog.open(WarningDialogComponent, {
          width: '700px',
          disableClose: true,
          data: { title: 'Delete GeoBlock', row: row, message: "Are you sure you want to delete GeoBlock IP " + row.ip + "?", action: "geoblock-ip-delete" }
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
      this.getGeoBlockFileList();
    }
  
    AddGeoBlockIP() {
      const dialogRef = this.dialog.open(AddGeoBlockIpComponent, {
        width: '500px',
        disableClose: false,
        data: { title: 'Add GeoBlock IP', row: "", sep: 'add' }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.refreshTable()
        this.showTimedAlert("success", "Updated successfully")
      });
    }


  constructor(private nicService: NicService, private snackBar: MatSnackBar, public dialog: MatDialog) {
    // ip code
    this.getGeoBlockFileList();
  }

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.loading = true;
    this.nicService.viewBlockedCountries().subscribe({
      next: (res) => {
        console.log('API Response:', res);
        this.countries = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  addCountry(): void {
    if (!this.countryCode.trim()) return;
    this.loading = true;
    this.nicService.addBlockedCountry(this.countryCode.trim()).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', { duration: 2000 });
        this.loadCountries();
        this.countryCode = '';
      },
      error: () => this.loading = false
    });
  }


  execCountryCode(): void {

    this.loading = true;
    this.nicService.execCountryCode().subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', { duration: 2000 });

      },
      error: () => this.loading = false
    });
  }

  deleteCountry(code: string): void {
    this.loading = true;
    this.nicService.deleteBlockedCountry(code).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', { duration: 2000 });
        this.loadCountries();
      },
      error: () => this.loading = false
    });
  }
}
