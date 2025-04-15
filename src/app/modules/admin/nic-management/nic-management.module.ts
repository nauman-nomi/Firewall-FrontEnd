import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NicManagementComponent } from './nic-management.component';

const nic_Routes: Route[] = [
    {
        path     : '',
        component: NicManagementComponent
    }
];

@NgModule({
    declarations: [
        NicManagementComponent
    ],
    imports     : [
        RouterModule.forChild(nic_Routes)
    ]
})
export class NicManagementModule
{
}
