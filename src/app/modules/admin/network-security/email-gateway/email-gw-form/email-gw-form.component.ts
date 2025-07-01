import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';

@Component({
    selector: 'app-email-gw-form',
    templateUrl: './email-gw-form.component.html',
    styleUrls: ['./email-gw-form.component.scss']
})
export class EmailGwFormComponent implements OnInit {
    errorAlert: { type: FuseAlertType; message: string } = { type: 'error', message: '' };
    alert: { type: FuseAlertType; message: string } = { type: 'error', message: '' };
    showAlert: boolean = false;
    isSubmitting: boolean = false;

    emailGWForm!: FormGroup;
    selectedFile: File | null = null;

    constructor(
        public dialogRef: MatDialogRef<EmailGwFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private nicService: NicService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef
    ) {
        this.emailGWForm = this.fb.group({
            smtptype: ['', [Validators.required]],
            domain: ['', [Validators.required]],
            ip_address: ['', [Validators.required, Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/)]],
            port: ['', [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.emailGWForm.get('smtptype')?.valueChanges.subscribe((type: string) => {
            if (type === '25') {
                this.emailGWForm.get('port')?.setValue('25');
            } else if (type === '443') {
                this.emailGWForm.get('port')?.setValue('443');
            }
        });
    }

    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    onSubmit() {
        if (this.emailGWForm.invalid) {
            this.showAlert = true;
            this.errorAlert.message = 'Please fill all required fields correctly.';
            this.errorAlert.type = 'error';
            return;
        }

        if (this.emailGWForm.get('smtptype')?.value === '443' && !this.selectedFile) {
            this.showAlert = true;
            this.errorAlert.message = 'Certificate file is required for SMTPS.';
            this.errorAlert.type = 'error';
            return;
        }

        this.isSubmitting = true;

        const formValue = this.emailGWForm.value;
        const formData = new FormData();

        formData.append('domain', formValue.domain);
        formData.append('smtptype', formValue.smtptype);
        formData.append('ip_address', formValue.ip_address);
        formData.append('port', formValue.port);

        if (formValue.smtptype === '443' && this.selectedFile) {
            formData.append('pem_file', this.selectedFile, this.selectedFile.name);
        }

        console.log('FormData about to be sent:');
        for (const pair of (formData as any).entries()) {
            console.log(pair[0], pair[1]);
        }

        this.nicService.addEmailGw(formData).subscribe(
            (response) => {
                this.isSubmitting = false;
                this.showAlert = true;
                this.alert.type = 'success';
                this.alert.message = 'Email Gateway configuration saved successfully!';
                this.cdr.detectChanges();
                setTimeout(() => {
                    this.dialogRef.close(formData);
                }, 2000);
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


    closeDialog(): void {
        this.dialogRef.close('Dialog Closed');
    }
}
