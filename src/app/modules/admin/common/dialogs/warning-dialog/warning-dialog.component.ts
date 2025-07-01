import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ChangeDetectionStrategy, inject } from '@angular/core';
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
        type: 'success',
        message: ''
    };
    showAlert: boolean = false;
    isSubmitting: boolean = false;

    constructor(private nicService: NicService, public dialogRef: MatDialogRef<WarningDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private cdr: ChangeDetectorRef) {
        console.log(data);
    }

    ngOnInit(): void {

    }

    onYesClick(): void {
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

            // Add logic to handle sub-interface deletion
        }
        else if (this.data.action === 'malware-ip-delete') {
            this.showAlert = false;
            this.isSubmitting = true;

            
            this.nicService.deleteMaliciousIP(this.data.row.ip).subscribe(
                (response) => {
                    console.log('Malicious IP removed successfully:', response);

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
                    console.error('Failed to removed Malicous info:', error);

                    // Update the alert to show an error message
                    this.alert = {
                        type: 'error',
                        message: 'Failed to removed Malicious IP. Please try again.'
                    };
                    this.showAlert = true;
                    this.isSubmitting = false;
                }
            );

            this.cdr.detectChanges();

            // Add logic to handle sub-interface deletion
        }
        
        else if (this.data.action === 'delete-country') {
            this.showAlert = false;
            this.isSubmitting = true;

            
            this.nicService.unBlockCountry(this.data.row.county).subscribe(
                (response) => {
                    console.log('Malicious IP removed successfully:', response);

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
                    console.error('Failed to removed Malicous info:', error);

                    // Update the alert to show an error message
                    this.alert = {
                        type: 'error',
                        message: 'Failed to removed Malicious IP. Please try again.'
                    };
                    this.showAlert = true;
                    this.isSubmitting = false;
                }
            );

            this.cdr.detectChanges();

            // Add logic to handle sub-interface deletion
        }
        else if (this.data.action === 'delete-web-mod-sec') {
            this.showAlert = false;
            this.isSubmitting = true;

            const payload = {
                domain: this.data.row.domain_name
            };
            console.log(payload);
            this.nicService.deleteModSecApi(payload).subscribe(
                (response) => {
                    if (response.api_status == "success") {
                        console.log('Mod Sec removed successfully:', response);

                        // Update the alert to show a success message
                        this.alert = {
                            type: response.status === 'success' ? 'success' : 'error',
                            message: response.message
                        };
                        this.showAlert = true;
                        this.isSubmitting = false;
                    }
                    else {
                        console.log('Error:', response);

                        // Update the alert to show a success message
                        this.alert = {
                            type: response.status === 'success' ? 'success' : 'error',
                            message: response.message
                        };
                        this.showAlert = true;
                        this.isSubmitting = false;
                    }


                    // Optionally, you can close the dialog after success:
                    this.dialogRef.close(response);
                },
                (error) => {
                    console.error('Failed to removed Mod Sec info:', error);

                    // Update the alert to show an error message
                    this.alert = {
                        type: 'error',
                        message: 'Failed to removed Mod Sec. Please try again.'
                    };
                    this.showAlert = true;
                    this.isSubmitting = false;
                }
            );
            console.log(this.data.row.domain_name);

        }

        else if (this.data.action === 'delete-email-gw-sec') {
            this.showAlert = false;
            this.isSubmitting = true;

            const payload = {
                domain: this.data.row.domain
            };
            console.log(payload);
            this.nicService.deleteEmailGwApi(payload).subscribe(
                (response) => {
                    if (response.api_status == "success") {
                        console.log('Email Gateway removed successfully:', response);

                        // Update the alert to show a success message
                        this.alert = {
                            type: response.status === 'success' ? 'success' : 'error',
                            message: response.message
                        };
                        this.showAlert = true;
                        this.isSubmitting = false;
                    }
                    else {
                        console.log('Error:', response);

                        // Update the alert to show a success message
                        this.alert = {
                            type: response.status === 'success' ? 'success' : 'error',
                            message: response.message
                        };
                        this.showAlert = true;
                        this.isSubmitting = false;
                    }


                    // Optionally, you can close the dialog after success:
                    this.dialogRef.close(response);
                },
                (error) => {
                    console.error('Failed to removed Mod Sec info:', error);

                    // Update the alert to show an error message
                    this.alert = {
                        type: 'error',
                        message: 'Failed to removed Mod Sec. Please try again.'
                    };
                    this.showAlert = true;
                    this.isSubmitting = false;
                }
            );
            console.log(this.data.row.domain_name);
        }

        else {
            console.log("Unhandled action:", this.data.action);
            // Handle other actions if necessary
        }

    }

}
