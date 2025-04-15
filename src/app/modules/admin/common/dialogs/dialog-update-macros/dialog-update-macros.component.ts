import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NicService } from 'app/api/nic-info.service';

@Component({
    selector: 'app-dialog-update-macros',
    templateUrl: './dialog-update-macros.component.html',
    styleUrls: ['./dialog-update-macros.component.scss']
})
export class DialogUpdateMacrosComponent implements OnInit {

    updateMacroForm!: FormGroup;
    isSubmitting: boolean = false;
    alert: { type: FuseAlertType; message: string } = { type: 'error', message: 'Error! Duplicate Selection Found' };
    info: { type: FuseAlertType; message: string } = { type: 'info', message: 'Each NIC selection must be unique across all fields.' };
    errorAlert: { type: FuseAlertType; message: string } = { type: 'error', message: '' };
    showAlert: boolean = false;
    nicList: any[] = [];
    externalNIC: any[] = [];
    internalNIC: any[] = [];
    sdWAN: any[] = [];
    vpn: any[] = [];

    constructor(
        public dialogRef: MatDialogRef<DialogUpdateMacrosComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder,
        private nicService: NicService,
        private cdr: ChangeDetectorRef
    ) {
        this.nicList = data.nicList;
        this.externalNIC = data.externalinterfaces;
        this.internalNIC = data.internalinterfaces;
        this.sdWAN = data.sdWaninterfaces;
        this.vpn = data.vpninterfaces;
    }

    ngOnInit() {
        this.updateMacroForm = this.fb.group({
            InternalInterface: [this.internalNIC],
            ExternalInterface: [this.externalNIC],
            sdWANInterface: [this.sdWAN],
            vpnInterface: [this.vpn]
        }, { validators: this.uniqueSelectionsValidator });

        // Subscribe to form value changes to trigger validation dynamically
        this.updateMacroForm.valueChanges.subscribe(() => {
            this.updateMacroForm.updateValueAndValidity();
        });
    }

    // Custom Validator Function to check for unique selections
    uniqueSelectionsValidator: ValidatorFn = (formGroup: AbstractControl): ValidationErrors | null => {
        const internal = formGroup.get('InternalInterface')?.value || [];
        const external = formGroup.get('ExternalInterface')?.value || [];
        const sdwan = formGroup.get('sdWANInterface')?.value || [];
        const vpn = formGroup.get('vpnInterface')?.value || [];

        // Flatten all selected values into one array
        const allSelections = [...internal, ...external, ...sdwan, ...vpn];

        // Check for duplicate selections
        const hasDuplicates = new Set(allSelections).size !== allSelections.length;

        return hasDuplicates ? { nonUniqueSelection: true } : null;
    };

    // Close Dialog
    closeDialog() {
        this.dialogRef.close('Dialog Closed');
    }

    // Submit Form
    onSubmit() {
        if (this.updateMacroForm.valid) {
            this.showAlert = false;
            this.isSubmitting = true;

            // Prepare payload
            const payload = {
                ...this.updateMacroForm.value,
                api_key: this.nicService.apiKey
            };

            console.log(payload);

            // Call API
            this.nicService.updateMacros(payload).subscribe(
                (response) => {
                    console.log('Macros Update:', response);

                    this.errorAlert = {
                        type: response.status === 'success' ? 'success' : 'error',
                        message: response.message
                    };
                    this.showAlert = true;
                    this.isSubmitting = false;
                    this.closeDialog();
                },
                (error) => {
                    console.error('Failed to add Sub-NIC info:', error);

                    this.errorAlert = {
                        type: 'error',
                        message: 'Failed to update Macros. Please try again.'
                    };
                    this.showAlert = true;
                    this.isSubmitting = false;
                }
            );

            this.cdr.detectChanges();
        }
    }
}
