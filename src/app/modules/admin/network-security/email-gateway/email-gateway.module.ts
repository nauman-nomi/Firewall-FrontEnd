import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { FWOptionsModule } from '../fw-options/fw-options.module';
import { EmailGatewayComponent } from './email-gateway.component';


const EmailGWtRoutes: Route[] = [
    {
        path     : '',
        component: EmailGatewayComponent
    }
];

@NgModule({
    declarations: [
      EmailGatewayComponent
    ],
    imports     : [
        RouterModule.forChild(EmailGWtRoutes),
       
        SharedModule
    ]
})
export class EmailGWModule
{
}
