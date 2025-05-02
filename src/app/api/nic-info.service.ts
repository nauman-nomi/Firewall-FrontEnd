import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    private updateFWOptionsApiUrl  = environment.apiUrl + '/updateFWOptions.php';

    private getMacrosapiUrl = environment.apiUrl + '/getMacros.php';
    private apigetFWOptions = environment.apiUrl + '/getFirewallOptions.php';

    private getRoutingtableapiUrl = environment.apiUrl + '/getRoutingTable.php';

    // Python APIs

    private getQueueDefApiUrl = environment.apiUrl + '/masterApi.py/getQueueDefination';
    private getMalwareListApiUrl = environment.apiUrl + '/masterApi.py/maliciousFiles';
    private updatetMalwareListApiUrl = environment.apiUrl + '/masterApi.py/updateMalwareFile';
    private updateMalwareStatusApiUrl = environment.apiUrl + '/masterApi.py/UpdateMalwareIPStatus';

    public apiKey = environment.apiKey;
    
    constructor(private http: HttpClient) { }

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
    
}
