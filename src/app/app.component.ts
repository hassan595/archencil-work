import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InputConfigStartupService } from '~components/canvas/services/input-config-startup.service';
import { GlobalsService } from '~components/services/globals.service';
import { Meta } from '@angular/platform-browser';
import { HTMLService } from './html.service';
import { APP_CONFIG } from '../environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
    title = 'archencil';
    state: any = null;

    constructor(
        // eslint-disable-next-line no-unused-vars
        private translate: TranslateService,
        // eslint-disable-next-line no-unused-vars
        private route: ActivatedRoute,
        // eslint-disable-next-line no-unused-vars
        private router: Router,
        // eslint-disable-next-line no-unused-vars
        private inputConfigStartupService: InputConfigStartupService,
        // eslint-disable-next-line no-unused-vars
        private globalsService: GlobalsService,
        // eslint-disable-next-line no-unused-vars
        private meta: Meta,
        // eslint-disable-next-line no-unused-vars
        private _HTMLService: HTMLService
    ) {
        this.translate.setDefaultLang('en_US');
        //this.translate.use('en_US');

        if (APP_CONFIG.type == 'ELECTRON') {
            //TODO I am setting is electron in main.ts
            this.globalsService.setGlobal('isElectron', true);
            console.log('Environment: Is Electron.');
        } else {
            //TODO I am setting is electron in main.ts
            this.globalsService.setGlobal('isElectron', false);
            console.log('Environment: Is WEB.');
        }


    }

    ngAfterViewInit() {
        console.log('ngAfterViewInit');
    }

    ngOnInit(): void {
        this.setCspPolicy();
    }

    setCspPolicy() {
        const csp = this._HTMLService.getPolicy();
        //console.log(csp);  // Add this line

        this.meta.updateTag({
            name: 'Content-Security-Policy',
            content: csp
        });
    }

    // Disable default context menu globally
    @HostListener('document:contextmenu', ['$event'])
    onDocumentRightClick(event: MouseEvent) {
        event.preventDefault();
    }

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnDestroy(): void {}
}
