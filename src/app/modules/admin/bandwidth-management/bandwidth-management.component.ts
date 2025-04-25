import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Component({
    selector: 'app-bandwidth-management',
    templateUrl: './bandwidth-management.component.html',
    styleUrls: ['./bandwidth-management.component.scss']
})
export class BandwidthManagementComponent 
{
    queueDef:any;    
    queueTypes: string[] = [];

    alert: { type: FuseAlertType; message: string } = {type   : 'success',message: 'Alert Message'};
    showAlert: boolean = false;
    
    loading: boolean = false;

    constructor(private ApiService: NicService, private cdr: ChangeDetectorRef) 
    {
        this.getQueueDefData();
      
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

    getQueueDefData(): void 
    {
        this.ApiService.getQueueDefList()
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
                    this.queueDef = response.queues;
                    this.queueTypes = Object.keys(response.queues);
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
        // this.cdr.detectChanges(); 
    }

    getUniqueKeys(queueList: any[]): string[] {
        const keySet = new Set<string>();
        queueList.forEach(queue => {
          Object.keys(queue).forEach(key => keySet.add(key));
        });
        return Array.from(keySet);
    }

    refreshPage()
    {

    }




}
