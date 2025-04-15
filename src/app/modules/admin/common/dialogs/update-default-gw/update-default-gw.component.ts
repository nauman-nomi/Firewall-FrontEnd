import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';

@Component({
    selector: 'app-update-default-gw',
    templateUrl: './update-default-gw.component.html',
    styleUrls: ['./update-default-gw.component.scss']
})
export class UpdateDefaultGwComponent implements OnInit {

    gatewayForm!: FormGroup;  // Renamed the form variable to gatewayForm
    isSubmitting: boolean = false;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    showAlert: boolean = false;

    oldIp: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<UpdateDefaultGwComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private nicService: NicService,
        private cdr: ChangeDetectorRef
    ) {
        this.oldIp = data.old_ip;  // Not used in the current form but kept in case validation is needed
    }

    closeDialog() {
        this.dialogRef.close('Dialog Closed');
    }

    ngOnInit() {
        // Initialize form with only gateway field
        this.gatewayForm = this.fb.group({
            gateway: ['', [Validators.required, Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/), this.gatewayValidator()]], // Validates the IP format for gateway
        });

        // Pre-fill the form with the gateway value from passed data
        this.gatewayForm.patchValue({
            gateway: this.data.gateway,  // Pre-fill gateway value from the data
        });
    }

    // Custom Validator Function
    gatewayValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;  // Skip validation if no value is entered

            const newGateway = control.value;

            for (const ip of this.oldIp) {
                // Check if the new gateway is in the same network as the old IP (same first three octets)
                if (this.isSameNetwork(ip, newGateway)) {
                    // Check if the new gateway is not the same as the old IP
                    const ipBase = ip.split('.').slice(0, 3).join('.');  // Get the base part of the IP (first three octets)
                    const gatewayBase = newGateway.split('.').slice(0, 3).join('.');  // Same for the new gateway

                    if (ipBase === gatewayBase && newGateway !== ip) {
                        return null;  // Valid, the new gateway belongs to the same network but is not the same IP
                    }
                }
            }

            return { invalidGateway: true };  // Custom error key if no valid match is found
        };
    }

    // Function to check if the new gateway is on the same network as an old IP (same first three octets)
    isSameNetwork(ip1: string, ip2: string): boolean {
        const network1 = ip1.split('.').slice(0, 3).join('.');  // Get the first three octets of ip1
        const network2 = ip2.split('.').slice(0, 3).join('.');  // Get the first three octets of ip2

        return network1 === network2;  // If the first three octets match, they are on the same network
    }

    onSubmit() {
        if (this.gatewayForm.valid) {
            this.showAlert = false;
            this.isSubmitting = true;

            // Prepare the payload from form values
            const payload = {
                ...this.gatewayForm.value,
                api_key: this.nicService.apiKey
            };
            console.log(payload);
            // Call the service to send the updated NIC info
            this.nicService.updateDefualtGW(payload).subscribe(
                (response) => {
                    console.log('Default Gateway updated successfully:', response);

                    // Update the alert to show a success message
                    this.alert = {
                        type: response.status === 'success' ? 'success' : 'error',
                        message: response.message 
                    };
                    this.showAlert = true;
                    this.isSubmitting = false;
                },
                (error) => {
                    console.error('Failed to update Default Gateway:', error);

                    // Update the alert to show an error message
                    this.alert = {
                        type: 'error',
                        message: 'Failed to update Default Gateway. Please try again.'
                    };
                    this.showAlert = true;
                    this.isSubmitting = false;
                }
            );

            this.cdr.detectChanges(); 
        }
    }

    resetForm() {
        this.gatewayForm.reset({
            gateway: this.data.gateway,  // Reset the gateway to the initial value
        });
    }

}
