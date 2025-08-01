import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { staticValues } from 'app/modules/constants';


@Component({
    selector: 'app-log-management',
    templateUrl: './log-management.component.html',
    styleUrls: ['./log-management.component.scss']
})
export class LogManagementComponent implements OnInit {

    loading: boolean = true;
    rspamd: SafeResourceUrl;
    constructor(private sanitizer: DomSanitizer) 
    { 
        this.rspamd = this.sanitizer.bypassSecurityTrustResourceUrl(staticValues.rspamdLog);
        console.log(this.rspamd);
    }

    ngOnInit(): void {

    }

}
