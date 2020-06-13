function appendScript(desc) {
    return document.head.appendChild(
        Object.assign(
            document.createElement("script"),
            desc));
}

function appendImports(imports) {
    return appendScript({
        type: "systemjs-importmap",
        textContent: JSON.stringify({ imports }),
    });
}

function minjs(name) {
    return name + (env.debug ? "" : ".min") + ".js";
}

const urlParams = new URLSearchParams(window.location.search);
window.env = window.env || {};
if (urlParams.has("local")) { env.local = true; }
if (urlParams.has("dev")) { env.dev = true; }
if (urlParams.has("debug")) { env.debug = true; }

if (!env.dev) {
    // Global site tag (gtag.js) - Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'UA-116161563-1');
    appendScript({ src: "https://www.googletagmanager.com/gtag/js?id=UA-116161563-1" });
}

const rxjsRoot = env.local
    ? "../node_modules/rxjs/dist/bundles/"
    : "https://cdnjs.cloudflare.com/ajax/libs/rxjs/7.0.0-beta.0/";

appendImports({
    "rxjs": rxjsRoot + minjs("rxjs.umd"),
});

const systemjsRoot = env.local
    ? "../node_modules/systemjs/dist/"
    : "https://cdnjs.cloudflare.com/ajax/libs/systemjs/6.3.2/";

appendScript({ defer: true, async: false,
    src: systemjsRoot + minjs("s"),
});
appendScript({ defer: true, async: false,
    src: systemjsRoot + minjs("extras/named-register"),
});
appendScript({ defer: true, async: false,
    src: systemjsRoot + minjs("extras/amd"),
});

appendScript({ defer: true, async: false,
    src: "./app.js",
});

window.addEventListener("load", async () => {
    await System.import("main");
});
