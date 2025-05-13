import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { FirewallManagementComponent } from './firewall-management.component';
import { FWOptionsModule } from '../fw-options/fw-options.module';

const FirewallManagementRoutes: Route[] = [
    {
        path     : '',
        component: FirewallManagementComponent
    }
];

@NgModule({
    declarations: [
      FirewallManagementComponent
    ],
    imports     : [
        RouterModule.forChild(FirewallManagementRoutes),
        MatButtonModule,
        MatIconModule,
        FWOptionsModule,
        SharedModule
    ]
})
export class FirewallManagementModule
{
}
