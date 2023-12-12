import { fabric } from 'fabric';
import { debounce } from 'lodash'; // Assuming lodash is available for debouncing
import {
    _renderStrikethrough,
    _renderUnderline,
    _recalculateDimensions
} from './i-text/text-render-utils';

export class CustomFabricIText extends fabric.IText {
    manual: boolean;
    id: string;
    mode: string;
    color: string;
    syncExclude: boolean;
    constrained: boolean;
    originalState: { left: number; top: number };

    constructor(
        text: string,
        options?: fabric.ITextOptions & {
            fontFamily?: string;
            mode?: string;
            color?: string;
            syncExclude?: boolean;
            constrained?: boolean;
        }
    ) {
        super(text, {
            fontFamily: options?.fontFamily || 'Source Sans Pro',
            ...options,
            selectable: true,
            evented: true,
            opacity: 1
        });

        this.manual = false;
        this.id = Math.random().toString(36).substring(2);
        this.mode = options?.mode || '';
        this.color = options?.color || '';
        this.syncExclude = options?.syncExclude || false;
        this.constrained = options?.constrained || false;
        this.originalState = { left: 0, top: 0 };

        this.setControlsVisibility({
            mt: false, // middle top disable
            mb: false, // middle bottom disable
            ml: false, // middle left disable
            mr: false // middle right disable
        });

        this.on('added', () => {
            _recalculateDimensions(this);
        });

        this._debouncedUpdateAndRender = debounce(this._updateAndRender, 100); // Debounce with 100ms delay
    }

    // Make sure to call this._renderStrikethrough(ctx) in the _render method
    _render(ctx: CanvasRenderingContext2D): void {
        // First, turn off the linethrough and underline properties temporarily
        const originalLinethrough = this.linethrough;
        const originalUnderline = this.underline;
        this.linethrough = false;
        this.underline = false;

        // Call the parent class's _render method
        super._render(ctx);

        // Restore the linethrough and underline properties
        this.linethrough = originalLinethrough;
        this.underline = originalUnderline;

        // Now manually render the underline and strikethrough
        _renderUnderline(this, ctx);
        _renderStrikethrough(this, ctx);
    }

    toggleBold(): void {
        this.set('fontWeight', this.fontWeight === 'bold' ? 'normal' : 'bold');
        this._debouncedUpdateAndRender();
    }

    toggleItalic(): void {
        this.set('fontStyle', this.fontStyle === 'italic' ? 'normal' : 'italic');
        this._debouncedUpdateAndRender();
    }

    toggleUnderline(): void {
        this.set('underline', !this.underline);
        this._debouncedUpdateAndRender();
    }

    toggleStrikethrough(): void {
        this.set('linethrough', !this.linethrough);
        this._debouncedUpdateAndRender();
    }

    changeFontFamily(fontFamily: string): void {
        this.set('fontFamily', fontFamily);
        this._debouncedUpdateAndRender();
    }

    changeFontSize(fontSize: number): void {
        this.set('fontSize', fontSize);
        this._debouncedUpdateAndRender();
    }

    _updateAndRender(): void {
        // Removed the cast to CanvasRenderingContext2D as it's not needed
        if (this.canvas) {
            _recalculateDimensions(this); // Call without arguments
        }
        this.canvas?.requestRenderAll();
    }

    // Ensure that _recalculateDimensions method does not

    // Debounced version of _updateAndRender
    private _debouncedUpdateAndRender: () => void;
}
