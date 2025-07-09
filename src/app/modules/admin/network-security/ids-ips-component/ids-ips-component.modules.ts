import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DynamicTableModule } from '../../common/data-tables/dynamic-table/dynamic-table.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { IdsIpsComponentComponent } from './ids-ips-component.component';

const IPDIPSRoutes: Route[] = [
    {
        path     : '',
        component: IdsIpsComponentComponent
    }
];

@NgModule({
    declarations: [
      IdsIpsComponentComponent
    ],
    imports     : [
        RouterModule.forChild(IPDIPSRoutes),
        
        SharedModule
    ]
})
export class IDSIPSModule
{
}
