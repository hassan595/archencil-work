const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const dotenv = require('dotenv');

module.exports = (config, options) => {
    config.target = 'electron-renderer';

    if (options.fileReplacements) {
        for (let fileReplacement of options.fileReplacements) {
            if (fileReplacement.replace !== 'src/environments/environment.ts') {
                continue;
            }

            let fileReplacementParts = fileReplacement['with'].split('.');
            if (fileReplacementParts.length > 1 && ['web'].indexOf(fileReplacementParts[1]) >= 0) {
                config.target = 'web';
            }
            break;
        }
    }

    config.plugins = [
        ...config.plugins,
        new NodePolyfillPlugin({
            excludeAliases: ['console']
        })
    ];

    // Load environment variables
    const env = dotenv.config().parsed;

    // Define base path
    //console.log('env.BASE_PATH', env.BASE_PATH);
    const prepend_font = config.target === 'electron-renderer' ? env.BASE_PATH : '';

    config.module.rules.push({
        test: /\.scss$/,
        use: [
            {
                loader: 'sass-loader',
                options: {
                    additionalData: `$prepend_font: "${prepend_font}";`
                }
            }
        ]
    });

    config.output.globalObject = 'globalThis';

    return config;
};
