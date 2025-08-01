import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MailscannerLogsComponent } from './mailscanner-logs.component';

const LogsRoutes: Route[] = [
    {
        path     : '',
        component: MailscannerLogsComponent
    }
];

@NgModule({
    declarations: [
      MailscannerLogsComponent
    ],
    imports     : [
        RouterModule.forChild(LogsRoutes),
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        FuseAlertModule,
        MatProgressBarModule,
        SharedModule
    ]
})

export class MailscannerLogsModule
{
}