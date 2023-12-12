import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';
import { SVGLoaderService } from '~components/services/images/SVGLoader.service';

@Directive({
    selector: '[appSvgImage]'
})
export class SvgImageDirective implements OnInit {
    @Input() svgName!: string; // definite assignment assertion
    @Input() svgWidth!: string; // definite assignment assertion
    @Input() svgHeight!: string; // definite assignment assertion
    @Input() svgLabel!: string; // definite assignment assertion

    constructor(
        // eslint-disable-next-line no-unused-vars
        private el: ElementRef,
        // eslint-disable-next-line no-unused-vars
        private renderer: Renderer2,
        // eslint-disable-next-line no-unused-vars
        private svgLoaderService: SVGLoaderService
    ) {}

    ngOnInit(): void {
        this.svgLoaderService
            .getSVGFiles([{ name: this.svgName, width: this.svgWidth, height: this.svgHeight, label: this.svgLabel }])
            .subscribe((results) => {
                //console.log('results', results);
                const svgFile = results[0];
                this.renderer.setProperty(this.el.nativeElement, 'src', svgFile.path);
                this.renderer.setAttribute(this.el.nativeElement, 'width', svgFile.width);
                this.renderer.setAttribute(this.el.nativeElement, 'height', svgFile.height);
                this.renderer.setAttribute(this.el.nativeElement, 'alt', svgFile.label);
            });
    }
}
