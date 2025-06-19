import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-view-mod-sec-details',
    templateUrl: './view-mod-sec-details.component.html',
    styleUrls: ['./view-mod-sec-details.component.scss']
})
export class ViewModSecDetailsComponent implements OnInit {

    inputData:any;
    constructor(public dialogRef: MatDialogRef<ViewModSecDetailsComponent>,@Inject(MAT_DIALOG_DATA) public data: any) 
    {
        this.inputData = this.data.row;
        console.log(this.data.row);
    }

    ngOnInit(): void {
    }

    closeDialog(){
        this.dialogRef.close('Dialog Closed');
    }

}
