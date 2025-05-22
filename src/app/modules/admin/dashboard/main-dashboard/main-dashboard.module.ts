import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { MainDashboardComponent } from './main-dashboard.component';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TrafficGraphComponent } from './traffic-graph/traffic-graph.component';
import { InternetSpeedGraphComponent } from './internet-speed-graph/internet-speed-graph.component';
import { GuageChartComponent } from './guage-chart/guage-chart.component';



const MainDashboardRoutes: Route[] = [
    {
        path     : '',
        component: MainDashboardComponent
    }
];

@NgModule({
    declarations: [
      MainDashboardComponent,
      TrafficGraphComponent,
      InternetSpeedGraphComponent,
      GuageChartComponent
    ],
    imports     : [
        RouterModule.forChild(MainDashboardRoutes),
        MatButtonModule,
        MatIconModule,
        FuseCardModule,
        FuseAlertModule,
        NgApexchartsModule,
        SharedModule
    ],
    exports: [TrafficGraphComponent, InternetSpeedGraphComponent,GuageChartComponent]
})
export class MainDashboardModule
{
}
