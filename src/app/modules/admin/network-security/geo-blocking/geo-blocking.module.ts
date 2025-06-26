import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { FuseCardModule } from '@fuse/components/card';
import { GeoBlockingComponent } from './geo-blocking.component';
import { CountryViewComponent } from './country-view/country-view.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';




const GeoBlockingRoutes: Route[] = [
    {
        path: '',
        component: GeoBlockingComponent
    }
];

@NgModule({
    declarations: [
        GeoBlockingComponent,
        CountryViewComponent
    ],
    imports: [
        RouterModule.forChild(GeoBlockingRoutes),
        MatButtonModule,
        MatIconModule,
        FuseCardModule,
        MatFormFieldModule,
        MatInputModule,
        SharedModule,
        CommonModule,
        FormsModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressBarModule
    ]
})
export class GeoBlockingModule {
}
