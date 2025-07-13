import { Component, Input, OnInit, ViewChild, AfterViewInit, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { WarningDialogComponent } from '../../dialogs/warning-dialog/warning-dialog.component';

@Component({
    selector: 'app-dynamic-table',
    templateUrl: './dynamic-table.component.html',
    styleUrls: ['./dynamic-table.component.scss'],
})
export class DynamicTableComponent implements OnInit, AfterViewInit {
    @Input() data: any[] = []; // JSON data passed from parent
    @Input() displayedColumns: string[] = []; // Accept the header array
    @Input() headerMapping: { [key: string]: string } = {};

    @Output() editRow = new EventEmitter<any>(); // Emit the row when edit is triggered
    
    dataSource = new MatTableDataSource<any>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(private cdr: ChangeDetectorRef) {}

    get isDataEmpty(): boolean {
        return !this.dataSource || !this.dataSource.data || this.dataSource.data.length === 0;
    }

    ngOnInit(): void {
        console.log(this.data);
        if (this.data && this.data.length > 0) {
            //this.displayedColumns = Object.keys(this.data[0]); // Extract keys as column headers
            this.dataSource.data = this.data;
        }
    }

    ngOnChanges() {
        if (this.data && this.data.length > 0) {
          //this.displayedColumns = Object.keys(this.data[0]);
          this.dataSource.data = this.data;  // Reset dataSource on data change
        }
      }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.cdr.detectChanges();
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
        this.dataSource.filter = filterValue;
    }

    getColumnDisplayName(column: string): string {
        return this.headerMapping[column] || column; // Return the custom display name or the original column name
    }
    
    onEdit(row: any): void {
        row.sep = "edit";
        this.editRow.emit(row);  // Emit the row data to the parent
        
    }

    onDeleteSubNIC(row: any): void {
        row.sep = "delete";
        this.editRow.emit(row);  // Emit the row data to the parent       
    }
    
    onAddSubNIC(row: any): void {
        row.sep = "add-sub-nic";
        this.editRow.emit(row);  // Emit the row data to the parent       
    }

    addvLAN(row: any): void {
        row.sep = "add-vlan";
        this.editRow.emit(row);  // Emit the row data to the parent       
    }



    onMalwareIpDelete(row: any): void {
        row.sep = "malware-ip-delete";
        this.editRow.emit(row);  // Emit the row data to the parent       
    }

    onBlockIpDelete(row: any): void {
        row.sep = "block-ip-delete";
        this.editRow.emit(row);  // Emit the row data to the parent       
    }

    onWhitelistIpDelete(row: any): void {
        row.sep = "whitelist-ip-delete";
        this.editRow.emit(row);  // Emit the row data to the parent       
    }

    onGeoBlockIpDelete(row: any): void {
        row.sep = "geoblock-ip-delete";
        this.editRow.emit(row);  // Emit the row data to the parent       
    }

    deleteGeoCountry(row: any): void {
        row.sep = "country-unblock-delete";
        this.editRow.emit(row);  // Emit the row data to the parent       
    }
    

    onDeleteWebModSec(row:any): void{
        row.sep = "modsec-delete";
        this.editRow.emit(row);
    }

    onEditWebModSec(row:any): void{
        row.sep = "modsec-edit";
        this.editRow.emit(row);
    }

    onViewWebModSec(row:any): void{
        row.sep = "modsec-view";
        this.editRow.emit(row);
    }


// Email gateway Actions
    onDeleteEmailGw(row:any): void{
        row.sep = "emailgw-delete";
        this.editRow.emit(row);
    }

    onEditEmailGw(row:any): void{
        row.sep = "emailgw-edit";
        this.editRow.emit(row);
    }

    onViewEmailGw(row:any): void{
        row.sep = "emailgw-view";
        this.editRow.emit(row);
    }
}
