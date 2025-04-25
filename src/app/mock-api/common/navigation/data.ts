/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';


export const compactNavigation: FuseNavigationItem[] = [
        //Dashboard Menu Start
    // {
    //     id      : 'db',
    //     title   : 'Dashboard',
    //     subtitle: 'dashboard',
    //     type    : 'aside',
    //     icon    : 'mat_solid:dashboard',
    //     children: 
    //     [
    //         {
    //         id   : 'db.threat',
    //         title: 'Threat Dashboard',
    //         type : 'basic',
    //         icon : 'mat_solid:shield',
    //         link : '/maintainance/Threat Dashboard'
    //         },
    //         {
    //             id   : 'db.event',
    //             title: 'Event Monitoring',
    //             type : 'basic',
    //             icon : 'mat_solid:event',
    //             link : '/maintainance/Event Dashboard'
    //         }
    //     ]
    // },
    //Dashboard Menu END

    //Network Menu Start
    {
        id      : 'nic',
        title   : 'Network',
        subtitle: 'Network',
        type    : 'aside',
        icon    : 'mat_solid:router',
        children: 
        [
            {
                id   : 'nic.interfaces',
                title: 'Interface',
                type : 'basic',
                icon : 'mat_solid:settings_input_hdmi',
                link : '/networkInteface'
            },
            // {
            //     id   : 'nic.routing',
            //     title: 'Routing',
            //     type : 'basic',
            //     icon : 'mat_solid:compare_arrows',
            //     link : '/routing'
            // },
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

    // {
    //     id      : 'ns',
    //     title   : 'Network Security',
    //     subtitle: 'Network Security ',
    //     type    : 'aside',
    //     icon    : 'mat_solid:security',
    //     children: 
    //     [
    //         {
    //             id   : 'ns.pf',
    //             title: 'Packet Filtering',
    //             type : 'basic',
    //             icon : 'mat_solid:tune',
    //             link : '/maintainance/Packet Filtering'
    //         },
    //         {
    //             id   : 'ns.nat',
    //             title: 'NAT',
    //             type : 'basic',
    //             icon : 'mat_solid:transform',
    //             link : '/maintainance/NAT'
    //         },
    //         {
    //             id   : 'ns.gb',
    //             title: 'Geo-Blocking',
    //             type : 'basic',
    //             icon : 'mat_solid:public_off',
    //             link : '/maintainance/Geo-Blocking'
    //         },
    //         {
    //             id   : 'ns.ddos',
    //             title: 'D-DOS',
    //             type : 'basic',
    //             icon : 'mat_solid:security_update_warning',
    //             link : '/maintainance/D-DOS'
    //         }
    //     ]
    // },

    //Network Security Menu END
    
    //Web Security Menu Start

    // {
    //     id      : 'ws',
    //     title   : 'Web Security',
    //     subtitle: 'web Security',
    //     type    : 'aside',
    //     icon    : 'mat_solid:https',
    //     children: 
    //     [
    //         {
    //             id   : 'ws.cf',
    //             title: 'Content Filtering',
    //             type : 'basic',
    //             icon : 'mat_solid:filter_list',
    //             link : '/maintainance/Content Filtering'
    //         },
    //         {
    //             id   : 'ws.wuf',
    //             title: 'URL Filtering',
    //             type : 'basic',
    //             icon : 'mat_solid:link',
    //             link : '/maintainance/URL Filtering'
    //         },
    //         {
    //             id   : 'wcs.ac',
    //             title: 'App Control',
    //             type : 'basic',
    //             icon : 'mat_solid:apps',
    //             link : '/maintainance/App Control'
    //         },
    //         {
    //             id   : 'wcs.tba',
    //             title: 'Time-Based Access',
    //             type : 'basic',
    //             icon : 'mat_solid:access_time',
    //             link : '/maintainance/Time-Based Access'
    //         },
    //         {
    //             id   : 'wcs.uid',
    //             title: 'User Identified Device',
    //             type : 'basic',
    //             icon : 'mat_solid:person_pin',
    //             link : '/maintainance/User identified Device'
    //         }
    //     ]
    // },

    //Web & Content Security Menu End

    //Threat Prvention Menu Start

    {
        id      : 'tp',
        title   : 'Threat Prevention',
        subtitle: 'threat prevention',
        type    : 'aside',
        icon    : 'mat_solid:shield',
        children: 
        [
            // {
            //     id   : 'tp.ids',
            //     title: 'IDS/ IPS',
            //     type : 'basic',
            //     icon : 'mat_solid:error_outline',
            //     link : '/maintainance/IDS'
            // },
            // {
            //     id   : 'tp.avp',
            //     title: 'Antivirus',
            //     type : 'basic',
            //     icon : 'mat_solid:dangerous',
            //     link : '/maintainance/Antivirus'
            // },
            {
                id   : 'tp.mal',
                title: 'Malware',
                type : 'basic',
                icon : 'mat_solid:bug_report',
                link : '/malware'
            },
            // {
            //     id   : 'tp.rm',
            //     title: 'Ransomware',
            //     type : 'basic',
            //     icon : 'mat_solid:lock',
            //     link : '/maintainance/Ransomware'
            // },
            // {
            //     id   : 'tp.spamming',
            //     title: 'Spamming',
            //     type : 'basic',
            //     icon : 'mat_solid:block',
            //     link : '/maintainance/Spamming'
            // },
            // {
            //     id   : 'tp.phishing',
            //     title: 'Phishing',
            //     type : 'basic',
            //     icon : 'mat_solid:report',
            //     link : '/maintainance/Phishing'
            // },
            // {
            //     id   : 'tp.botnet',
            //     title: 'Botnet',
            //     type : 'basic',
            //     icon : 'mat_solid:router',
            //     link : '/maintainance/Botnet'
            // }
        ]
    },

    //Threat Prvention Menu End

    //Secure Communication Menu Start
    
    // {
    //     id      : 'sc',
    //     title   : 'Secure Communication',
    //     subtitle: 'Secure Communication',
    //     type    : 'aside',
    //     icon    : 'mat_solid:account_circle',
    //     children: 
    //     [
    //         {
    //             id   : 'sc.gre',
    //             title: 'GRE Tunneling',
    //             type : 'basic',
    //             icon : 'mat_solid:device_hub',
    //             link : '/maintainance/GRE Tunneling'
    //         },
    //         {
    //             id   : 'sc.ipsec',
    //             title: 'IPSec',
    //             type : 'basic',
    //             icon : 'mat_solid:vpn_lock',
    //             link : '/maintainance/IPSec'
    //         },
    //         {
    //             id   : 'sc.dv',
    //             title: 'Dynamic VPN ',
    //             type : 'basic',
    //             icon : 'mat_solid:vpn_key',
    //             link : '/maintainance/Dynamic VPN'
    //         },
    //         {
    //             id   : 'sc.ano',
    //             title: 'Anonymity',
    //             type : 'basic',
    //             icon : 'mat_solid:visibility_off',
    //             link : '/maintainance/Anonymity'
    //         }
    //     ]
    // },

    //Secure Connectivity and Remote Access Menu END

    //High Availablility Menu Start

    // {
    //     id      : 'ha',
    //     title   : 'High Availability',
    //     subtitle: 'High Availability',
    //     type    : 'aside',
    //     icon    : 'mat_solid:cloud_queue',
    //     children: 
    //     [
    //         {
    //             id   : 'ha.ha',
    //             title: 'High Availability',
    //             type : 'basic',
    //             icon : 'mat_solid:cloud_queue',
    //             link : '/maintainance/High Availability'
    //         },
    //         {
    //             id   : 'ha.mi',
    //             title: 'Multi Interface',
    //             type : 'basic',
    //             icon : 'mat_solid:settings_input_component',
    //             link : '/maintainance/Multi Interface'
    //         }
    //     ]
    // },

    //High Availablility Menu END

    //Traffic Shaping Menu Start

    // {
    //     id      : 'ts',
    //     title   : 'Traffic Shaping',
    //     subtitle: 'Traffic Shaping',
    //     type    : 'aside',
    //     icon    : 'mat_solid:speed',
    //     children: 
    //     [
    //         {
    //             id   : 'ts.bm',
    //             title: 'Bandwidth Management',
    //             type : 'basic',
    //             icon : 'mat_solid:wifi_tethering',
    //             link : '/BandwidthManagement'
    //         },
    //         {
    //             id   : 'ts.qos',
    //             title: 'Quality of Service (QoS)',
    //             type : 'basic',
    //             icon : 'mat_solid:star',
    //             link : '/maintainance/Quality of Service (QoS)'
    //         },
    //         {
    //             id   : 'ts.lb',
    //             title: 'Load Balancing',
    //             type : 'basic',
    //             icon : 'mat_solid:equalizer',
    //             link : '/maintainance/Load Balancing'
    //         }
    //     ]
    // },

    //Traffic Shaping Menu End


    //System Management Menu Start

    {
        id      : 'sm',
        title   : 'System Management',
        subtitle: 'System Management',
        type    : 'aside',
        icon    : 'mat_solid:build',
        children: 
        [
            // {
            //     id   : 'sm.use',
            //     title: 'User',
            //     type : 'basic',
            //     icon : 'mat_solid:person',
            //     link : '/maintainance/User'
            // },
            // {
            //     id   : 'sm.ntp',
            //     title: 'Network Time Protocol (NTP)',
            //     type : 'basic',
            //     icon : 'mat_solid:timer',
            //     link : '/maintainance/Network Time Protocol (NTP)'
            // },
            // {
            //     id   : 'sm.ssh',
            //     title: 'Secure Shell (SSH)',
            //     type : 'basic',
            //     icon : 'mat_solid:device_unknown',
            //     link : '/maintainance/Secure Shell (SSH)'
            // },
            // {
            //     id   : 'sm.snmp',
            //     title: 'SNMP',
            //     type : 'basic',
            //     icon : 'mat_solid:settings_ethernet',
            //     link : '/maintainance/SNMP Monitoring and Alerts'
            // },
            {
                id   : 'sm.log',
                title: 'Log',
                type : 'basic',
                icon : 'mat_solid:description',
                link : '/logManagement'
            }
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
