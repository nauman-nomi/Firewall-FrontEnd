import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { FuseCardModule } from '@fuse/components/card';
import { NatManagementComponent } from './nat-management.component';

const NatManagementRoutes: Route[] = [
    {
        path     : '',
        component: NatManagementComponent
    }
];

@NgModule({
    declarations: [
      NatManagementComponent
    ],
    imports     : [
        RouterModule.forChild(NatManagementRoutes),
        MatButtonModule,
        MatIconModule,
        FuseCardModule,
        SharedModule
    ]
})
export class NATManagementModule
{
}
