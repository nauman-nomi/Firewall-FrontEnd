import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogAddRouteComponent } from '../../common/dialogs/dialog-add-route/dialog-add-route.component';

@Component({
    selector: 'app-routing',
    templateUrl: './routing.component.html',
    styleUrls: ['./routing.component.scss']
})
export class RoutingComponent implements OnInit {

    alert: { type: FuseAlertType; message: string } = { type: 'success', message: 'Message' };
    showAlert: boolean = false;
    userData: any[] = [];
    loading: boolean = false;
    routes: any[] = [];
    allIpAddresses: string[] = [];

    headerMapping: { [key: string]: string } = {
        destination: 'Destination',
        gateway: 'Gateway',
        flags: 'Flags',
        interface: 'Interface',
        routing_action: 'Action'
    };

    displayedColumns: string[] = [
        'destination', 'gateway', 'flags', 'interface', 'routing_action'
    ];

    constructor(
        private NicService: NicService,
        public dialog: MatDialog,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.routingData();
    }

    refreshTable(): void {
        this.loading = true;
        this.routingData();
    }

    routingData(): void {
        this.NicService.getRoutingData()
            .pipe(
                catchError(error => {
                    this.showAlert = true;
                    this.alert.type = "error";
                    this.alert.message = "Error Fetching Data";
                    this.loading = false;
                    return of({ routing_table: { api_status: 'error' }, message: 'Failed to fetch data' });
                })
            )
            .subscribe(response => {
                this.showAlert = false;
                if (response.routing_table?.api_status === 'success') {
                    this.routes = response.routing_table.routes || [];
                    this.allIpAddresses = response.ip_addresses?.ip_addresses || [];
                    this.loading = false;
                } else {
                    this.showAlert = true;
                    this.alert.message = response.message || "Unknown error";
                    this.alert.type = "error";
                    this.loading = false;
                }
                this.cdr.detectChanges();
            });
    }

    onEditRow(row: any): void {
        // Implement your logic here
    }

    addRoute(): void {
        const dialogRef = this.dialog.open(DialogAddRouteComponent, {
            width: '700px',
            data: { title: 'Add Route', old_ip: this.allIpAddresses }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('Dialog closed', result);
            this.refreshTable();
        });
    }
}
