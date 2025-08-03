import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { DialogMainComponent } from './modules/admin/common/dialogs/dialog-main/dialog-main.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { WarningDialogComponent } from './modules/admin/common/dialogs/warning-dialog/warning-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UpdateDefaultGwComponent } from './modules/admin/common/dialogs/update-default-gw/update-default-gw.component';
import { DialogAddSubNicComponent } from './modules/admin/common/dialogs/dialog-add-sub-nic/dialog-add-sub-nic.component';
import { DialogAddVlanComponent } from './modules/admin/common/dialogs/dialog-add-vlan/dialog-add-vlan.component';
import { DialogAddRouteComponent } from './modules/admin/common/dialogs/dialog-add-route/dialog-add-route.component';
import { DialogUpdateMacrosComponent } from './modules/admin/common/dialogs/dialog-update-macros/dialog-update-macros.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DialogUpdateFwOptionComponent } from './modules/admin/common/dialogs/dialog-update-fw-option/dialog-update-fw-option.component';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { FuseCardModule } from '@fuse/components/card';
import { AddMalwareIpComponent } from './modules/admin/threat-protection/malware/add-malware-ip/add-malware-ip.component';
import { AddBlockIpComponent } from './modules/admin/threat-protection/block-ips/add-block-ip/add-block-ip.component';
import { AddWhitelistIpComponent } from './modules/admin/threat-protection/whitelist-ips/add-whitelist-ip/add-whitelist-ip.component';
import { AddGeoBlockIpComponent } from './modules/admin/threat-protection/geo-blocking/add-geoblock-ip/add-geoblock-ip.component';
import { AddGeoCountryComponent } from './modules/admin/threat-protection/geo-country/add-geo-country/add-geo-country.component';
import { AddIdsNetworkComponent } from './modules/admin/network-security/ids-ips-component/add-ids-network/add-ids-network.component';
import { AddIdsPortComponent } from './modules/admin/network-security/ids-ips-component/add-ids-port/add-ids-port.component';
// import { FirewallLogsComponent } from './modules/admin/logging-monitoring/firewall-logs/firewall-logs.component';
// import { SuricataLogsComponent } from './modules/admin/logging-monitoring/suricata-logs/suricata-logs.component';
// import { WapLogsComponent } from './modules/admin/logging-monitoring/wap-logs/wap-logs.component';
// import { MailscannerLogsComponent } from './modules/admin/logging-monitoring/mailscanner-logs/mailscanner-logs.component';
// import { SystemLogsComponent } from './modules/admin/logging-monitoring/system-logs/system-logs.component';

const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
        DialogMainComponent,
        WarningDialogComponent,
        UpdateDefaultGwComponent,
        DialogAddSubNicComponent,
        DialogAddVlanComponent,
        DialogAddRouteComponent,
        DialogUpdateMacrosComponent,
        DialogUpdateFwOptionComponent,
        AddMalwareIpComponent,
        AddBlockIpComponent,
        AddWhitelistIpComponent,
        // AddGeoBlockIpComponent,
        AddGeoCountryComponent,
        AddIdsNetworkComponent,
        AddIdsPortComponent,
        // FirewallLogsComponent,
        // SuricataLogsComponent,
        // WapLogsComponent,
        // MailscannerLogsComponent,
        // SystemLogsComponent,

    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        CommonModule,
        FuseAlertModule,
        ReactiveFormsModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatSelectModule,

        MatInputModule,
        MatCheckboxModule,
        MatCardModule,
        FuseCardModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({})
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
