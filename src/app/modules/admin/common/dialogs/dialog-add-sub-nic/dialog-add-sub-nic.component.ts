import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';

@Component({
    selector: 'app-dialog-add-sub-nic',
    templateUrl: './dialog-add-sub-nic.component.html',
    styleUrls: ['./dialog-add-sub-nic.component.scss']
})
export class DialogAddSubNicComponent implements OnInit {
    addSubNicForm!: FormGroup;
    isSubmitting: boolean = false;
    alert: { type: FuseAlertType; message: string } = {
            type   : 'success',
            message: ''
        };
    showAlert: boolean = false;

    oldIp: any[]=[]

    constructor(public dialogRef: MatDialogRef<DialogAddSubNicComponent>,@Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
        private nicService: NicService ,private cdr: ChangeDetectorRef) 
    {
       this.oldIp = data.old_ip;
    }

    closeDialog() {
        this.dialogRef.close('Dialog Closed');
    }

    SaveNICInfo()
    {

    }

    ipAlreadyExistsValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (this.oldIp.includes(control.value)) {
                return { ipExists: true }; // Custom error key
            }
            return null;
        };
    }

    ngOnInit() {
        this.addSubNicForm = this.fb.group({
            ip_address: ['', [Validators.required, Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/) , this.ipAlreadyExistsValidator()]],
            subnet_mask: ['', [Validators.required, Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/)]],
            nic_name: ['', Validators.required],
            category: ['', ],
        });
    
        // Pre-fill the form with default values
         this.addSubNicForm.patchValue({
        //     ip_address: this.data.row.ip_address,
        //     subnet_mask: this.data.row.subnet_mask,
            nic_name: this.data.row.nic_name,
        //     category: this.data.row.category
         });
    }

    onSubmit() 
    {
        if (this.addSubNicForm.valid) 
        {
            this.showAlert = false;
            this.isSubmitting = true;

            // Prepare the payload from form values
             const payload = {
                ...this.addSubNicForm.value,
                // Optionally include additional fields if needed, for example:
                api_key: this.nicService.apiKey
            };
            console.log(payload);
            // Call the service to send data to the PHP API
            this.nicService.addSubNic(payload).subscribe(
                (response) => {
                    console.log('Sub-NIC added successfully:', response);
                    
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
                    console.error('Failed to add Sub-NIC info:', error);
            
                    // Update the alert to show an error message
                    this.alert = {
                        type: 'error',
                        message: 'Failed to add Sub-NIC info. Please try again.'
                    };
                    this.showAlert = true;
                    this.isSubmitting = false;
                }
            );

            this.cdr.detectChanges(); 
        }
    }

    resetForm() {
        this.addSubNicForm.reset({
          ip_address: "",
          subnet_mask: "",
          nic_name: this.data.row.nic_name,
        });
    }

}
