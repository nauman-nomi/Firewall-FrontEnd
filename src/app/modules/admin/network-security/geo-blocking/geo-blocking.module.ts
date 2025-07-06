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
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AddGeoBlockIpComponent } from './add-geoblock-ip/add-geoblock-ip.component';





import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseAlertModule } from '@fuse/components/alert';
import { DynamicTableModule } from '../../common/data-tables/dynamic-table/dynamic-table.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



const GeoBlockingRoutes: Route[] = [
    {
        path: '',
        component: GeoBlockingComponent
    }
];

@NgModule({
    declarations: [
        GeoBlockingComponent,
        CountryViewComponent,
        AddGeoBlockIpComponent
    ],
    imports: [
        RouterModule.forChild(GeoBlockingRoutes),
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        FuseCardModule,
        MatFormFieldModule,
        MatInputModule,
        SharedModule,
        CommonModule,
        FormsModule,
        MatTableModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressBarModule,

   
        MatSlideToggleModule,
        FuseAlertModule,
        DynamicTableModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatSelectModule
    ]
})
export class GeoBlockingModule {
}
