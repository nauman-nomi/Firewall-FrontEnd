import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NicService } from 'app/api/nic-info.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DialogMainComponent } from '../common/dialogs/dialog-main/dialog-main.component';
import { FuseAlertType } from '@fuse/components/alert';
import { WarningDialogComponent } from '../common/dialogs/warning-dialog/warning-dialog.component';
import { UpdateDefaultGwComponent } from '../common/dialogs/update-default-gw/update-default-gw.component';
import { DialogAddSubNicComponent } from '../common/dialogs/dialog-add-sub-nic/dialog-add-sub-nic.component';
import { DialogAddVlanComponent } from '../common/dialogs/dialog-add-vlan/dialog-add-vlan.component';
import { FwOptionsComponent } from '../fw-options/fw-options.component';

@Component({
    selector: 'app-network-inteface',
    templateUrl: './network-inteface.component.html',
    styleUrls: ['./network-inteface.component.scss']
})
export class NetworkIntefaceComponent implements OnInit{
    @ViewChild(FwOptionsComponent) fwOptionsComponent!: FwOptionsComponent;

    alert: { type: FuseAlertType; message: string } = {type   : 'success',message: ''};
    showAlert: boolean = false;
    userData: any[] = [];
    loading: boolean = true;
    headerMapping: { [key: string]: string } = {
        nic_name: 'Network Interface',
        nic_type: 'Type',
        ip_address: 'IP Address',
        subnet_mask: 'Subnet Mask',
        mac_address: 'MAC Address',
        link_state: 'Link State',
        nic_action: 'Action',
        category:'Category'
    };

    displayedColumns: string[] = [
        'category','nic_name', 'nic_type', 'ip_address', 'subnet_mask', 
         'mac_address', 'link_state', 'nic_action'
    ];

    defaultGateway: string = 'Gateway';
    nicCount: number = 0;
    subInterfaceCount: number = 0;
    totalExternal: number = 0;
    totalInternal: number = 0;
    totalVlanCount: number = 0;
    interfaces: any[] = [];

    externalinterfaces: any[] = [];
    internalinterfaces: any[] = [];
    sdWaninterfaces: any[] = [];
    vpninterfaces: any[] = [];

    allIpAddresses: any[] = [];    
    selectedRow: any = null;
    nicList:any[] = [];

    constructor(private getNicInfoService: NicService, public dialog: MatDialog,private cdr: ChangeDetectorRef) 
    {
        
    }
    
    ngOnInit(): void 
    {
        this.getNicData();
    }

    getNicData(): void 
    {
        this.getNicInfoService.getNicData()
            .pipe(
                catchError(error => {
                    this.showTimedAlert("error", "Error Fetching Data")
                    // this.showAlert = true;
                    // this.alert.type="error";
                    // this.alert.message = "Error Fetching Data";
                    this.loading = false;
                    return of({ api_status: 'error', message: 'Failed to fetch data' }); 
                })
            )
            .subscribe(response => 
            {
                this.showAlert = false;
                if (response.api_status === 'success') 
                {
                    // Assign values to individual variables
                    this.defaultGateway = response.default_gateway;
                    this.nicCount = response.nic_count;
                    this.subInterfaceCount = response.sub_interface_count;
                    this.totalExternal = response.total_external;
                    this.totalInternal = response.total_internal;
                    this.totalVlanCount = response.total_vlan_count;
                    this.interfaces = response.interfaces;
                    this.allIpAddresses = this.interfaces.map((nic: any) => nic.ip_address).filter((ip: string) => ip !== 'N/A');
                    this.nicList = this.interfaces.filter((nic: any) => nic.category !== 'sub_nic').map((nic: any) => nic.nic_name);
                    this.externalinterfaces = response.external_interfaces;
                    this.internalinterfaces = response.internal_interfaces;
                    this.sdWaninterfaces = response.sdwan_interfaces;
                    this.vpninterfaces = response.vpn_interfaces;
                    this.loading = false;
                    //this.showAlert = true;
                    this.showTimedAlert("success", "Updated Successfully")
                    // this.alert.message = "Updated Successfully";
                    // this.alert.type = "success";
                } 
                else 
                {
                    this.showTimedAlert("error", response.message || "Unknown error")
                    // this.showAlert = true;
                    // this.alert.message = response.message || "Unknown error";
                    // this.alert.type = "error";
                    this.loading = false;
                }
                
            });
        this.cdr.detectChanges(); 
    }

