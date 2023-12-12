import { Injectable } from '@angular/core';
import { APP_CONFIG } from '~src/environments/environment';

type CSPolicy = {
    'default-src': string;
    'script-src': string;
    'style-src': string;
    'font-src': string;
    'connect-src': string;
    'img-src': string;
    'media-src': string;
    'object-src': string;
    'child-src': string;
    'frame-src': string;
};
@Injectable({
    providedIn: 'root'
})
export class HTMLService {
    constructor() {}

    getPolicy(): string {
        // Get current domain
        const domain = window.location.hostname;

        // Build policy
        // Remember that any alteration here must be replicated at index.html
        let policy: CSPolicy = {
            'default-src': `'self'`,
            'script-src': `'self' 'unsafe-inline' 'unsafe-eval'`,
            'style-src': `'self' 'unsafe-inline'`,
            'font-src': `'self' data:`,
            'connect-src': `'self'`,
            'img-src': `'self' data:`,
            'media-src': `'self'`,
            'object-src': `'self'`,
            'child-src': `'self'`,
            'frame-src': `'self'`
        };

        // Adjust policy based on the environment
        if (APP_CONFIG.production) {
            policy['img-src'] = `'self' data:`;
            policy['connect-src'] = `'self'`;
        } else {
            policy['img-src'] = `* data:`;
            policy['connect-src'] = `'self' http://${domain}:${APP_CONFIG.angular_dev_port}`;
        }

        // Build policy string
        let policyString = '';
        for (const key in policy) {
            if (Object.prototype.hasOwnProperty.call(policy, key)) {
                const policyValue = policy[key as keyof CSPolicy]; // Type assertion here
                if (policyString !== '') {
                    policyString += '; ';
                }
                policyString += `${key} ${policyValue}`;
            }
        }

        return policyString;
    }
}
