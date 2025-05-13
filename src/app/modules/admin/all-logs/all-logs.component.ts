import { Component, OnInit } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';
import { interval, of, Subscription } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
    selector: 'app-all-logs',
    templateUrl: './all-logs.component.html',
    styleUrls: ['./all-logs.component.scss']
})
export class AllLogsComponent implements OnInit {

    logs: string[] = [];
    subscription!: Subscription;
    alert: { type: FuseAlertType; message: string } = {type   : 'success',message: ''};
    showAlert: boolean = false;
    loading: boolean = false;

    constructor(private apiService: NicService ) { }

    ngOnInit(): void 
    {
        const pollInterval = 3000; // 3 seconds
        this.fetchLogs();
        this.subscription = interval(pollInterval).subscribe(() => this.fetchLogs());
    }

    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
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

    fetchLogs() {
        this.apiService.getlogs()
            .pipe(
                catchError(error => {
                    this.showTimedAlert("error", "Error Fetching Data")
                    this.loading = false;
            return of({ api_status: 'error', message: 'Failed to fetch data' }); 
                })
            )
            .subscribe(response => 
            {
                this.showAlert = false;
                if (response.api_status === 'success') 
                {
                    this.loading = false;
                    this.logs = response.logs || [];
                    //this.LastUpdatedDefCount = this.storedDefCount;
                    this.showTimedAlert("success", "Logs Retrive Successfully")
                } 
                else 
                {
                    this.showTimedAlert("error", response.message || "Unknown error")
                    this.loading = false;
                }
                
            });
    }

}
