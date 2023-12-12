import { APP_CONFIG } from './../../../../../../environments/environment';
import { AfterViewInit, Component, OnInit, ElementRef, Renderer2, Input, ViewChild } from '@angular/core';
import { SVGLoaderService } from '~components/services/images/SVGLoader.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CanvasManagerService } from '~components/canvas/services/canvas-manager.service';
import { fabric } from 'fabric';
import { GlobalsService } from '~components/services/globals.service';
import Swal from 'sweetalert2';
import { SvgFile } from '~components/services/images/svg-file.interface';
import { CustomFabricImage } from '~src/app/components/canvas/services/wrappers/derived/custom-fabric-image.part';

@Component({
    selector: 'app-handle-upload-submenu',
    templateUrl: './handle-upload-submenu.component.html',
    styleUrls: ['./handle-upload-submenu.component.scss']
})
export class HandleUploadSubmenuComponent implements OnInit, AfterViewInit {
    svgFiles: SvgFile[] = [];
    @Input() currentIndex!: number;
    @Input() positionY!: number;
    @Input() toolsMenuHeight!: number;
    @ViewChild('filePicker') filePickerRef!: ElementRef;

    // eslint-disable-next-line no-unused-vars
    constructor(
        // eslint-disable-next-line no-unused-vars
        private svgLoader: SVGLoaderService,
        // eslint-disable-next-line no-unused-vars
        private sanitizer: DomSanitizer,
        // eslint-disable-next-line no-unused-vars
        private canvasManagerService: CanvasManagerService,
        // eslint-disable-next-line no-unused-vars
        private renderer: Renderer2,
        // eslint-disable-next-line no-unused-vars
        private elementRef: ElementRef,
        // eslint-disable-next-line no-unused-vars
        private globalsService: GlobalsService
    ) {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngOnInit(): void {}

    // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
    ngAfterViewInit(): void {
        this.verticallyCentralize();

        this.filePickerRef.nativeElement.onchange = (event: Event) => {
            if (!CanvasManagerService.canvas) {
                console.error('No canvas');
                return;
            }

            const target = event.target as HTMLInputElement;
            if (target && target.files && target.files.length > 0) {
                const file = target.files[0];

                const reader = new FileReader();

                reader.onload = () => {
                    // Load image
                    const img = new Image();
                    img.src = reader.result as string;
                    img.onload = () => {
                        // Create CustomFabricImage instance
                        const fabricImg = new CustomFabricImage(img);

                        // Call the method to add the entity to the canvas and resize it
                        this.canvasManagerService.addEntityToCanvas(fabricImg, img.width, img.height);
                    };
                };

                reader.readAsDataURL(file);
            }
        };
    }

    changingThisToTrustedResourceUrl(url: SafeResourceUrl) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url as string);
    }

    insertShape(name: string) {
        const url = './assets/icons/svg/tools-menu-shapes/' + name + '.svg';

        fabric.loadSVGFromURL(url, (objects, options) => {
            const svgObject = fabric.util.groupSVGElements(objects, options);

            svgObject.set({
                left: 100,
                top: 100,
                fill: 'blue'
            });

            if (svgObject) {
                if (CanvasManagerService.canvas) {
                    CanvasManagerService.canvas.add(svgObject);
                    CanvasManagerService.canvas.renderAll();
                }
            } else {
                console.error('No shape.');
            }
        });
    }

    onSvgClick(svgName: string): void {
        console.log(`Clicked on SVG: ${svgName}`);

        switch (svgName) {
            case 'my_device':
                if (this.globalsService.getGlobal('isElectron')) {
                    this.openFileExplorer();
                } else {
                    this.openFilePicker();
                }
                break;
            case 'link':
                Swal.fire({
                    title: 'Link',
                    input: 'text',
                    inputPlaceholder: 'Enter image URL',
                    showCancelButton: true,
                    confirmButtonText: 'Ok',
                    cancelButtonText: 'Cancel',
                    reverseButtons: false, // Show cancel on right
                    preConfirm: this.autoAddHttpToUrl,
                    didOpen: () => {
                        const confirmButton = Swal.getConfirmButton();
                        const input = Swal.getInput();
                        if (confirmButton && input) {
                            confirmButton.disabled = true;
                            input.addEventListener('input', () => {
                                confirmButton.disabled = true;
                                let errorMsg = this.validateUrl(input.value);
                                if (errorMsg) {
                                    Swal.showValidationMessage(errorMsg);
                                    input.classList.add('swal2-input-error');
                                } else {
                                    this.checkImageUrl(input.value).then((isValid) => {
                                        if (!isValid) {
                                            Swal.showValidationMessage('Not an image URL');
                                            input.classList.add('swal2-input-error');
                                        } else {
                                            Swal.resetValidationMessage();
                                            input.classList.remove('swal2-input-error');
                                            confirmButton.disabled = false;
                                        }
                                    });
                                }
                            });
                        }
                    },
                    customClass: {
                        title: 'swal-title-left',
                        actions: 'swal-actions-left'
                    }
                }).then((result) => {
                    if (result.value) {
                        const url = result.value;
                        const img = new Image();
                        img.src = url;
                        img.onload = () => {
                            // Create CustomFabricImage instance
                            const fabricImg = new CustomFabricImage(img);

                            this.canvasManagerService.addEntityToCanvas(fabricImg, img.width, img.height);
                        };
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // Cancel clicked, do nothing
                    }
                });
                break;

            default:
                console.log(`Shape ${svgName} not supported`);
        }
    }

    validateUrl(value: string): string {
        let url;
        let protocol;

        try {
            url = new URL(value);
            protocol = url.protocol;
        } catch (_) {
            return 'Invalid URL';
        }

        if (protocol !== 'http:' && protocol !== 'https:') {
            return 'URL must start with http:// or https://';
        }

        return 'URL is valid';
    }

    async checkImageUrl(url: string) {
        if (!this.validURL(url)) {
            return false;
        }

        try {
            const response = await fetch(
                `http://${APP_CONFIG.server_js_ip}:${APP_CONFIG.server_js_port}/check-image?url=${url}`
            );
            const data = await response.json();
            return data.exists;
        } catch (error) {
            console.error('Fetch failed', error);
            return false;
        }
    }

    validURL(str: string): boolean {
        let pattern = new RegExp(
            '^(https?:\\/\\/)?' + // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                '(\\#[-a-z\\d_]*)?$',
            'i'
        ); // fragment locator
        return !!pattern.test(str);
    }

    autoAddHttpToUrl(value: string) {
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
            return 'http://' + value;
        } else {
            return value;
        }
    }

    openFilePicker() {
        this.filePickerRef.nativeElement.accept = 'image/jpeg, image/jpg, image/png, image/gif';

        this.filePickerRef.nativeElement.click();
    }

    async openFileExplorer() {
        /*const { dialog } = require('@electron/remote');

        const result = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }]
        });

        if (!result.canceled) {
            const imgPath = result.filePaths[0];

            const img = new Image();
            img.src = imgPath;

            CanvasManagerService.canvas.add(img);
        }*/
    }

    allShapesClicked(): void {
        console.log('All shapes clicked');
    }

    verticallyCentralize() {
        const submenuElement = this.elementRef.nativeElement.querySelector('.submenu');
        if (submenuElement) {
            const optionsMenu = submenuElement.parentElement.parentElement;
            const submenuHeight = optionsMenu.offsetHeight;
            //console.log('Offset Height:', submenuHeight);

            if (this.positionY !== undefined) {
                const offset = 0;
                const verticalPos = this.positionY + submenuHeight / 2 - this.toolsMenuHeight / 2 + offset;
                //const verticalPos = elementHeight;
                //console.log('this.positionY', this.positionY);

                this.renderer.setStyle(optionsMenu, 'top', `${verticalPos}px`);
                //this.renderer.setStyle(optionsMenu, 'transform', `translateY(0)`);
                //console.log('toolsMenuHeight', this.toolsMenuHeight);
            }
        } else {
            console.error('nothing found');
        }
    }
}
