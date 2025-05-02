import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DynamicTableComponent } from './dynamic-table.component';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// const DynamicTableRoutes: Route[] = [
//     {
//         path     : '',
//         component: DynamicTableComponent
//     }
// ];

@NgModule({
    declarations: [
        DynamicTableComponent
    ],
    imports     : [
     //   RouterModule.forChild(DynamicTableRoutes)
        CommonModule,
        MatTableModule,
        MatIconModule,
        MatTooltipModule,
        MatPaginatorModule,
        MatSlideToggleModule
    ],
    exports: [DynamicTableComponent]
})
export class DynamicTableModule
{
}
