import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';
import { MatButtonModule } from '@angular/material/button';
import { FwOptionsComponent } from './fw-options.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FuseAlertModule } from '@fuse/components/alert';

// const DynamicTableRoutes: Route[] = [
//     {
//         path     : '',
//         component: DynamicTableComponent
//     }
// ];

@NgModule({
    declarations: [
        FwOptionsComponent
    ],
    imports     : [
     //   RouterModule.forChild(DynamicTableRoutes)
     CommonModule,
     ReactiveFormsModule,
     MatSelectModule,
     MatInputModule,
     MatCheckboxModule,
     MatButtonModule,
     MatCardModule,
     MatIconModule,
     MatFormFieldModule,
     FuseCardModule,
     FuseAlertModule
    ],
    exports: [FwOptionsComponent]
})
export class FWOptionsModule
{
}
