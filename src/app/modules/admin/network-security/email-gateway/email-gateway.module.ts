import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { FWOptionsModule } from '../fw-options/fw-options.module';
import { EmailGatewayComponent } from './email-gateway.component';


import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DynamicTableModule } from '../../common/data-tables/dynamic-table/dynamic-table.module';
import { EmailGwFormComponent } from './email-gw-form/email-gw-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ViewEmailGwDetailsComponent } from './view-email-gw-details/view-email-gw-details.component';


const EmailGWtRoutes: Route[] = [
    {
        path     : '',
        component: EmailGatewayComponent
    }
];

@NgModule({
    declarations: [
      EmailGatewayComponent,
      EmailGwFormComponent,
      ViewEmailGwDetailsComponent,
      
    ],
    imports     : [
        RouterModule.forChild(EmailGWtRoutes),
        MatButtonModule,
        MatIconModule,
        FuseCardModule,
        FuseAlertModule,
        MatProgressBarModule,
        DynamicTableModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatRadioModule,
        MatSelectModule,
        SharedModule
    ]
})
export class EmailGWModule
{
}
