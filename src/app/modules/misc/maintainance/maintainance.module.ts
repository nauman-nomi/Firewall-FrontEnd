import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MaintainanceComponent } from './maintainance.component';

const maintainanceRoutes: Route[] = [
    {
        path     : '',
        component: MaintainanceComponent
    }
];

@NgModule({
    declarations: [
        MaintainanceComponent
    ],
    imports     : [
        RouterModule.forChild(maintainanceRoutes)
    ]
})
export class MaintainanceModule
{
}
