import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NicService {
    
    private apiUrl = environment.apiUrl + '/getNicInfo.php';
    private updateApiUrl = environment.apiUrl + '/updateNicInfo.php';
    private updateGWApiUrl = environment.apiUrl + '/updateDefaultGw.php';
    private deleteSubNicApiUrl = environment.apiUrl + '/deleteSubNic.php';
    private addSubNicApiUrl = environment.apiUrl + '/addSubNic.php';
    private updateMacroApiUrl = environment.apiUrl + '/updateMacros.php';
    private updateFWOptionsApiUrl = environment.apiUrl + '/updateFWOptions.php';

    private getMacrosapiUrl = environment.apiUrl + '/getMacros.php';
    private apigetFWOptions = environment.apiUrl + '/getFirewallOptions.php';

    private getRoutingtableapiUrl = environment.apiUrl + '/getRoutingTable.php';

    // Python APIs
    private getQueueDefApiUrl = environment.apiUrl + 'masterApi.py/getQueueDefination';
    private updatetMalwareListApiUrl = environment.apiUrl + 'masterApi.py/updateMalwareFile';
    private updateMalwareStatusApiUrl = environment.apiUrl + 'masterApi.py/UpdateMalwareIPStatus';
    private getLogsApiUrl = environment.apiUrl + 'masterApi.py/logs';




    // Rest APIs
    // private getDateTimeApiUrl = environment.apiUrl + 'dateTime.py';
    // private getUsageStatsApiUrl = environment.apiUrl + 'systemspec.py';
    // private getSystemInfoApiUrl = environment.apiUrl + 'sysinfo.py';

    // Django urls
    private getSystemInfoApiUrl = environment.apiUrl + 'systemInfo';
    private getUsageStatsApiUrl = environment.apiUrl + 'systemMetrics';
    private getDateTimeApiUrl = environment.apiUrl + 'dateTime';
    private getInternetSpeedUrl = environment.apiUrl + 'internetSpeed';

    // Rest API
    // private addModSecApiUrl = environment.apiUrl + 'modSec.py/createDomain';
    // private getModSecApiUrl = environment.apiUrl + 'modSec.py/listDomain';
    // private deleteModSecApiUrl = environment.apiUrl + 'modSec.py/deleteDomain';
    // private getIPConfigApiUrl = environment.apiUrl + 'modSec.py/listip';

    // Django urls
    private addModSecApiUrl = environment.apiUrl + 'addWapDomain';
    private getModSecApiUrl = environment.apiUrl + 'listWapDomain';
    private deleteModSecApiUrl = environment.apiUrl + 'deleteWapDomain';
    private updateModSecApiUrl = environment.apiUrl + 'updateWapDomain';
    private getIPConfigApiUrl = environment.apiUrl + 'listWapIps';

    // Rest API
    // private addEmailGwApiUrl = environment.apiUrl + 'mailServer.py/addMailServer';
    // private getEmailGwApiUrl = environment.apiUrl + 'mailServer.py/viewMailServers';
    // private deleteEmailGwApiUrl = environment.apiUrl + 'mailServer.py/deleteMailServer';

    // Django urls
    private addEmailGwApiUrl = environment.apiUrl + 'addMailServer';
    private getEmailGwApiUrl = environment.apiUrl + 'viewMailServers';
    private deleteEmailGwApiUrl = environment.apiUrl + 'deleteMailServer';


    private addCountryBlockApiUrl = environment.apiUrl + '/countryBlock.py/add';


    // Rest API Path
    // private countryViewUrl = environment.apiUrl + 'countryBlock.py/view';
    // private countryAddUrl = environment.apiUrl + 'countryBlock.py/add';
    // private countryDeleteUrl = environment.apiUrl + 'countryBlock.py/delete';
    // private countryRunUrl = environment.apiUrl + 'countryBlock.py/run';

    // Django urls
    private countryViewUrl = environment.apiUrl + 'countries_view';
    private countryAddUrl = environment.apiUrl + 'countries_add';
    private countryDeleteUrl = environment.apiUrl + 'countries_delete';
    private countryRunUrl = environment.apiUrl + 'countries_run';

    // Rest API Path
    // private getMalwareListApiUrl = environment.apiUrl + 'maliciousIP.py/listMaliciousIP';
    // private addMaliciousIPApiUrl = environment.apiUrl + '/maliciousIP.py/addMaliciousIP';
    // private deleteMaliciousIPApiUrl = environment.apiUrl + 'maliciousIP.py/deleteMaliciousIP';

    // Django urls
    private getMalwareListApiUrl = environment.apiUrl + 'listMaliciousIP';
    private addMaliciousIPApiUrl = environment.apiUrl + 'addMaliciousIP';
    private deleteMaliciousIPApiUrl = environment.apiUrl + 'deleteMaliciousIP';



    // Rest API Path
    // private listBlockIpUrl = environment.apiUrl + 'blockIP.py/listBlockIP';
    // private addBlockIpUrl = environment.apiUrl + 'blockIP.py/addBlockIP';
    // private deleteBlockIpUrl = environment.apiUrl + 'blockIP.py/deleteBlockIP';

    // Django urls
    private listBlockIpUrl = environment.apiUrl + 'listBlockIP';
    private addBlockIpUrl = environment.apiUrl + 'addBlockIP';
    private deleteBlockIpUrl = environment.apiUrl + 'deleteBlockIP';


    // Rest API Path
    // private listWhitelistIpUrl = environment.apiUrl + 'whitelistIP.py/listWhitelistIP';
    // private addWhitelistIpUrl = environment.apiUrl + 'whitelistIP.py/addWhitelistIP';
    // private deleteWhitelistIpUrl = environment.apiUrl + 'whitelistIP.py/deleteWhitelistIP';

    // Django urls
    private listWhitelistIpUrl = environment.apiUrl + 'listWhitelistIP';
    private addWhitelistIpUrl = environment.apiUrl + 'addWhitelistIP';
    private deleteWhitelistIpUrl = environment.apiUrl + 'deleteWhitelistIP';



    // Rest API Path
    // private listGeoBlockIpUrl = environment.apiUrl + 'geoBlockIP.py/listGeoBlockIP';
    // private addGeoBlockIpUrl = environment.apiUrl + 'geoBlockIP.py/addGeoBlockIP';
    // private deleteGeoBlockIpUrl = environment.apiUrl + 'geoBlockIP.py/deleteGeoBlockIP';

    // Django urls
    private listGeoBlockIpUrl = environment.apiUrl + 'listGeoBlockIP';
    private addGeoBlockIpUrl = environment.apiUrl + 'addGeoBlockIP';
    private deleteGeoBlockIpUrl = environment.apiUrl + 'deleteGeoBlockIP';




    public apiKey = environment.apiKey;

    constructor(private http: HttpClient) { }


    deleteMaliciousIP(payloadObj: any): Observable<any> {
        console.log("deleteMaliciousIP() received:", payloadObj);

        const payload = new HttpParams().set('ip_address', payloadObj);

        console.log("Payload:", payload.toString());

        return this.http.post<any>(
            this.deleteMaliciousIPApiUrl,
            payload.toString(),
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/x-www-form-urlencoded'
                })
            }
        );
    }








    UpdateMalwareData(): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey
        });

        return this.http.get<any>(this.updatetMalwareListApiUrl, { headers });
    }

    updateMalwareIPStatus(ip: string, status: string): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey,  // Your API Key
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        const body = new URLSearchParams();
        body.set('ip', ip);
        body.set('status', status);

        return this.http.post<any>(this.updateMalwareStatusApiUrl, body.toString(), { headers });
    }

    getlogs(): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey
        });
        return this.http.get<any>(this.getLogsApiUrl, { headers });
    }

    getMalwareListData(): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey
        });

        return this.http.get<any>(this.getMalwareListApiUrl, { headers });
    }

    getNicData(): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey
        });

        return this.http.get<any>(this.apiUrl, { headers });
    }

    getFWOPtionsData(): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey
        });

        return this.http.get<any>(this.apigetFWOptions, { headers });
    }

    // New method to update NIC information
    updateNicInfo(data: any): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey,
            'Content-Type': 'application/json'
        });

        return this.http.post<any>(this.updateApiUrl, data, { headers });
    }

    updateDefualtGW(data: any): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey,
            'Content-Type': 'application/json'
        });

        return this.http.post<any>(this.updateGWApiUrl, data, { headers });
    }

    // New method to update NIC information
    deleteSubNic(data: any): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey,
            'Content-Type': 'application/json'
        });

        return this.http.post<any>(this.deleteSubNicApiUrl, data, { headers });
    }

    addSubNic(data: any): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey,
            'Content-Type': 'application/json'
        });

        return this.http.post<any>(this.addSubNicApiUrl, data, { headers });
    }

    updateMacros(data: any): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey,
            'Content-Type': 'application/json'
        });

        return this.http.post<any>(this.updateMacroApiUrl, data, { headers });
    }

    updateFWOptions(data: any): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey,
            'Content-Type': 'application/json'
        });

        return this.http.post<any>(this.updateFWOptionsApiUrl, data, { headers });
    }

    getRoutingData(): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey
        });

        return this.http.get<any>(this.getRoutingtableapiUrl, { headers });
    }

    getMacrosList(): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey
        });

        return this.http.get<any>(this.getMacrosapiUrl, { headers });
    }

    //PythonAPI

    getQueueDefList(): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey
        });

        return this.http.get<any>(this.getQueueDefApiUrl, { headers });
    }

    getDateTimeAPI(): Observable<any> {
        // const headers = new HttpHeaders({
        //     'X-API-KEY': this.apiKey
        // });

        //return this.http.get<any>(this.getDateTimeApiUrl, { headers });
        return this.http.get<any>(this.getDateTimeApiUrl);
    }

    getUsageStatsAPI(): Observable<any> {
        // const headers = new HttpHeaders({
        //     'X-API-KEY': this.apiKey
        // });

        //return this.http.get<any>(this.getDateTimeApiUrl, { headers });
        return this.http.get<any>(this.getUsageStatsApiUrl);
    }

    getSystemInfoAPI(): Observable<any> {
        // const headers = new HttpHeaders({
        //     'X-API-KEY': this.apiKey
        // });

        //return this.http.get<any>(this.getDateTimeApiUrl, { headers });
        return this.http.get<any>(this.getSystemInfoApiUrl);
    }


    getModSecListAPI(): Observable<any> {
        // const headers = new HttpHeaders({
        //     'X-API-KEY': this.apiKey
        // });

        //return this.http.get<any>(this.getDateTimeApiUrl, { headers });
        return this.http.get<any>(this.getModSecApiUrl);
    }

    deleteModSecApi(body: any): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        const payload = new HttpParams({ fromObject: body });
        return this.http.post<any>(this.deleteModSecApiUrl, payload.toString(), { headers });
    }


    addEmailGw(data: FormData): Observable<any> {
        return this.http.post<any>(this.addEmailGwApiUrl, data); // Don't set Content-Type
    }

    addMaliciousIP(data: FormData): Observable<any> {
        return this.http.post<any>(this.addMaliciousIPApiUrl, data); // Don't set Content-Type
    }

    addCountryBlock(data: FormData): Observable<any> {
        return this.http.post<any>(this.addCountryBlockApiUrl, data); // Don't set Content-Type
    }


    getEmailGwListAPI(): Observable<any> {
        // const headers = new HttpHeaders({
        //     'X-API-KEY': this.apiKey
        // });

        //return this.http.get<any>(this.getDateTimeApiUrl, { headers });
        return this.http.get<any>(this.getEmailGwApiUrl);
    }

    deleteEmailGwApi(body: any): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        const payload = new HttpParams({ fromObject: body });
        return this.http.post<any>(this.deleteEmailGwApiUrl, payload.toString(), { headers });
    }

    getIPConfigListAPI(): Observable<any> {
        // const headers = new HttpHeaders({
        //     'X-API-KEY': this.apiKey
        // });

        //return this.http.get<any>(this.getDateTimeApiUrl, { headers });
        return this.http.get<any>(this.getIPConfigApiUrl);
    }

    addModSecAPI(data: FormData): Observable<any> {
        return this.http.post<any>(this.addModSecApiUrl, data); // Don't set Content-Type
    }








    deleteBlockedCountry(code: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        const body = new HttpParams().set('countries', code);
        return this.http.post<any>(this.countryDeleteUrl, body.toString(), { headers });
    }

    
    execCountryCode(): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        // No body needed, just send an empty POST
        return this.http.post<any>(this.countryRunUrl, '', { headers });
    }





    getGeoCountryListData(): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey
        });
        return this.http.get<any>(this.countryViewUrl, { headers });
    }


    getBlockIpListData(): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey
        });
        return this.http.get<any>(this.listBlockIpUrl, { headers });
    }
    getWhitelistIpListData(): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey
        });
        return this.http.get<any>(this.listWhitelistIpUrl, { headers });
    }
    getGeoBlockIpListData(): Observable<any> {
        const headers = new HttpHeaders({
            'X-API-KEY': this.apiKey
        });
        return this.http.get<any>(this.listGeoBlockIpUrl, { headers });
    }


    addGeoCountry(data: FormData): Observable<any> {

        return this.http.post<any>(this.countryAddUrl, data); // Don't set Content-Type
    }

    addBlockIP(data: FormData): Observable<any> {
        return this.http.post<any>(this.addBlockIpUrl, data); // Don't set Content-Type
    }
    addWhitelistIP(data: FormData): Observable<any> {
        return this.http.post<any>(this.addWhitelistIpUrl, data); // Don't set Content-Type
    }
    addGeoBlockIP(data: FormData): Observable<any> {
        return this.http.post<any>(this.addGeoBlockIpUrl, data); // Don't set Content-Type
    }



    deleteBlockIP(payloadObj: any): Observable<any> {
        console.log("deleteBlockIP() received:", payloadObj);

        const payload = new HttpParams().set('ip_address', payloadObj);

        console.log("Payload:", payload.toString());

        return this.http.post<any>(
            this.deleteBlockIpUrl,
            payload.toString(),
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/x-www-form-urlencoded'
                })
            }
        );
    }

    deleteWhitelistIP(payloadObj: any): Observable<any> {
        console.log("deleteWhitelistIP() received:", payloadObj);

        const payload = new HttpParams().set('ip_address', payloadObj);

        console.log("Payload:", payload.toString());

        return this.http.post<any>(
            this.deleteWhitelistIpUrl,
            payload.toString(),
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/x-www-form-urlencoded'
                })
            }
        );
    }

    deleteGeoBlockIP(payloadObj: any): Observable<any> {
        console.log("deleteGeoBlockIP() received:", payloadObj);

        const payload = new HttpParams().set('ip_address', payloadObj);

        console.log("Payload:", payload.toString());

        return this.http.post<any>(
            this.deleteGeoBlockIpUrl,
            payload.toString(),
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/x-www-form-urlencoded'
                })
            }
        );
    }

    deleteGeoCountry(payloadObj: any): Observable<any> {
        console.log("deleteGeoCountry() received:", payloadObj);

        const payload = new HttpParams().set('countries', payloadObj);
        console.log("Payload:", payload.toString());

        return this.http.post<any>(
            this.countryDeleteUrl,
            payload.toString(),
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/x-www-form-urlencoded'
                })
            }
        );

    }

}