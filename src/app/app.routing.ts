import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'sign-in'},

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'mainDashboard'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            
            {path: 'mainDashboard', loadChildren: () => import('app/modules/admin/dashboard/main-dashboard/main-dashboard.module').then(m => m.MainDashboardModule)},
            {path: 'networkInteface', loadChildren: () => import('app/modules/admin/network/network-inteface/network-inteface.modules').then(m => m.NetworkInterfaceModule)},
            {path: 'fwManagement', loadChildren: () => import('app/modules/admin/network-security/firewall-management/firewall-management.module').then(m => m.FirewallManagementModule)},
            {path: 'routing', loadChildren: () => import('app/modules/admin/network/routing/routing.modules').then(m => m.RoutingModule)},
            {path: 'BandwidthManagement', loadChildren: () => import('app/modules/admin/bandwidth-management/bandwidth-management.module').then(m => m.BandwidthManagementModule)},
            {path: 'malware', loadChildren: () => import('app/modules/admin/threat-Protection/malware/malware.modules').then(m => m.MalwareModule)},
            {path: 'rspamdlog', loadChildren: () => import('app/modules/admin/system-management/log-management/log-management.modules').then(m => m.LogManagementModule)},
            {path: 'logManagement', loadChildren: () => import('app/modules/admin/system-management/all-logs/all-logs.modules').then(m => m.AllLogsModule)},

            {path: 'nat', loadChildren: () => import('app/modules/admin/network-security/nat/nat-management/nat-management.module').then(m => m.NATManagementModule)},
            {path: 'geoBlock', loadChildren: () => import('app/modules/admin/network-security/geo-blocking/geo-blocking.module').then(m => m.GeoBlockingModule)},
            
            {path: 'maintainance/:value', loadChildren: () => import('app/modules/misc/maintainance/maintainance.module').then(m => m.MaintainanceModule)},

        ]
    }
];
