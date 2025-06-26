import { AbstractControl, ValidationErrors } from "@angular/forms";

export const SSL_PROTOCOL_LIST: any[] = [
    'SSLv2',
    'SSLv3',
    'TLSv1',
    'TLSv1.1',
    'TLSv1.2',
    'TLSv1.3',
];

export const SSL_CIPHER_LIST:any[]=[
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

export const HTTP_METHOD_LIST:any[] = ['GET','POST','PUT','PATCH','DELETE','HEAD','OPTIONS','CONNECT','TRACE'];

export function ipPortValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
  
    if (!value) return null; // Let `Validators.required` handle empty input
  
    const ipPortRegex = /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d):(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]?\d{1,4})$/;

  
    return ipPortRegex.test(value) ? null : { invalidIpPort: true };
}

export function multiIPv4DNSResolverValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
  
    if (!value) return null; // Let required validator handle empty input
  
    const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;
  
    const parts = value.trim().split(/\s+/); // split by one or more spaces
  
    const allValid = parts.every(ip => ipv4Regex.test(ip));
  
    return allValid ? null : { invalidMultiIPv4: true };
  }