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
    private getMalwareListApiUrl = environment.apiUrl + 'maliciousIP.py/listMaliciousIP';
    private updatetMalwareListApiUrl = environment.apiUrl + 'masterApi.py/updateMalwareFile';
    private updateMalwareStatusApiUrl = environment.apiUrl + 'masterApi.py/UpdateMalwareIPStatus';
    private getLogsApiUrl = environment.apiUrl + 'masterApi.py/logs';

    private getDateTimeApiUrl = environment.apiUrl + 'dateTime.py';
    private getUsageStatsApiUrl = environment.apiUrl + 'systemspec.py';
    private getSystemInfoApiUrl = environment.apiUrl + 'sysinfo.py';
    private getModSecApiUrl = environment.apiUrl + 'modSec.py/listDomain';
    private deleteModSecApiUrl = environment.apiUrl + 'modSec.py/deleteDomain';
    private getIPConfigApiUrl = environment.apiUrl + 'modSec.py/listip';


    private addEmailGwApiUrl = environment.apiUrl + 'mailServer.py/addMailServer';
    private getEmailGwApiUrl = environment.apiUrl + 'mailServer.py/viewMailServers';
    private deleteEmailGwApiUrl = environment.apiUrl + 'mailServer.py/deleteMailServer';


    private addMaliciousIPApiUrl = environment.apiUrl + '/maliciousIP.py/addMaliciousIP';
    private addCountryBlockApiUrl = environment.apiUrl + '/countryBlock.py/add';

    private addModSecApiUrl = environment.apiUrl + 'modSec.py/createDomain';

    private deleteMaliciousIPApiUrl = environment.apiUrl + 'maliciousIP.py/deleteMaliciousIP';
    private deleteCountryApiUrl = environment.apiUrl + 'countryBlock.py/delete';

    private countryViewUrl = environment.apiUrl + 'countryBlock.py/view';
    private countryAddUrl = environment.apiUrl + 'countryBlock.py/add';
    private countryDeleteUrl = environment.apiUrl + 'countryBlock.py/delete';
    private countryRunUrl = environment.apiUrl + 'countryBlock.py/run';


    private listBlockIpUrl = environment.apiUrl + 'blockIP.py/listBlockIP';
    private addBlockIpUrl = environment.apiUrl + 'blockIP.py/addBlockIP';
    private deleteBlockIpUrl = environment.apiUrl + 'blockIP.py/deleteBlockIP';

    private listWhitelistIpUrl = environment.apiUrl + 'whitelistIP.py/listWhitelistIP';
    private addWhitelistIpUrl = environment.apiUrl + 'whitelistIP.py/addWhitelistIP';
    private deleteWhitelistIpUrl = environment.apiUrl + 'whitelistIP.py/deleteWhitelistIP';

    private listGeoBlockIpUrl = environment.apiUrl + 'geoBlockIP.py/listGeoBlockIP';
    private addGeoBlockIpUrl = environment.apiUrl + 'geoBlockIP.py/addGeoBlockIP';
    private deleteGeoBlockIpUrl = environment.apiUrl + 'geoBlockIP.py/deleteGeoBlockIP';



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





    unBlockCountry(country: any): Observable<any> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        const payload = new HttpParams({ fromObject: country });
        return this.http.post<any>(this.deleteCountryApiUrl, payload.toString(), { headers });
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

    viewBlockedCountries(): Observable<any> {
        return this.http.get<any>(this.countryViewUrl);
    }

    addBlockedCountry(code: string): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        const body = new HttpParams().set('countries', code);
        return this.http.post<any>(this.countryAddUrl, body.toString(), { headers });
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

}