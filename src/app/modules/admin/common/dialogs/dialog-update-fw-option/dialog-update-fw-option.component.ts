import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertType } from '@fuse/components/alert';
import { NicService } from 'app/api/nic-info.service';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
    selector: 'app-dialog-update-fw-option',
    templateUrl: './dialog-update-fw-option.component.html',
    styleUrls: ['./dialog-update-fw-option.component.scss']
})
export class DialogUpdateFwOptionComponent implements OnInit {
    
    alert: { type: FuseAlertType; message: string } = { type: 'success', message: '' };
    showAlert: boolean = false;
    loading: boolean = true;
    isSubmitting: boolean = false;

    pfForm: FormGroup;
    policy = ['drop', 'return'];
    macros: string[] = [];
    optimizationOptions = ['normal', 'high-latency', 'aggressive', 'conservative'];
    rulesetOptions = ['none', 'basic', 'profile'];
    debugOptions = ['none', 'urgent', 'misc', 'loud'];
    statePolicyOptions = ['if-bound', 'floating'];
    requireOrderOptions = ['yes', 'no'];
    syncookiesOptions = ['never', 'always', 'adaptive'];

    options: any = {};

    constructor(
        public dialogRef: MatDialogRef<DialogUpdateFwOptionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private nicService: NicService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef
    ) {
        this.options = this.data.row || {};
        this.pfForm = this.fb.group({
            blockPolicy: ['', Validators.required],
            logInterface: [[]],
            optimization: ['', Validators.required],
            rulesetOptimization: ['', Validators.required],
            limits: this.fb.group({
                states: [0, [Validators.required, Validators.min(0)]],
                frags: [0, [Validators.required, Validators.min(0)]],
                srcNodes: [0, [Validators.required, Validators.min(0)]],
                tableEntries: [0, [Validators.required, Validators.min(0)]],
            }),
            skipOnLo: [false],
            debug: ['', Validators.required],
            fingerprints: [false],
            statePolicy: ['', Validators.required],
            requireOrder: ['', Validators.required],
            syncookies: ['', Validators.required],
            timeouts: this.fb.group({
                tcpFirst: [0, [Validators.required, Validators.min(0)]],
                tcpOpening: [0, [Validators.required, Validators.min(0)]],
                tcpEstablished: [0, [Validators.required, Validators.min(0)]],
                tcpClosing: [0, [Validators.required, Validators.min(0)]],
                tcpFinwait: [0, [Validators.required, Validators.min(0)]],
                tcpClosed: [0, [Validators.required, Validators.min(0)]],
                udpFirst: [0, [Validators.required, Validators.min(0)]],
                udpSingle: [0, [Validators.required, Validators.min(0)]],
                icmpFirst: [0, [Validators.required, Validators.min(0)]],
                icmpError: [0, [Validators.required, Validators.min(0)]],
            })
        });
    }

    ngOnInit() {
        this.getMacros();
        this.initializeForm();
    }

    initializeForm() {
        const options = this.options;
    
        this.pfForm.patchValue({
            blockPolicy: options.other_settings?.["block-policy"] || 'drop',
            logInterface: options.loginterface || [],
            optimization: options.other_settings?.optimization || 'normal',
            rulesetOptimization: options.other_settings?.["ruleset-optimization"] || 'none',
            skipOnLo: options.skip?.includes('lo') || false,
            debug: options.other_settings?.debug || 'none',
            fingerprints: options.other_settings?.fingerprints ? true : false,
            statePolicy: options.other_settings?.["state-policy"] || 'ifbound',
            requireOrder: options.other_settings?.["require-order"] || 'yes',
            syncookies: options.other_settings?.syncookies || 'adaptive',
        });

        if (options.limit) {
            this.pfForm.get('limits')?.patchValue({
                states: options.limit.states ?? 0,
                frags: options.limit.frags ?? 0,
                srcNodes: options.limit["src-nodes"] ?? 0,
                tableEntries: options.limit["table-entries"] ?? 0,
            });
        }

        if (options.timeout) {
            this.pfForm.get('timeouts')?.patchValue({
                tcpFirst: options.timeout["tcp.first"] ?? 0,
                tcpOpening: options.timeout["tcp.opening"] ?? 0,
                tcpEstablished: options.timeout["tcp.established"] ?? 0,
                tcpClosing: options.timeout["tcp.closing"] ?? 0,
                tcpFinwait: options.timeout["tcp.finwait"] ?? 0,
                tcpClosed: options.timeout["tcp.closed"] ?? 0,
                udpFirst: options.timeout["udp.first"] ?? 0,
                udpSingle: options.timeout["udp.single"] ?? 0,
                icmpFirst: options.timeout["icmp.first"] ?? 0,
                icmpError: options.timeout["icmp.error"] ?? 0,
            });
        }
    }

    getMacros() {
        this.nicService.getMacrosList()
            .pipe(
                catchError(error => {
                    this.showTimedAlert("error", "Error Fetching Data");
                    this.loading = false;
                    return of({ api_status: 'error', message: 'Failed to fetch data' });
                })
            )
            .subscribe(response => {
                if (response.api_status === 'success') {
                    this.macros = response.variables;
                    this.loading = false;
                } else {
                    this.showTimedAlert("error", response.message || "Unknown error");
                    this.loading = false;
                }
            });
    }

    showTimedAlert(type: FuseAlertType, message: string) {
        this.alert.type = type;
        this.alert.message = message;
        this.showAlert = true;

        setTimeout(() => {
            this.showAlert = false;
        }, 2000);
    }

   
    onSubmit() {
        if (this.pfForm.valid) {
            this.showAlert = false;
            this.isSubmitting = true;

            // Prepare payload
            const payload = {
                ...this.pfForm.value,
                api_key: this.nicService.apiKey
            };

            console.log(payload);

            // Call API
            this.nicService.updateFWOptions(payload).subscribe(
                (response) => {
                    console.log('FWOptions Update:', response);

                    this.alert = {
                        type: response.status === 'success' ? 'success' : 'error',
                        message: response.message
                    };
                    this.showAlert = true;
                    this.isSubmitting = false;
                    this.closeDialog();
                },
                (error) => {
                    console.error('Failed to add Sub-NIC info:', error);

                    this.alert = {
                        type: 'error',
                        message: 'Failed to update Macros. Please try again.'
                    };
                    this.showAlert = true;
                    this.isSubmitting = false;
                }
            );

            this.cdr.detectChanges();
        }
    }

    closeDialog() {
        this.dialogRef.close('Dialog Closed');
    }
}
