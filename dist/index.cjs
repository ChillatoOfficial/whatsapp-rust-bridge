// dist/index.cjs - wrapper CJS per il bridge
let _bridge = null;
async function getBridge() {
    if (!_bridge) {
        _bridge = await import('./index.js');
    }
    return _bridge;
}

// Proxy che aspetta il bridge
module.exports = new Proxy({}, {
    get(_, prop) {
        return (...args) => getBridge().then(m => {
            const fn = m[prop] ?? m.default?.[prop];
            if (typeof fn === 'function') return fn(...args);
            return fn;
        });
    }
});

// Per Baileys serve anche l'init sync
module.exports.initSync = (...args) => getBridge().then(m => m.initSync?.(...args) ?? m.default?.initSync?.(...args));