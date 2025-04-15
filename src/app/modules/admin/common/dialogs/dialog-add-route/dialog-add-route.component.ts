import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-add-route',
    templateUrl: './dialog-add-route.component.html',
    styleUrls: ['./dialog-add-route.component.scss']
})
export class DialogAddRouteComponent implements OnInit {

    constructor(public dialogRef: MatDialogRef<DialogAddRouteComponent>,@Inject(MAT_DIALOG_DATA) public data: any) 
    { 
        console.log(data);
    
    }

    ngOnInit(): void {
        
    }

}
