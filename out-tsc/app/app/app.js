import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as i0 from "@angular/core";
export class App {
    static ɵfac = function App_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || App)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: App, selectors: [["app-root"]], decls: 2, vars: 0, consts: [[1, "app-shell"]], template: function App_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "main", 0);
            i0.ɵɵelement(1, "router-outlet");
            i0.ɵɵelementEnd();
        } }, dependencies: [RouterOutlet], styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-height: 100vh;\n}\n\n.app-shell[_ngcontent-%COMP%] {\n  min-height: 100vh;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(App, [{
        type: Component,
        args: [{ selector: 'app-root', imports: [RouterOutlet], template: "<main class=\"app-shell\">\n  <router-outlet></router-outlet>\n</main>\n", styles: [":host {\n  display: block;\n  min-height: 100vh;\n}\n\n.app-shell {\n  min-height: 100vh;\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 10 }); })();
