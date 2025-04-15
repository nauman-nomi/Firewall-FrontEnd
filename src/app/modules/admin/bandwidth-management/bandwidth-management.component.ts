import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseAlertType } from '@fuse/components/alert';


@Component({
    selector: 'app-bandwidth-management',
    templateUrl: './bandwidth-management.component.html',
    styleUrls: ['./bandwidth-management.component.scss']
})
export class BandwidthManagementComponent 
{

    queueConfigs = [
        {
          type: 'cbq',
          queues: [
            { name: 'main', bandwidth: '50%', details: 'cbq(default)', default: true },
            { name: 'web', bandwidth: '30%', details: 'cbq(borrow)' },
            { name: 'ssh', bandwidth: '10%', details: 'cbq(red)', priority: 7 },
            { name: 'bulk', bandwidth: '10%', details: 'cbq(ecn, rio)', priority: 1 },
            { name: 'voip', bandwidth: '10%', details: 'cbq(fifo)' }
          ]
        },
        {
          type: 'priq',
          queues: [
            { name: 'high', details: 'priq(priority 7)', priority: 7 },
            { name: 'medium', details: 'priq(priority 3)', priority: 3 },
            { name: 'low', details: 'priq(priority 1)', priority: 1, default: true }
          ]
        },
        {
          type: 'hfsc',
          queues: [
            { name: 'hfsc_main', bandwidth: '50%', details: 'hfsc(default)', default: true },
            { name: 'hfsc_voip', bandwidth: '20%', details: 'hfsc(realtime 5Mb)' },
            { name: 'hfsc_web', bandwidth: '30%', details: 'hfsc(linkshare 10Mb)' }
          ]
        },
        {
          type: 'fairq',
          queues: [
            { name: 'default', bandwidth: '50%', details: 'fairq(default)', default: true },
            { name: 'gaming', bandwidth: '30%', details: 'fairq(limit 50 flowmax 5Mb)' },
            { name: 'downloads', bandwidth: '20%', details: 'fairq(limit 20 flowmax 2Mb)' }
          ]
        }
      ];

    alert: { type: FuseAlertType; message: string } = {type   : 'success',message: 'Alert Message'};
    showAlert: boolean = false;
    
    loading: boolean = false;

    constructor(private fb: FormBuilder) {
    
      
    }
    refreshPage()
    {

    }




}
