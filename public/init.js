const imports = {
    "rxjs": "./dist/bundles/rxjs.umd.js",
    "park-miller": "./index.js",
};

(async () => {
    function appendScript(desc) {
        return document.head.appendChild(
            Object.assign(
                document.createElement("script"),
                desc));
    }

    const urlParams = new URLSearchParams(window.location.search);
    window.env = window.env || {};
    if (urlParams.has("local")) { env.local = true; }
    if (urlParams.has("dev")) { env.dev = true; }
    if (urlParams.has("debug")) { env.debug = true; }
    if (urlParams.has("skipga")) { env.skipga = true; } 

    const jspm = JSON.parse( await (await fetch("../jspm.json")).text());

    function getJspmRoot(module) {
        return env.local
            ? ("../jspm_packages/" + jspm.resolve[module].replace(":", "/") + "/")
            : ("https://dev.jspm.io/" + jspm.resolve[module] + "/");
    }

    function getUnpkgRoot(module) {
        return env.local
            ? ("../jspm_packages/" + jspm.resolve[module].replace(":", "/") + "/")
            : ("https://unpkg.com/" + jspm.resolve[module].replace("npm:", "") + "/");
    }

    if (!env.skipga) {
        // Global site tag (gtag.js) - Google Analytics
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'UA-116161563-1');
        appendScript({ src: "https://www.googletagmanager.com/gtag/js?id=UA-116161563-1" });
    }

    for (const module of Object.keys(imports)) {
        imports[module] = getJspmRoot(module) + imports[module];
    }
    appendScript({
        type: "importmap-shim",
        textContent: JSON.stringify({ imports }),
    });

    appendScript({
        src: getUnpkgRoot("es-module-shims") + "./dist/es-module-shims.min.js"
    });
})();