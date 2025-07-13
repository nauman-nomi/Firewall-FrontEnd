import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WarningDialogComponent } from '../../common/dialogs/warning-dialog/warning-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AddGeoCountryComponent } from './add-geo-country/add-geo-country.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-geo-country',
  templateUrl: './geo-country.component.html',
  styleUrls: ['./geo-country.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class GeoCountryComponent implements OnInit {

  alert: { type: FuseAlertType; message: string } = { type: 'success', message: '' };
  showAlert: boolean = false;
  loadingip: boolean = false;
  loading = false;

  headerMapping: { [key: string]: string } = {
    country_code: 'Country Code',
    country_status: 'Status',
    country_action: 'Action'
  };

  displayedColumns: string[] = [
    'country_code', 'country_status', 'country_action'
  ];

  geocountry: any[] = [];

  constructor(private apiService: NicService, private cdr: ChangeDetectorRef, public dialog: MatDialog, private snackBar: MatSnackBar,) {


    this.getGeoCountryFileList();

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

  getGeoCountryFileList(): void {
    this.loadingip = true;

    this.apiService.getGeoCountryListData()
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

          this.geocountry = response.data.map((country_code: string) => ({ country_code }));

          this.showTimedAlert("success", "Updated Successfully");
        } else {
          this.showTimedAlert("error", response.message || "Unknown error");
          this.loadingip = false;
        }
      });
  }

  onEditRow(row: any): void {
    if (row.sep === "country-unblock-delete") {

      const dialogRef = this.dialog.open(WarningDialogComponent, {
        width: '700px',
        disableClose: true,
        data: { title: 'Delete Geo Country', row: row, message: "Are you sure you want to delete Geo Country " + row.ip + "?", action: "country-unblock-delete" }
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
    this.getGeoCountryFileList();
  }

  AddGeoCountry() {
    const dialogRef = this.dialog.open(AddGeoCountryComponent, {
      width: '500px',
      disableClose: false,
      data: { title: 'Add Geo Country', row: "", sep: 'add' }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.refreshTable()
      this.showTimedAlert("success", "Updated successfully")
    });
  }



  execCountryCode(): void {

    this.loading = true;
    this.apiService.execCountryCode().subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Close', { duration: 2000 });

      },
      error: () => this.loading = false
    });
  }

  ngOnInit(): void {
  }

}
