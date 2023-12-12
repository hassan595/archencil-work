import { VisualConfig } from '../types/basic';

export class VisualConfigGenerator {
    public static getConfig(variable: any): VisualConfig {
        let boxShadowValue: string;
        let zIndex: number;

        if (variable === 'tools-menu') {
            boxShadowValue = '0px 0px 20px rgba(0, 0, 0, 0.19), 0px 0px 10px rgba(0, 0, 0, 0.23)';
            zIndex = 21;
        } else if (variable === 'minimap') {
            boxShadowValue = '0px 0px 20px rgba(0, 0, 0, 0.19), 0px 0px 10px rgba(0, 0, 0, 0.23)';
            zIndex = 22;
        } else {
            boxShadowValue = '0px 0px 20px rgba(0, 0, 0, 0.19), 0px 0px 10px rgba(0, 0, 0, 0.23)';
            zIndex = 20;
        }

        return {
            boxShadowValue: boxShadowValue,
            zIndex: zIndex
        };
    }
}
