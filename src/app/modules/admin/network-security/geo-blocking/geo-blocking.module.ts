import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { FuseCardModule } from '@fuse/components/card';
import { GeoBlockingComponent } from './geo-blocking.component';

const GeoBlockingRoutes: Route[] = [
    {
        path     : '',
        component: GeoBlockingComponent
    }
];

@NgModule({
    declarations: [
      GeoBlockingComponent
    ],
    imports     : [
        RouterModule.forChild(GeoBlockingRoutes),
        MatButtonModule,
        MatIconModule,
        FuseCardModule,
        SharedModule
    ]
})
export class GeoBlockingModule
{
}
