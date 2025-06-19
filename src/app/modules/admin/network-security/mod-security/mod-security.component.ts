import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { WarningDialogComponent } from '../../common/dialogs/warning-dialog/warning-dialog.component';
import { ModSecFormComponent } from './mod-sec-form/mod-sec-form.component';
import { NicService } from 'app/api/nic-info.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ViewModSecDetailsComponent } from './view-mod-sec-details/view-mod-sec-details.component';

@Component({
    selector: 'app-mod-security',
    templateUrl: './mod-security.component.html',
    styleUrls: ['./mod-security.component.scss']
})
export class ModSecurityComponent {

    alert: { type: FuseAlertType; message: string } = {type   : 'success',message: ''};
    showAlert: boolean = false;
    loading: boolean = true;
    data: any[] = [];
    headerMapping: { [key: string]: string } = {
        domain_name: 'Website Name',
        ip_port: 'IP',
        modSec: 'Mod Security Status',
        web_type: 'Type',
        ip_whitelist: 'IP Whitelisting',
        method_whitelist: 'Method Whitelisting',
        modSec_action: 'Action'
    };

    displayedColumns: string[] = [
        'domain_name','ip_port', 'modSec', 'web_type','ip_whitelist', 'method_whitelist' ,'modSec_action'
    ];
    constructor(public dialog: MatDialog, private getModSecService: NicService) 
    {
        this.getModSecInfo();
    }

    refreshTable()
    {
        this.getModSecInfo();
    }

    getModSecInfo(){
        this.loading = true;
        this.getModSecService.getModSecListAPI()
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
            .subscribe(response => 
            {
                this.showAlert = false;
                //if (response.api_status === 'success') 
                if (true) 
                {
                    // Assign values to individual variables
                    this.data = response;
                    console.log(response);
                    this.loading = false;
                    this.showAlert = true;
                    this.showTimedAlert("success", "Updated Successfully")
                    this.alert.message = "Updated Successfully";
                    this.alert.type = "success";
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
                //this.cdr.detectChanges();
        // this.data = [{"domain_name": "abc.com","ip_port": "192.168.3.3:80","modSec": "ON","web_type": "http","ip_whitelist": "1.2.3.4/24","method_whitelist": "GET,POST"
        // },{"domain_name": "123.com","ip_port": "192.168.3.4:80","modSec": "OFF","web_type": "https","ip_whitelist": "1.2.3.4","method_whitelist": "GET,POST,DELETE"
        // }];
    }

    addWebsiteModSec(){
        const dialogRef = this.dialog.open(ModSecFormComponent, {
            width: '900px',
            // disableClose: true,
            data: { title: 'Add Mod Security', row: "" , sep:'add'}
        });
        dialogRef.afterClosed().subscribe(result => {
            // console.log('Dialog closed', result);
             this.refreshTable()
             this.showTimedAlert("success","Updated successfully")
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
        if(row.sep == "modsec-delete"){
            const dialogRef = this.dialog.open(WarningDialogComponent, {
                width: '700px',
                disableClose: true,
                data: { title: 'Delete Website Mod Security', row: row , message:"Are you sure you want to delete Website Mod Security?", action:"delete-web-mod-sec"}
            });
            dialogRef.afterClosed().subscribe(result => {
                // console.log('Dialog closed', result);
                 this.refreshTable()
                 this.showTimedAlert("success","Updated successfully")
            });
        }
        else if(row.sep == "modsec-edit"){
            const dialogRef = this.dialog.open(ModSecFormComponent, {
                width: '900px',
                // disableClose: true,
                data: { title: 'Edit Mod Security', row: row, sep:'edit'}
            });
            dialogRef.afterClosed().subscribe(result => {
                // console.log('Dialog closed', result);
                 this.refreshTable()
                 this.showTimedAlert("success","Updated successfully")
            });
        }
        else if(row.sep == "modsec-view"){
            const dialogRef = this.dialog.open(ViewModSecDetailsComponent, {
                width: '700px',
                // disableClose: true,
                data: { title: 'View Mod Security', row: row, sep:'view'}
            });
            dialogRef.afterClosed().subscribe(result => {
                // console.log('Dialog closed', result);
                 //this.refreshTable()
                 //this.showTimedAlert("success","Updated successfully")
            });
        }
    }
}
