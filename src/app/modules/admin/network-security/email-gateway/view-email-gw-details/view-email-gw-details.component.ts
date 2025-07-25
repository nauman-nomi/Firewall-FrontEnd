import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-email-gw-details',
  templateUrl: './view-email-gw-details.component.html',
  styleUrls: ['./view-email-gw-details.component.scss']
})
export class ViewEmailGwDetailsComponent implements OnInit {

  inputData: any;
  constructor(public dialogRef: MatDialogRef<ViewEmailGwDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.inputData = this.data.row;
    console.log(this.data.row);
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close('Dialog Closed');
  }

}



