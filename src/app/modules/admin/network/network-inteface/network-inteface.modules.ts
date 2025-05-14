import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';
import { NetworkIntefaceComponent } from './network-inteface.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';
import { DynamicTableModule } from '../../common/data-tables/dynamic-table/dynamic-table.module';
import { CommonModule } from '@angular/common';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MacrosManagementModule } from '../macros-management-component/macros-management-component.module';
import { FWOptionsModule } from '../../network-security/fw-options/fw-options.module';

const networkIntefaceRoutes: Route[] = [
    {
        path     : '',
        component: NetworkIntefaceComponent
    }
];

@NgModule({
    declarations: [
      NetworkIntefaceComponent
    ],
    imports     : [
        HttpClientModule,
        MatButtonModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatTooltipModule,
        FuseCardModule,
        DynamicTableModule,
        CommonModule,
        FuseAlertModule,
        MatProgressBarModule,
        MacrosManagementModule,
        FWOptionsModule,
        RouterModule.forChild(networkIntefaceRoutes)
    ]
})
export class NetworkInterfaceModule
{
}
