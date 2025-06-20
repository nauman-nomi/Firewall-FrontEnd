import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
  selector: 'app-email-gw-form',
  templateUrl: './email-gw-form.component.html',
  styleUrls: ['./email-gw-form.component.scss']
})
export class EmailGwFormComponent implements OnInit {

  errorAlert: { type: FuseAlertType; message: string } = { type: 'error', message: '' };
  alert: { type: FuseAlertType; message: string } = { type: 'error', message: 'Error! Duplicate Selection Found' };
  showAlert: boolean = false;
  isSubmitting: boolean = false;
  emailGWForm!: FormGroup;
  methodList: any[] = ['GET', 'POST', 'PATCH'];

  constructor(public dialogRef: MatDialogRef<EmailGwFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
    console.log(this.data.row);
    this.emailGWForm = this.fb.group({

      webtype: [],
      domain: ['', [Validators.required]],     
      localip: ['', [Validators.required, Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/)]],
      port:['', [Validators.required]],  
      certificate: ['', [Validators.required]],
    });
  }

  closeDialog() {
    this.dialogRef.close('Dialog Closed');
  }

  onSubmit() {

  }


  ngOnInit(): void {
  }

}
