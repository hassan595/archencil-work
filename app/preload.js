const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setBasePath: (basePath) => {
        // This function can be safely called from the renderer process to set the base path.
        const base = document.createElement('base');
        base.href = basePath;
        document.head.prepend(base);
    }
});
