import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { MainDashboardComponent } from './main-dashboard.component';
import { FuseCardModule } from '@fuse/components/card';

const MainDashboardRoutes: Route[] = [
    {
        path     : '',
        component: MainDashboardComponent
    }
];

@NgModule({
    declarations: [
      MainDashboardComponent
    ],
    imports     : [
        RouterModule.forChild(MainDashboardRoutes),
        MatButtonModule,
        MatIconModule,
        FuseCardModule,
        SharedModule
    ]
})
export class MainDashboardModule
{
}
