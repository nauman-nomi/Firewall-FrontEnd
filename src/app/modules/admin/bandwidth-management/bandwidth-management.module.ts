import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { BandwidthManagementComponent } from './bandwidth-management.component';
import { FuseCardModule } from '@fuse/components/card';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatProgressBarModule } from '@angular/material/progress-bar';


const BandwidthManagementRoutes: Route[] = [
    {
        path     : '',
        component: BandwidthManagementComponent
    }
];

@NgModule({
    declarations: [
      BandwidthManagementComponent
    ],
    imports     : [
        RouterModule.forChild(BandwidthManagementRoutes),
        CommonModule,
        FuseAlertModule,
        MatProgressBarModule,

        MatIconModule,
        MatTooltipModule,
        
    ],
    // exports: [BandwidthManagementComponent]
})
export class BandwidthManagementModule
{
}
