import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';

@Component({
    selector: 'app-add-block-ip',
    templateUrl: './add-block-ip.component.html',
    styleUrls: ['./add-block-ip.component.scss']
})
export class AddBlockIpComponent implements OnInit {

    errorAlert: { type: FuseAlertType; message: string } = { type: 'error', message: '' };
    alert: { type: FuseAlertType; message: string } = { type: 'error', message: 'Error!' };
    showAlert: boolean = false;
    isSubmitting: boolean = false;

    addBlockIPForm!: FormGroup;
    
    constructor(public dialogRef: MatDialogRef<AddBlockIpComponent>, @Inject(MAT_DIALOG_DATA) public data: any, 
            private nicService: NicService,private cdr: ChangeDetectorRef,private fb: FormBuilder) 
    { 
        console.log(this.data.row);
        this.addBlockIPForm = this.fb.group({
            ip_address: ['', [Validators.required, Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}((:\d{1,5})|(\/\d{1,2}))?$/)]]
        });
    }

    ngOnInit(): void 
    {
        
    }

    closeDialog() {
        this.dialogRef.close('Dialog Closed');
    }

    onSubmit() 
    {
        if (this.addBlockIPForm.invalid) {
            this.showAlert = true;
            this.errorAlert.message = 'Please fill all required fields correctly.';
            this.errorAlert.type = 'error';
            return;
        }

        this.isSubmitting = true;
        const formValue = this.addBlockIPForm.value;
        const formData = new FormData();

        // Append form data
        formData.append('ip_address', formValue.ip_address);

        // Call API
        this.nicService.addBlockIP(formData).subscribe(
            (response) => {
                this.isSubmitting = false;
                this.showAlert = true;
                this.alert.type = 'success';
                this.alert.message = 'IP Added successfully!';
                this.cdr.detectChanges(); // Ensure UI updates
                setTimeout(() => {
                    this.dialogRef.close(formData); // Close dialog after showing success
                }, 2000); // Optional delay to show success message briefly
            },
            (error) => {
                this.isSubmitting = false;
                this.showAlert = true;
                this.alert.type = 'error';
                this.alert.message = 'Failed to add IP address. Please try again.';
                console.error('Error:', error);
                this.cdr.detectChanges();
            }
        );
    }

}
