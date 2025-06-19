import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
    selector: 'app-mod-sec-form',
    templateUrl: './mod-sec-form.component.html',
    styleUrls: ['./mod-sec-form.component.scss']
})
export class ModSecFormComponent{
    errorAlert: { type: FuseAlertType; message: string } = { type: 'error', message: '' };
    alert: { type: FuseAlertType; message: string } = { type: 'error', message: 'Error! Duplicate Selection Found' };
    showAlert: boolean = false;
    isSubmitting: boolean = false;
    modSecForm!: FormGroup;
    methodList:any[] = ['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS','CONNECT','TRACE'];
    ifConfigList:any[]=['1.2.3.4','5.6.7.8','55.66.77.88'];
    sslProtocolList:any[]=['SSLv2','SSLv3','TLSv1','TLSv1.1','TLSv1.2','TLSv1.3'];
    sslCipherList:any[]=[
        // TLS 1.3 cipher suites (no key exchange or MAC fields)
        'TLS_AES_128_GCM_SHA256',
        'TLS_AES_256_GCM_SHA384',
        'TLS_CHACHA20_POLY1305_SHA256',
        'TLS_AES_128_CCM_SHA256',
        'TLS_AES_128_CCM_8_SHA256',
      
        // TLS 1.2 & earlier - Strong Suites
        'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',
        'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384',
        'TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256',
        'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256',
        'TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384',
        'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384',
        'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256',
        'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256',
        'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
        'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
        'TLS_DHE_RSA_WITH_AES_256_GCM_SHA384',
        'TLS_DHE_RSA_WITH_AES_128_GCM_SHA256',
        'TLS_DHE_RSA_WITH_AES_256_CBC_SHA256',
        'TLS_DHE_RSA_WITH_AES_128_CBC_SHA256',
        'TLS_DHE_RSA_WITH_AES_256_CBC_SHA',
        'TLS_DHE_RSA_WITH_AES_128_CBC_SHA',
        'TLS_RSA_WITH_AES_256_GCM_SHA384',
        'TLS_RSA_WITH_AES_128_GCM_SHA256',
        'TLS_RSA_WITH_AES_256_CBC_SHA256',
        'TLS_RSA_WITH_AES_128_CBC_SHA256',
        'TLS_RSA_WITH_AES_256_CBC_SHA',
        'TLS_RSA_WITH_AES_128_CBC_SHA',
      
        // PSK variants (Pre-Shared Key)
        'TLS_PSK_WITH_AES_128_CBC_SHA',
        'TLS_PSK_WITH_AES_256_CBC_SHA',
        'TLS_PSK_WITH_AES_128_GCM_SHA256',
      
        // Camellia cipher suites
        'TLS_RSA_WITH_CAMELLIA_256_CBC_SHA',
        'TLS_RSA_WITH_CAMELLIA_128_CBC_SHA',
        'TLS_ECDHE_RSA_WITH_CAMELLIA_256_CBC_SHA384',
        'TLS_ECDHE_RSA_WITH_CAMELLIA_128_CBC_SHA256',
      
        // ChaCha20 for non-TLS 1.3
        'TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256',
        'TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256',
        'TLS_DHE_RSA_WITH_CHACHA20_POLY1305_SHA256',
      
        // Deprecated / Weak Ciphers — avoid in production!
        'TLS_RSA_WITH_3DES_EDE_CBC_SHA',                 // Weak: 112-bit key
        'TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA',
        'TLS_RSA_WITH_RC4_128_SHA',                      // Insecure: RC4
        'TLS_RSA_WITH_RC4_128_MD5',
        'TLS_RSA_WITH_NULL_SHA',                         // No encryption!
        'TLS_RSA_WITH_NULL_MD5',
        'TLS_RSA_WITH_DES_CBC_SHA',                      // Insecure
        'TLS_DHE_RSA_WITH_3DES_EDE_CBC_SHA',
        'TLS_DHE_RSA_WITH_DES_CBC_SHA',
        'TLS_ECDHE_RSA_WITH_NULL_SHA',
      ];

    constructor(public dialogRef: MatDialogRef<ModSecFormComponent>,@Inject(MAT_DIALOG_DATA) public data: any ,private fb: FormBuilder) 
    {
        console.log(this.data.row);
        this.modSecForm = this.fb.group({
            listenIP:['',[Validators.required]], 
            domain: ['', [Validators.required]],
            localip: ['', [Validators.required, Validators.pattern(/^(\d{1,3}\.){3}\d{1,3}$/)]],
            webtype:[],
            modSec:[],
            certificate: ['', [Validators.required]],
            certificateKey: ['', [Validators.required]],
            ipwhitelist: ['', [Validators.required]],
            whiteMethod: ['', [Validators.required]],
            http2:[],
            ssl_session_cache_time:[],
            ssl_session_timeout_time:[],
            ssl_protocol:[],
            ssl_cipher:[],
            sslPreferServerCipher:[],
            dnsResolver:[],
            dnsResolverTimeout:[],
            maxBodySize:[],
            proxyBuffering:[],
            proxyRequestBuffering:[]
        });
    }

    closeDialog()
    {
        this.dialogRef.close('Dialog Closed');
    }

    onSubmit()
    {
        
    }

}
