import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FirewallLogsComponent } from './firewall-logs.component';
import { MatTableModule } from '@angular/material/table';
import { DynamicTableModule } from '../../common/data-tables/dynamic-table/dynamic-table.module';

const LogsRoutes: Route[] = [
    {
        path     : '',
        component: FirewallLogsComponent
    }
];

@NgModule({
    declarations: [
      FirewallLogsComponent
    ],
    imports     : [
        RouterModule.forChild(LogsRoutes),
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        FuseAlertModule,
        MatProgressBarModule,
        DynamicTableModule,
        SharedModule,
        MatTableModule
    ]
})

export class FirewallLogsModule
{
}