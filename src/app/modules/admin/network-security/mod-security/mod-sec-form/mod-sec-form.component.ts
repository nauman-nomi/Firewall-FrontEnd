import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
    selector: 'app-mod-sec-form',
    templateUrl: './mod-sec-form.component.html',
    styleUrls: ['./mod-sec-form.component.scss']
})
export class ModSecFormComponent{
    errorAlert: { type: FuseAlertType; message: string } = { type: 'error', message: '' };
    alert: { type: FuseAlertType; message: string } = { type: 'error', message: 'Error! Duplicate Selection Found' };
    showAlert: boolean = false;
    isSubmitting: boolean = false;
    modSecForm!: FormGroup;
    methodList:any[] = ['GET','POST','PATCH'];

    constructor(public dialogRef: MatDialogRef<ModSecFormComponent>,@Inject(MAT_DIALOG_DATA) public data: any ,private fb: FormBuilder) 
    {
        console.log(this.data.row);
        this.modSecForm = this.fb.group({
            listenip:["",[Validators.required]], 
            domain: ['', [Validators.required]],
            localip: ['', [Validators.required, Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/)]],
            webtype:[],
            modSec:[],
            certificate: ['', [Validators.required]],
            certificateKey: ['', [Validators.required]],
            ipwhitelist: ['', [Validators.required]],
            whiteMethod: ['', [Validators.required]],
        });
    }

    closeDialog()
    {
        this.dialogRef.close('Dialog Closed');
    }

    onSubmit()
    {
        
    }

}
