import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { RoutingComponent } from './routing.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DynamicTableModule } from '../common/data-tables/dynamic-table/dynamic-table.module';

const routing_Routes: Route[] = [
    {
        path     : '',
        component: RoutingComponent
    }
];

@NgModule({
    declarations: [
      RoutingComponent
    ],
    imports     : [
        CommonModule,
        MatIconModule,
        DynamicTableModule,
        FuseAlertModule,
        MatProgressBarModule,
        RouterModule.forChild(routing_Routes)
    ]
})
export class RoutingModule
{
}
