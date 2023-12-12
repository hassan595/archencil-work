import { InputConfigStartupService } from '~components/canvas/services/input-config-startup.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { CoreModule } from './core/core.module';
import { DetailModule } from './detail/detail.module';
import { NgModule } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SharedModule } from './shared/shared.module';
import { NgxTippyModule } from 'ngx-tippy-wrapper';
import { MessageState } from './store/message.reducer';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { SVGLoaderService } from '~components/services/images/SVGLoader.service';
import { SvgImageDirective } from '~directives/SvgImage.directive';
import { APP_INITIALIZER } from '@angular/core';
import { PreloadService } from './services/preload.service';

interface AppState {
    messageState: MessageState;
}

// NgRx imports
import { StoreModule } from '@ngrx/store';
import { messageReducer } from './store/message.reducer';
import { TestNgRxComponent } from '~components/tests-sample/test-ngrx/test-ngrx.component';
import { TestJasmineComponent } from '~components/tests-sample/test-jasmine/test-jasmine.component';
import { TestTailwindUiComponent } from '~components/tests-sample/test-tailwind-ui/test-tailwind-ui.component';
import { TestPlaywrightComponent } from '~components/tests-sample/test-playwright/test-playwright.component';
import { CanvasComponent } from '~components/canvas/canvas.component';
import { ToolsMenuComponent } from '~components/canvas/tools-menu/tools-menu.component';
import { BoundingBoxComponent } from '~components/canvas/bounding-box/bounding-box.component';
import { ContextMenuComponent } from '~components/canvas/bounding-box/context-menu/context-menu.component';
import { GlobalContextMenuComponent } from '~components/global-context-menu/global-context-menu.component';
import { ElementHeaderBarComponent } from '~components/canvas/bounding-box/element-header-bar/element-header-bar.component';

//
import { GlobalTooltipDirective } from '~components/global-tooltip/directives/global-tooltip.directive';
import { GlobalTooltipService } from '~components/global-tooltip/services/global-tooltip.service';
import { GlobalTooltipComponent } from '~components/global-tooltip/global-tooltip.component';
import { HandleStickyNoteSubmenuComponent } from '~components/canvas/tools-menu/secondary-menus/handle-sticky-note-submenu/handle-sticky-note-submenu.component';
import { HandleShapeSubmenuComponent } from '~components/canvas/tools-menu/secondary-menus/handle-shape-submenu/handle-shape-submenu.component';
import { SubmenuContainerComponent } from '~components/canvas/tools-menu/secondary-menus/submenu-container/submenu-container.component';
import { HandleConnectionLineSubmenuComponent } from '~components/canvas/tools-menu/secondary-menus/handle-connection-line-submenu/handle-connection-line-submenu.component';
import { HandleDrawingSubmenuComponent } from '~components/canvas/tools-menu/secondary-menus/handle-drawing-submenu/handle-drawing-submenu.component';
import { HandleUploadSubmenuComponent } from '~components/canvas/tools-menu/secondary-menus/handle-upload-submenu/handle-upload-submenu.component';
import { HandleFrameSubmenuComponent } from '~components/canvas/tools-menu/secondary-menus/handle-frame-submenu/handle-frame-submenu.component';
import { HandleTemplatesSubmenuComponent } from '~components/canvas/tools-menu/secondary-menus/handle-templates-submenu/handle-templates-submenu.component';
import { HandleMoreSubmenuComponent } from '~components/canvas/tools-menu/secondary-menus/handle-more-submenu/handle-more-submenu.component';
import { FontSizeComponent } from '~components/canvas/bounding-box/element-header-bar/font-size/font-size.component';
import { FontSelectionComponent } from '~components/canvas/bounding-box/element-header-bar/font-selection/font-selection.component';
import { TextChangesComponent } from '~components/canvas/bounding-box/element-header-bar/text-changes/text-changes.component';
import { TextColorsComponent } from '~components/canvas/bounding-box/element-header-bar/text-colors/text-colors.component';
import { BoxColorsComponent } from '~components/canvas/bounding-box/element-header-bar/box-colors/box-colors.component';
import { SwitchTypeComponent } from '~components/canvas/bounding-box/element-header-bar/switch-type/switch-type.component';

// eslint-disable-next-line no-unused-vars
class CustomTranslateHttpLoader extends TranslateHttpLoader {
    constructor(http: HttpClient, prefix: string = './assets/i18n/', suffix: string = '.json') {
        super(http, prefix, suffix);
    }

    override getTranslation(lang: string): Observable<any> {
        return super.getTranslation(lang);
    }
}

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): CustomTranslateHttpLoader => {
    return new CustomTranslateHttpLoader(http, './assets/i18n/', '.json');
};

export function initializeApp(svgLoaderService: SVGLoaderService, preloadService: PreloadService) {
    return (): Promise<any> => {
        // First preload SVGs, then fonts
        return svgLoaderService.preloadSVGs().then(() => {
            return preloadService.preloadFonts();
        });
    };
}

@NgModule({
    declarations: [
        AppComponent,
        TestNgRxComponent,
        TestJasmineComponent,
        TestTailwindUiComponent,
        TestPlaywrightComponent,
        CanvasComponent,
        ToolsMenuComponent,
        BoundingBoxComponent,
        ContextMenuComponent,
        GlobalContextMenuComponent,
        ElementHeaderBarComponent,
        GlobalTooltipComponent,
        GlobalTooltipDirective,
        HandleStickyNoteSubmenuComponent,
        HandleShapeSubmenuComponent,
        SubmenuContainerComponent,
        HandleConnectionLineSubmenuComponent,
        HandleDrawingSubmenuComponent,
        HandleUploadSubmenuComponent,
        HandleFrameSubmenuComponent,
        HandleTemplatesSubmenuComponent,
        HandleMoreSubmenuComponent,
        SvgImageDirective,
        FontSizeComponent,
        FontSelectionComponent,
        TextChangesComponent,
        TextColorsComponent,
        BoxColorsComponent,
        SwitchTypeComponent
    ],
    imports: [
        BrowserModule,
        SweetAlert2Module.forRoot(),
        ToastrModule.forRoot(),
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        CoreModule,
        EditorModule,
        SharedModule,
        DetailModule,
        AppRoutingModule,
        NgxTippyModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: httpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        StoreModule.forRoot<AppState>({ messageState: messageReducer })
    ],
    providers: [
        InputConfigStartupService,
        GlobalTooltipService,
        SVGLoaderService,
        PreloadService,
        {
            provide: APP_INITIALIZER,
            useFactory: initializeApp,
            deps: [SVGLoaderService, PreloadService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        // eslint-disable-next-line no-unused-vars
        private domSanitizer: DomSanitizer
    ) {}
}
