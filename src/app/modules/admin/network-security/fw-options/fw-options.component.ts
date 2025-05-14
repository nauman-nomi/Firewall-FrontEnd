import { ChangeDetectorRef, Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogUpdateFwOptionComponent } from '../../common/dialogs/dialog-update-fw-option/dialog-update-fw-option.component';




@Component({
    selector: 'app-fw-options',
    templateUrl: './fw-options.component.html',
    styleUrls: ['./fw-options.component.scss'],
})
export class FwOptionsComponent implements OnInit 
{
     @Output() editRow = new EventEmitter<any>(); // Emit the row when edit is triggered
   // readonly panelOpenState = signal(false);
    loading:boolean=false;
    alert: { type: FuseAlertType; message: string } = {type   : 'success',message: ''};
    showAlert: boolean = false;
    options: any[] = [];

    optionViewType:any="primary";

    constructor(public dialog: MatDialog,private getNicInfoService: NicService,private cdr: ChangeDetectorRef) 
    {
        
        
    }

    ngOnInit() 
    {
        this.getFWOptions();
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

    refresh()
    {
        this.getFWOptions();
    }

    getFWOptions()
    {
        this.loading = true;
        this.getNicInfoService.getFWOPtionsData()
            .pipe(
                catchError(error => {
                    this.showTimedAlert("error", "Error Fetching Data")
                    // this.showAlert = true;
                    // this.alert.type="error";
                    // this.alert.message = "Error Fetching Data";
                    this.loading = false;
                    return of({ api_status: 'error', message: 'Failed to fetch data' }); 
                })
            )
            .subscribe(response => 
            {
                this.showAlert = false;
                if (response.api_status === 'success') 
                {
                    // Assign values to individual variables
                    this.options = response.data;
                    console.log(this.options);
                    this.loading = false;
                    //this.showAlert = true;
                    this.showTimedAlert("success", "Updated Successfully")
                    // this.alert.message = "Updated Successfully";
                    // this.alert.type = "success";
                } 
                else 
                {
                    this.showTimedAlert("error", response.message || "Unknown error")
                    // this.showAlert = true;
                    // this.alert.message = response.message || "Unknown error";
                    // this.alert.type = "error";
                    this.loading = false;
                }
                
            });
        this.cdr.detectChanges(); 
    }

    getKeys(obj: any): string[] {
        return obj ? Object.keys(obj) : [];
      }

    updateOptions()
    {
        const dialogRef = this.dialog.open(DialogUpdateFwOptionComponent, {
            width: '750px',
            disableClose: true,
            data: { title: 'Update Firewall options', row: this.options}
        });
        
        dialogRef.afterClosed().subscribe(result => {
            console.log('Dialog closed', result);
            this.onUpdate([]);
           // console.log('Dialog closed', result);
            //this.refreshTable()
            //this.showTimedAlert("success","Sub-NIC removed successfully")
        });
    }

    onUpdate(row: any): void {
        row.sep = "updateFwOption";
        this.editRow.emit(row);  // Emit the row data to the parent       
    }

    

    

}
