import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MacrosManagementComponentComponent } from './macros-management-component.component';
import { FuseCardModule } from '@fuse/components/card';
import { MatButtonModule } from '@angular/material/button';

// const DynamicTableRoutes: Route[] = [
//     {
//         path     : '',
//         component: DynamicTableComponent
//     }
// ];

@NgModule({
    declarations: [
        MacrosManagementComponentComponent
    ],
    imports     : [
     //   RouterModule.forChild(DynamicTableRoutes)
        CommonModule,
        MatTableModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,
        MatPaginatorModule,
        FuseCardModule
    ],
    exports: [MacrosManagementComponentComponent]
})
export class MacrosManagementModule
{
}
