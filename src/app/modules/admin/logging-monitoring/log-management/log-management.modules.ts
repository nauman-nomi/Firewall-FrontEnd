import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { LogManagementComponent } from './log-management.component';

const LogManagementRoutes: Route[] = [
    {
        path     : '',
        component: LogManagementComponent
    }
];

@NgModule({
    declarations: [
        LogManagementComponent
    ],
    imports     : [
        RouterModule.forChild(LogManagementRoutes),
        MatButtonModule,
        MatIconModule,
        SharedModule
    ]
})
export class LogManagementModule
{
}
