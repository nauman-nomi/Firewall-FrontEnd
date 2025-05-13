import { Component, OnInit, ViewChild } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { FwOptionsComponent } from '../fw-options/fw-options.component';

@Component({
    selector: 'app-firewall-management',
    templateUrl: './firewall-management.component.html',
    styleUrls: ['./firewall-management.component.scss']
})
export class FirewallManagementComponent implements OnInit
{
    @ViewChild(FwOptionsComponent) fwOptionsComponent!: FwOptionsComponent;
    alert: { type: FuseAlertType; message: string } = {type   : 'success',message: ''};
    showAlert: boolean = false;
    loading: boolean = true;

    refresh(): void 
    {
        this.loading = true; // Set loading to true before fetching new data
        if (this.fwOptionsComponent) {
            this.fwOptionsComponent.ngOnInit(); // Reinitialize the component
        }
        this.loading = false;
    }

    ngOnInit()
    {
        this.refresh();
        this.loading = false;
    }

    onEditRow(row: any): void {
        if(row.sep=== "updateFwOption")
        {
            this.refresh()
        }
    }

}
