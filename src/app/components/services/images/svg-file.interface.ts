import { SafeResourceUrl } from '@angular/platform-browser';

export interface SvgFile {
    path: SafeResourceUrl;
    width: string;
    height: string;
    name: string;
    label: string;
}
