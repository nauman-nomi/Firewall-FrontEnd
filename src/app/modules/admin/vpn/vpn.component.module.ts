import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';

import { VpnComponent } from './vpn.component';


import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { NgApexchartsModule } from 'ng-apexcharts';




const VPNRoutes: Route[] = [
    {
        path     : '',
        component: VpnComponent
    }
];

@NgModule({
    declarations: [
        VpnComponent
    ],
    imports     : [
        RouterModule.forChild(VPNRoutes),
        MatButtonModule,
        MatIconModule,
        FuseAlertModule,
        FuseCardModule,
        SharedModule
    ]
})

export class VPNModules
{
}
