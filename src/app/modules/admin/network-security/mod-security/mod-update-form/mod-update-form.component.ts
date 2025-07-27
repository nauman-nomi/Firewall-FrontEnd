import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { SSL_PROTOCOL_LIST, SSL_CIPHER_LIST, HTTP_METHOD_LIST, ipPortValidator, multiIPv4DNSResolverValidator } from './constants';
import { NicService } from 'app/api/nic-info.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-mod-update-form',
  templateUrl: './mod-update-form.component.html',
  styleUrls: ['./mod-update-form.component.scss']
})
export class ModUpdateFormComponent {
  errorAlert: { type: FuseAlertType; message: string } = { type: 'error', message: '' };
  alert: { type: FuseAlertType; message: string } = { type: 'error', message: 'Error! Duplicate Selection Found' };
  showAlert: boolean = false;
  isSubmitting: boolean = false;
  modUpdateForm!: FormGroup;
  methodList: any[] = HTTP_METHOD_LIST;
  ifConfigList: any[] = ['1.2.3.4', '5.6.7.8', '55.66.77.88'];
  sslProtocolList: any[] = SSL_PROTOCOL_LIST;
  sslCipherList: any[] = SSL_CIPHER_LIST;
  isEdit = false;


  constructor(public dialogRef: MatDialogRef<ModUpdateFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private getModSecService: NicService, private cdr: ChangeDetectorRef) {
    this.getIPConfigList();
    console.log();
    this.isEdit = !!this.data.row?.domain_name;
    this.modUpdateForm = this.fb.group({
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
    const domainName = this.data.row.domain_name;
    const localip = this.data.row.localip;

    console.log('Domain:', domainName);
    console.log('Local IP:', localip);

    this.modUpdateForm.patchValue({
      domain: this.data.row.domain_name,
      listenIP: this.data.row.listenip,
      localip: this.data.row.localip,
      ipwhitelist: this.data.row.ip_whitelist,
      whiteMethod: this.data.row.method_whitelist
        ? this.data.row.method_whitelist.split(',').filter((m: string) => m.trim() !== '')
        : [],
      ssl_session_cache_time: this.data.row.ssl_session_cache
        ? Number(this.data.row.ssl_session_cache)
        : null,
      ssl_session_timeout_time: this.data.row.ssl_session_timeout
        ? Number(this.data.row.ssl_session_timeout)
        : null,
      ssl_protocol: this.data.row.ssl_protocols
        ? this.data.row.ssl_protocols.split(',').filter((p: string) => p.trim() !== '')
        : [],
      ssl_cipher: this.data.row.ssl_ciphers
        ? this.data.row.ssl_ciphers.split(',').filter((c: string) => c.trim() !== '')
        : [],
      sslPreferServerCipher: this.data.row.ssl_prefer_server_ciphers,
      dnsResolver: this.data.row.dns_resolver,
      dnsResolverTimeout: this.data.row.resolver_timeout
        ? Number(this.data.row.resolver_timeout)
        : null,
      maxBodySize: this.data.row.client_max_body_size
        ? Number(this.data.row.client_max_body_size)
        : null,
      modSec: this.data.row.modSec,
      webtype: this.data.row.web_type,
      http2: this.data.row.http2,
      proxyBuffering: this.data.row.proxy_buffering,
      proxyRequestBuffering: this.data.row.proxy_request_buffering,
    });
    this.cdr.detectChanges();


    this.modUpdateForm.get('webtype')?.valueChanges.subscribe((value) => {
      const cert = this.modUpdateForm.get('certificate');
      const certKey = this.modUpdateForm.get('certificateKey');

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
      this.modUpdateForm.patchValue({
        certificate: file
      });
      this.modUpdateForm.get('certificate')?.markAsTouched();
    }
  }

  onCertificateKeyChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.modUpdateForm.patchValue({
        certificateKey: file
      });
      this.modUpdateForm.get('certificateKey')?.markAsTouched();
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

    if (this.modUpdateForm.get('webtype')?.value === 'https') {
      const cert = this.modUpdateForm.get('certificate')?.value;
      const key = this.modUpdateForm.get('certificateKey')?.value;

      if (!cert || !key) {
        this.showAlert = true;
        this.errorAlert.message = 'Certificate and Key files are required for HTTPS.';
        this.errorAlert.type = 'error';
        this.isSubmitting = false;
        return;
      }
    }

    console.log("isEdit:", this.isEdit);
    if (this.modUpdateForm.invalid) {
      this.showAlert = true;
      this.errorAlert.message = 'Please fill all required fields correctly.';
      this.errorAlert.type = 'error';
      return;
    }

    this.isSubmitting = true;

    const formValue = this.modUpdateForm.value;
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
    if (this.isEdit) {
      this.modUpdateForm.get('domain')?.disable();
      this.getModSecService.addModSecAPI(formData).subscribe(

        (response) => {
          console.log('success called')
          this.isSubmitting = false;
          this.showAlert = true;
          this.alert.type = 'success';
          this.alert.message = 'ModSec configuration updated successfully!';
          this.cdr.detectChanges(); // Ensure UI updates
          setTimeout(() => {
            this.dialogRef.close(formData); // Close dialog after showing success
          }, 2000); // Optional delay to show success message briefly
        },
        (error) => {

          this.isSubmitting = false;
          this.showAlert = true;
          this.alert.type = 'error';
          this.alert.message = 'Failed to update Email Gateway configuration. Please try again.';
          console.error('Error:', error);
          this.cdr.detectChanges();
        }
      );
    } else {
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

}