    showTimedAlert(type: FuseAlertType, message: string) {
        this.alert.type = type;
        this.alert.message = message;
        this.showAlert = true;
    
        // Automatically hide the alert after 5 seconds
        setTimeout(() => {
          this.showAlert = false;
        }, 2000);
    }

    refreshTable(): void 
    {
        this.loading = true; // Set loading to true before fetching new data
        this.getNicData(); // Re-fetch data
        if (this.fwOptionsComponent) {
            this.fwOptionsComponent.ngOnInit(); // Reinitialize the component
          }
    }

    onEditRow(row: any): void {
        if(row.sep=== "edit"){
            this.selectedRow = { ...row };
            const dialogRef = this.dialog.open(DialogMainComponent, {
            width: '700px',
            disableClose: true,
            data: { title: 'Update Network Interface', row: this.selectedRow ,old_ip:this.allIpAddresses}
            });
      
            dialogRef.afterClosed().subscribe(result => {
               // console.log('Dialog closed', result);
                this.refreshTable()
                this.showTimedAlert("success","NIC Information Updated Successfully")
            });
        }
        else if(row.sep=== "delete")
        {
            row = { ...row };
            const dialogRef = this.dialog.open(WarningDialogComponent, {
                width: '700px',
                disableClose: true,
                data: { title: 'Delete Sub-Interface', row: row , message:"Are you sure you want to delete sub-interface?", action:"delete-sub-nic"}
            });
            
            dialogRef.afterClosed().subscribe(result => {
               // console.log('Dialog closed', result);
                this.refreshTable()
                this.showTimedAlert("success","Sub-NIC removed successfully")
            });
        }
        else if(row.sep=== "add-sub-nic")
        {
            row = { ...row };
            const dialogRef = this.dialog.open(DialogAddSubNicComponent, {
                width: '700px',
                disableClose: true,
                data: { title: 'Add Sub-Interface', row: row , message:"", action:"" ,old_ip:this.allIpAddresses}
            });
            
            dialogRef.afterClosed().subscribe(result => {
                this.refreshTable();
                this.showTimedAlert("success","Sub-NIC Added Successfully")
                
               // console.log('Dialog closed nauman', result);
                // this.showAlert = true;
                // this.alert.message = "Sub-NIC Added Successfully";//result.message;
                // this.alert.type = "success";
                
                this.cdr.detectChanges(); 
            });
        }
        else if(row.sep=== "add-vlan")
        {
            row = { ...row };
            const dialogRef = this.dialog.open(DialogAddVlanComponent, {
                width: '700px',
                data: { title: 'Add vLAN', row: row , message:"", action:"" ,old_ip:this.allIpAddresses}
            });
            
            dialogRef.afterClosed().subscribe(result => {
                console.log('Dialog closed', result);
                this.refreshTable()
            });
        }
        else if(row.sep=== "updateMacros")
        {
            this.refreshTable()
        }
        else if(row.sep=== "updateFwOption")
        {
            this.refreshTable()
        }
    }

    updateGW(): void{
        const dialogRef = this.dialog.open(UpdateDefaultGwComponent, {
            width: '700px',
            disableClose: true,
            data: {title: 'Update Default Gateway', gateway:this.defaultGateway ,old_ip:this.allIpAddresses}
        });
      
        dialogRef.afterClosed().subscribe(result => {
            //console.log('Dialog closed', result);
            this.refreshTable();
            this.showTimedAlert("success","Default Gateway updated Successfully");
        });
    }
}
