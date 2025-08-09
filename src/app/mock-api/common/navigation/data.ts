/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';


export const compactNavigation: FuseNavigationItem[] = [
    //Dashboard Menu Start
    {
        id: 'db.threat',
        title: 'Dashboard',
        subtitle: 'dashboard',
        type: 'basic',
        icon: 'mat_solid:dashboard',
        link: '/mainDashboard'
    },
    //Dashboard Menu END

    //Network Menu Start
    {
        id: 'nic',
        title: 'Network',
        subtitle: 'Network',
        type: 'aside',
        icon: 'mat_solid:router',
        children:
            [
                {
                    id: 'nic.interfaces',
                    title: 'Interface',
                    type: 'basic',
                    icon: 'mat_solid:settings_input_hdmi',
                    link: '/networkInteface'
                },

                {
                    id: 'nic.routing',
                    title: 'Routing',
                    type: 'basic',
                    icon: 'mat_solid:compare_arrows',
                    link: '/routing'
                },
                // {
                //     id   : 'nic.dhcp',
                //     title: 'DHCP Service',
                //     type : 'basic',
                //     icon : 'mat_solid:dynamic_form',
                //     link : '/maintainance/DHCP Services'
                // },
                // {
                //     id   : 'nic.dns',
                //     title: 'DNS Management',
                //     type : 'basic',
                //     icon : 'mat_solid:dns',
                //     link : '/maintainance/DNS Management'
                // },
            ]
    },
    //Network Menu END

    //Network Security Menu Start

    {
        id: 'ns',
        title: 'Security Services',
        subtitle: 'Security Services',
        type: 'aside',
        icon: 'mat_solid:security',
        children:
            [
                {
                    id: 'nic.fwmgmt',
                    title: 'Firewall Rules',
                    type: 'basic',
                    icon: 'mat_solid:gpp_maybe',
                    link: '/fwManagement'
                },
                {
                    id: 'ns.mod',
                    title: 'WAP (Web Application FIrewall)',
                    type: 'basic',
                    icon: 'mat_solid:web',
                    link: '/modSec'
                },
                // {
                //     id   : 'ns.nat',
                //     title: 'NAT',
                //     type : 'basic',
                //     icon : 'mat_solid:transform',
                //     link : '/nat'
                // },


                {
                    id: 'ns.mailGW',
                    title: 'Email Gateway',
                    type: 'basic',
                    icon: 'mat_solid:mark_email_read',
                    link: '/emailGW'
                },

                {
                    id: 'tp.ids',
                    title: 'IDS/ IPS',
                    type: 'basic',
                    icon: 'mat_solid:sensors',
                    link: '/idsips'
                },

                //         {
                //             id   : 'ns.ddos',
                //             title: 'D-DOS',
                //             type : 'basic',
                //             icon : 'mat_solid:security_update_warning',
                //             link : '/maintainance/D-DOS'
                //         }
            ]
    },

    {
        id: 'tp',
        title: 'Threat Prevention',
        subtitle: 'threat prevention',
        type: 'aside',
        icon: 'mat_solid:shield',
        children: [
            {
                id: 'ns.gb',
                title: 'Geo-Country',
                type: 'basic',
                icon: 'mat_solid:public_off',
                link: '/geoCountry'
            },
            {
                id: 'ns.gb',
                title: 'Geo-Blocking IP',
                type: 'basic',
                icon: 'mat_solid:public_off',
                link: '/geoBlock'
            },
            {
                id: 'tp.mal',
                title: 'Malware',
                type: 'basic',
                icon: 'mat_solid:bug_report',
                link: '/malware'
            },
            {
                id: 'ns.whitelistIPs',
                title: 'Whitelist IPs',
                type: 'basic',
                icon: 'mat_solid:verified_user',
                link: '/whitelistIPs'
            },
            {
                id: 'ns.blockIPs',
                title: 'Block IPs',
                type: 'basic',
                icon: 'mat_solid:block',
                link: '/blockIps'
            },

        ]
    },

    {
        id: 'db.vpn',
        title: 'VPN',
        subtitle: 'VPN',
        type: 'basic',
        icon: 'mat_solid:vpn_lock',
        link: '/vpn'
    },


    {
        id: 'sm.sysServices',
        title: 'System Services',
        subtitle: 'System Services',
        type: 'aside',
        icon: 'mat_solid:settings',
        children:
            [

                {
                    id: 'sm.dnsResolver',
                    title: 'DNS Resolver',
                    type: 'basic',
                    icon: 'mat_solid:dns',
                    link: '/'
                },
                {
                    id: 'sm.ntpServer',
                    title: 'NTP Server',
                    type: 'basic',
                    icon: 'mat_solid:schedule',
                    link: '/'
                },
                {
                    id: 'sm.snmpConfig',
                    title: 'SNMP Configuration',
                    type: 'basic',
                    icon: 'mat_solid:device_hub',
                    link: '/'
                },
                {
                    id: 'sm.dhcpServer',
                    title: 'DHCP Server',
                    type: 'basic',
                    icon: 'mat_solid:router',
                    link: '/'
                },
                {
                    id: 'sm.dynamicDns',
                    title: 'Dynamic DNS',
                    type: 'basic',
                    icon: 'mat_solid:settings_ethernet',
                    link: '/'
                }
            ]
    },


    {
        id: 'sm.loggingMonitoring',
        title: 'Logging & Monitoring',
        subtitle: 'Logging & Monitoring',
        type: 'aside',
        icon: 'mat_solid:list_alt',
        children:
            [
                {
                    id: 'firewall.log',
                    title: 'Firewall Logs',
                    type: 'basic',
                    icon: 'mat_solid:description',
                    link: '/firewalllog'
                },

                {
                    id: 'suricata.log',
                    title: 'Suricata Alerts',
                    type: 'basic',
                    icon: 'mat_solid:description',
                    link: '/suricatalog'
                },
                {
                    id: 'wap.log',
                    title: 'WAP Logs',
                    type: 'basic',
                    icon: 'mat_solid:description',
                    link: '/waplog'
                },
                {
                    id: 'wapupdated.log',
                    title: 'WAP Updated Logs',
                    type: 'basic',
                    icon: 'mat_solid:description',
                    link: '/wapupdatedlog'
                },

                {
                    id: 'mailscanner.log',
                    title: 'Mail Scanner Logs',
                    type: 'basic',
                    icon: 'mat_solid:description',
                    link: '/mailscannerlog'
                },
                {
                    id: 'system.log',
                    title: 'System Logs',
                    type: 'basic',
                    icon: 'mat_solid:description',
                    link: '/systemlog'
                },

                {
                    id: 'sm.log',
                    title: 'RSPAMD Log',
                    type: 'basic',
                    icon: 'mat_solid:description',
                    link: '/rspamdlog'
                },

                {
                    id: 'sm.log',
                    title: 'Logs',
                    type: 'basic',
                    icon: 'mat_solid:description',
                    link: '/logManagement'
                },
            ]
    },

    //Traffic Shaping Menu End


    //Configuration Management Menu Start

    // {
    //     id      : 'cm',
    //     title   : 'Configuration Management',
    //     subtitle: 'Configuration Management',
    //     type    : 'aside',
    //     icon    : 'mat_solid:developer_mode',
    //     children: 
    //     [
    //         {
    //             id   : 'cm.br',
    //             title: 'Backup and Restore',
    //             type : 'basic',
    //             icon : 'mat_solid:restore',
    //             link : '/maintainance/Backup and Restore'
    //         },
    //         {
    //             id   : 'cm.sct',
    //             title: 'Scheduled',
    //             type : 'basic',
    //             icon : 'mat_solid:calendar_today',
    //             link : '/maintainance/Scheduled'
    //         }
    //     ]
    // },

    //Configuration Management Menu End




    // {
    //     id   : 'nic',
    //     title: 'NIC Management',
    //     type : 'basic',
    //     icon : 'heroicons_outline:wifi',
    //     link : '/nic'
    // },

];

export const defaultNavigation: FuseNavigationItem[] = compactNavigation;
export const futuristicNavigation: FuseNavigationItem[] = compactNavigation;
export const horizontalNavigation: FuseNavigationItem[] = compactNavigation;
