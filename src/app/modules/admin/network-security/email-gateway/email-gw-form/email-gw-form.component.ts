import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-email-gw-form',
  templateUrl: './email-gw-form.component.html',
  styleUrls: ['./email-gw-form.component.scss']
})

export class EmailGwFormComponent implements OnInit 
{
    errorAlert: { type: FuseAlertType; message: string } = { type: 'error', message: '' };
    alert: { type: FuseAlertType; message: string } = { type: 'error', message: 'Error! Duplicate Selection Found' };
    showAlert: boolean = false;
    isSubmitting: boolean = false;

    emailGWForm!: FormGroup;
    methodList: any[] = ['GET', 'POST', 'PATCH'];

    // selectedFile: File | null = null;
    // onFileSelected(event: any): void {
    //   const file: File = event.target.files[0];
    //   if (file) {
    //     this.selectedFile = file;
    //     this.emailGWForm.get('pem_file')?.setValue(file.name); // sets field value for validation
    //   }
    // }


    constructor( public dialogRef: MatDialogRef<EmailGwFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any, 
          private nicService: NicService, private fb: FormBuilder, private cdr: ChangeDetectorRef) 
    {
        console.log(this.data.row);
        this.emailGWForm = this.fb.group({
            smtptype: ['', [Validators.required]],
            domain: ['', [Validators.required]],
            ip_address: ['', [Validators.required, Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/)]],
            port: ['', [Validators.required]],
            pem_file: [''],
        });
    }

    closeDialog() {
        this.dialogRef.close('Dialog Closed');
    }

    onSubmit() 
    {
        if (this.emailGWForm.invalid) {
            this.showAlert = true;
            this.errorAlert.message = 'Please fill all required fields correctly.';
            this.errorAlert.type = 'error';
            return;
        }

        this.isSubmitting = true;
        const formValue = this.emailGWForm.value;
        const formData = new FormData();

        // Append form data
        formData.append('domain', formValue.domain);
        formData.append('smtptype', formValue.smtptype);
        formData.append('ip_address', formValue.ip_address);
        formData.append('port', formValue.port);
      
        // Only append pem_file if it exists (relevant for SMTPS)
        if (formValue.pem_file && formValue.smtptype === '443') {
            formData.append('pem_file', formValue.pem_file);
        }

        // Call API
        this.nicService.addEmailGw(formData).subscribe(
            (response) => {
                this.isSubmitting = false;
                this.showAlert = true;
                this.alert.type = 'success';
                this.alert.message = 'Email Gateway configuration saved successfully!';
                this.cdr.detectChanges(); // Ensure UI updates
                setTimeout(() => {
                    this.dialogRef.close(formData); // Close dialog after showing success
                }, 2000); // Optional delay to show success message briefly
            },
            (error) => {
                this.isSubmitting = false;
                this.showAlert = true;
                this.alert.type = 'error';
                this.alert.message = 'Failed to save Email Gateway configuration. Please try again.';
                console.error('Error:', error);
                this.cdr.detectChanges();
            }
        );
    }

    ngOnInit(): void {
        this.emailGWForm.get('smtptype')?.valueChanges.subscribe((type: string) => {
            if (type === '25') {
                this.emailGWForm.get('port')?.setValue('25');
                this.emailGWForm.get('pem_file')?.clearValidators();
                this.emailGWForm.get('pem_file')?.setValue('');
            } 
            else if (type === '443') {
                this.emailGWForm.get('port')?.setValue('443');
                this.emailGWForm.get('pem_file')?.setValidators([Validators.required]);
            }
            this.emailGWForm.get('pem_file')?.updateValueAndValidity();
        });
    }
}
