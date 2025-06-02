import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import {ChangeDetectionStrategy, inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';

@Component({
    selector: 'app-warning-dialog',
    templateUrl: './warning-dialog.component.html',
    styleUrls: ['./warning-dialog.component.scss'],
})
export class WarningDialogComponent implements OnInit {

    alert: { type: FuseAlertType; message: string } = {
                type   : 'success',
                message: ''
            };
    showAlert: boolean = false;
    isSubmitting: boolean = false;
    
    constructor(private nicService: NicService ,public dialogRef: MatDialogRef<WarningDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any,private cdr: ChangeDetectorRef) 
    { 
    
    }

    ngOnInit(): void 
    {

    }

    onYesClick():void
    {
        if (this.data.action === 'delete-sub-nic') {
            this.showAlert = false;
            this.isSubmitting = true;

            const payload = {
                ...this.data.row,
                // Optionally include additional fields if needed, for example:
                api_key: this.nicService.apiKey
            };
            console.log(payload);
            this.nicService.deleteSubNic(payload).subscribe(
                (response) => {
                    console.log('Sub-NIC removed successfully:', response);
                    
                    // Update the alert to show a success message
                    this.alert = {
                        type: response.status === 'success' ? 'success' : 'error',
                        message: response.message 
                    };
                    this.showAlert = true;
                    this.isSubmitting = false;
            
                    // Optionally, you can close the dialog after success:
                    this.dialogRef.close(response);
                },
                (error) => {
                    console.error('Failed to removed NIC info:', error);
            
                    // Update the alert to show an error message
                    this.alert = {
                        type: 'error',
                        message: 'Failed to removed Sub-NIC. Please try again.'
                    };
                    this.showAlert = true;
                    this.isSubmitting = false;
                }
            );

            this.cdr.detectChanges(); 

            console.log("Deleting sub-interface:", this.data.row.nic_name);
            // Add logic to handle sub-interface deletion
        } 
        else if(this.data.action === 'delete-web-mod-sec')
        {
            console.log("deleted action");
        }
        else {
            console.log("Unhandled action:", this.data.action);
            // Handle other actions if necessary
        }
        
    }

}
