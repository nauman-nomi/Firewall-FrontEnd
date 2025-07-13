import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';

@Component({
    selector: 'app-add-geo-country',
    templateUrl: './add-geo-country.component.html',
    styleUrls: ['./add-geo-country.component.scss']
})
export class AddGeoCountryComponent implements OnInit {

    errorAlert: { type: FuseAlertType; message: string } = { type: 'error', message: '' };
    alert: { type: FuseAlertType; message: string } = { type: 'error', message: 'Error!' };
    showAlert: boolean = false;
    isSubmitting: boolean = false;

    addGeoCountryForm!: FormGroup;
    
    constructor(public dialogRef: MatDialogRef<AddGeoCountryComponent>, @Inject(MAT_DIALOG_DATA) public data: any, 
            private nicService: NicService,private cdr: ChangeDetectorRef,private fb: FormBuilder) 
    { 
        console.log(this.data.row);
        this.addGeoCountryForm = this.fb.group({
            country_code: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}$/)]]
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
        if (this.addGeoCountryForm.invalid) {
            this.showAlert = true;
            this.errorAlert.message = 'Please fill all required fields correctly.';
            this.errorAlert.type = 'error';
            return;
        }

        this.isSubmitting = true;
        const formValue = this.addGeoCountryForm.value;
        const formData = new FormData();

        // Append form data
        formData.append('country_code', formValue.country_code);

        // Call API
        this.nicService.addGeoCountry(formData).subscribe(
            (response) => {
                this.isSubmitting = false;
                this.showAlert = true;
                this.alert.type = 'success';
                this.alert.message = 'Country Code Added successfully!';
                this.cdr.detectChanges(); // Ensure UI updates
                setTimeout(() => {
                    this.dialogRef.close(formData); // Close dialog after showing success
                }, 2000); // Optional delay to show success message briefly
            },
            (error) => {
                this.isSubmitting = false;
                this.showAlert = true;
                this.alert.type = 'error';
                this.alert.message = 'Failed to add Country Code. Please try again.';
                console.error('Error:', error);
                this.cdr.detectChanges();
            }
        );
    }

}
