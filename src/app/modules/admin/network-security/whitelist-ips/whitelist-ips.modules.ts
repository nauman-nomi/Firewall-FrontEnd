import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { WhitelistIpsComponent } from './whitelist-ips.component';
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

const WhitelistIpsRoutes: Route[] = [
    {
        path     : '',
        component: WhitelistIpsComponent
    }
];

@NgModule({
    declarations: [
        WhitelistIpsComponent
    ],
    imports     : [
        RouterModule.forChild(WhitelistIpsRoutes),
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        FuseAlertModule,
        MatProgressBarModule,
        DynamicTableModule,
        MatTooltipModule,
        MatFormFieldModule,
        FuseCardModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatDialogModule,
        MatRadioModule,
        MatSelectModule,
        SharedModule
    ]
})
export class WhitelistIpsModule
{
}
