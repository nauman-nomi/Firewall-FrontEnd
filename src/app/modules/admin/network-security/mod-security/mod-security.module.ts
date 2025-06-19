import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { FuseCardModule } from '@fuse/components/card';
import { ModSecurityComponent } from './mod-security.component';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DynamicTableModule } from '../../common/data-tables/dynamic-table/dynamic-table.module';
import { ModSecFormComponent } from './mod-sec-form/mod-sec-form.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ViewModSecDetailsComponent } from './view-mod-sec-details/view-mod-sec-details.component';

const ModSecurityRoutes: Route[] = [
    {
        path     : '',
        component: ModSecurityComponent
    }
];

@NgModule({
    declarations: [
      ModSecurityComponent,
      ModSecFormComponent,
      ViewModSecDetailsComponent
    ],
    imports     : [
        RouterModule.forChild(ModSecurityRoutes),
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
export class ModSecurityModule
{
}
