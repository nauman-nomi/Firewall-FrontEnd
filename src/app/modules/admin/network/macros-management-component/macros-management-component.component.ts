import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DialogUpdateMacrosComponent } from '../../common/dialogs/dialog-update-macros/dialog-update-macros.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-macros-management-component',
    templateUrl: './macros-management-component.component.html',
    styleUrls: ['./macros-management-component.component.scss']
})
export class MacrosManagementComponentComponent implements OnInit {

    @Input() externalinterfaces: any[] = [];
    @Input() internalinterfaces: any[] = [];
    @Input() sdWaninterfaces: any[] = [];
    @Input() vpninterfaces: any[] = [];
    @Input() nicList: any[] = [];


    @Output() editRow = new EventEmitter<any>(); // Emit the row when edit is triggered

    loading: boolean = false;
    constructor(public dialog: MatDialog) { }

    ngOnInit(): void {

    }

    updateMacros(): void {
        const dialogRef = this.dialog.open(DialogUpdateMacrosComponent, {
            width: '700px', height: 'auto',
            data: {
                title: 'Update Macros', externalinterfaces: this.externalinterfaces.map(item => item.split(",")[1]),
                internalinterfaces: this.internalinterfaces.map(item => item.split(",")[1]), sdWaninterfaces: this.sdWaninterfaces.map(item => item.split(",")[1]),
                vpninterfaces: this.vpninterfaces.map(item => item.split(",")[1]), nicList: this.nicList
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('Dialog closed', result);
            this.onUpdate([]);

        });
    }

    parseInterface(interfaceStr: string, index: number): string {
        if (typeof interfaceStr !== 'string') return '';
        const parts = interfaceStr.split(',');
        return parts[index]?.trim() || '';
    }

    onUpdate(row: any): void {
        row.sep = "updateMacros";
        this.editRow.emit(row);  // Emit the row data to the parent       
    }

}
