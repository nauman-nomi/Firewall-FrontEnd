import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { SSL_PROTOCOL_LIST, SSL_CIPHER_LIST, HTTP_METHOD_LIST, ipPortValidator, multiIPv4DNSResolverValidator } from './constants';
import { NicService } from 'app/api/nic-info.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-mod-sec-form',
    templateUrl: './mod-sec-form.component.html',
    styleUrls: ['./mod-sec-form.component.scss']
})
export class ModSecFormComponent {
    errorAlert: { type: FuseAlertType; message: string } = { type: 'error', message: '' };
    alert: { type: FuseAlertType; message: string } = { type: 'error', message: 'Error! Duplicate Selection Found' };
    showAlert: boolean = false;
    isSubmitting: boolean = false;
    modSecForm!: FormGroup;
    methodList: any[] = HTTP_METHOD_LIST;
    ifConfigList: any[] = ['1.2.3.4', '5.6.7.8', '55.66.77.88'];
    sslProtocolList: any[] = SSL_PROTOCOL_LIST;
    sslCipherList: any[] = SSL_CIPHER_LIST;


    constructor(public dialogRef: MatDialogRef<ModSecFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
        private getModSecService: NicService, private cdr: ChangeDetectorRef) {
        this.getIPConfigList();
        console.log();
        this.modSecForm = this.fb.group({
            listenIP: ['', [Validators.required]],
            domain: ['', [Validators.required]],
            localip: ['', [Validators.required, ipPortValidator]],
            webtype: ['http'],
            modSec: ['off'],
            certificate: ['',],
            certificateKey: ['',],
            ipwhitelist: ['',],
            whiteMethod: ['',],
            http2: ['off'],
            ssl_session_cache_time: [],
            ssl_session_timeout_time: [],
            ssl_protocol: [],
            ssl_cipher: [],
            sslPreferServerCipher: ['off'],
            dnsResolver: ['', multiIPv4DNSResolverValidator],
            dnsResolverTimeout: [],
            maxBodySize: [],
            proxyBuffering: ['off'],
            proxyRequestBuffering: ['off']
        });
    }

    ngOnInit() {
        this.modSecForm.get('webtype')?.valueChanges.subscribe((value) => {
            const cert = this.modSecForm.get('certificate');
            const certKey = this.modSecForm.get('certificateKey');

            if (value === 'https') {
                cert?.enable();
                certKey?.enable();
                cert?.setValidators([Validators.required]);
                certKey?.setValidators([Validators.required]);
            } else {
                cert?.reset();
                certKey?.reset();
                cert?.clearValidators();
                certKey?.clearValidators();
                cert?.disable();
                certKey?.disable();
            }

            cert?.updateValueAndValidity();
            certKey?.updateValueAndValidity();
        });
    }


    onCertificateChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.modSecForm.patchValue({
                certificate: file
            });
            this.modSecForm.get('certificate')?.markAsTouched();
        }
    }

    onCertificateKeyChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.modSecForm.patchValue({
                certificateKey: file
            });
            this.modSecForm.get('certificateKey')?.markAsTouched();
        }
    }

    getIPConfigList() {
        this.getModSecService.getIPConfigListAPI()
            .pipe(
                catchError(error => {
                    //this.showTimedAlert("error", "Error Fetching Data")
                    // this.showAlert = true;
                    // this.alert.type="error";
                    // this.alert.message = "Error Fetching Data";
                    //this.loading = false;
                    return of({ api_status: 'error', message: 'Failed to fetch data' });
                })
            )
            .subscribe(response => {
                if (response.api_status === 'success')
                //if (true) 
                {
                    // Assign values to individual variables
                    this.ifConfigList = response.ip_list;
                    console.log(this.ifConfigList);
                }
                else {
                    this.showTimedAlert("error", response.message || "Unknown error")
                }

            });
    }

    showTimedAlert(type: FuseAlertType, message: string) {
        this.alert.type = type;
        this.alert.message = message;
        this.showAlert = true;

        // Automatically hide the alert after 5 seconds
        setTimeout(() => {
            this.showAlert = false;
        }, 2000);
    }

    closeDialog() {
        this.dialogRef.close('Dialog Closed');
    }

    onSubmit() {
        if (this.modSecForm.invalid) {
            this.showAlert = true;
            this.errorAlert.message = 'Please fill all required fields correctly.';
            this.errorAlert.type = 'error';
            return;
        }

        this.isSubmitting = true;
        const formValue = this.modSecForm.value;
        const formData = new FormData();

        // Append form data
        formData.append('listenip', formValue.listenIP);
        formData.append('domain', formValue.domain);
        formData.append('localip', formValue.localip);
        formData.append('Ipwhitelist', formValue.ipwhitelist);

        formData.append('whitemethod', (formValue.whiteMethod || []).join(','));
        formData.append('ssl_protocols', (formValue.ssl_protocol || []).join(','));
        formData.append('ssl_ciphers', (formValue.ssl_cipher || []).join(','));

        formData.append('ssl_session_cache', formValue.ssl_session_cache_time);
        formData.append('ssl_session_timeout', formValue.ssl_session_timeout_time);

        formData.append('dns_resolver', formValue.dnsResolver);
        formData.append('resolver_timeout', formValue.dnsResolverTimeout);
        formData.append('client_max_body_size', formValue.maxBodySize);

        formData.append('webtype', formValue.webtype);
        formData.append('modSec', formValue.modSec);
        formData.append('http2', formValue.http2);
        formData.append('ssl_prefer_server_ciphers', formValue.sslPreferServerCipher);

        formData.append('proxy_buffering', formValue.proxyBuffering);
        formData.append('proxy_request_buffering', formValue.proxyRequestBuffering);

        // Only append pem_file if it exists (relevant for SMTPS)
        if (formValue.certificate && formValue.certificateKey) {
            formData.append('certificate', formValue.certificate);
            formData.append('certificatekey', formValue.certificateKey);
        }
        console.log(formData);
        // Call API
        this.getModSecService.addModSecAPI(formData).subscribe(
            (response) => {
                console.log('success called')
                this.isSubmitting = false;
                this.showAlert = true;
                this.alert.type = 'success';
                this.alert.message = 'ModSec configuration saved successfully!';
                this.cdr.detectChanges(); // Ensure UI updates
                setTimeout(() => {
                    this.dialogRef.close(formData); // Close dialog after showing success
                }, 2000); // Optional delay to show success message briefly
            },
            (error) => {

                this.isSubmitting = false;
                this.showAlert = true;
                this.alert.type = 'error';
                this.alert.message = 'Failed to save Email Gateway configuration. Please try again.';
                console.error('Error:', error);
                this.cdr.detectChanges();
            }
        );
    }

}
