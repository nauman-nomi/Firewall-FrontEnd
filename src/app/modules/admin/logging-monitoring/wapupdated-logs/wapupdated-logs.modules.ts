import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WapupdatedLogsComponent } from './wapupdated-logs.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { Route, RouterModule } from '@angular/router';


const LogsRoutes: Route[] = [
    {
        path     : '',
        component: WapupdatedLogsComponent
    }
];


@NgModule({
    declarations: [WapupdatedLogsComponent],
    imports: [
        RouterModule.forChild(LogsRoutes),
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
    ],
    exports: [WapupdatedLogsComponent]
})
export class WapUpdatedLogsModule {}
