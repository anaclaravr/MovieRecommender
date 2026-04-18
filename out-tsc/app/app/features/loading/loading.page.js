import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import * as i0 from "@angular/core";
export class LoadingPage {
    static ɵfac = function LoadingPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LoadingPage)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LoadingPage, selectors: [["app-loading-page"]], decls: 13, vars: 0, consts: [[1, "page-shell"], [1, "page-panel", "glass-surface", "loading-panel"], [1, "page-kicker"], [1, "page-actions"], ["routerLink", "/movie-selection", 1, "action-button", "action-button--secondary"], ["routerLink", "/recommendations", 1, "action-button"]], template: function LoadingPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "div", 1)(2, "span", 2);
            i0.ɵɵtext(3, "Step 3 of 4");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "h1");
            i0.ɵɵtext(5, "Loading");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "p");
            i0.ɵɵtext(7, " This is a placeholder transition step for the mocked flow. No timers, no backend requests, and no recommendation generation logic are running yet. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "div", 3)(9, "a", 4);
            i0.ɵɵtext(10, " Back ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(11, "a", 5);
            i0.ɵɵtext(12, " Continue to recommendations ");
            i0.ɵɵelementEnd()()()();
        } }, dependencies: [RouterLink], styles: [".loading-panel[_ngcontent-%COMP%] {\n  text-align: center;\n}\n\np[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--color-text-muted);\n}\n\n.page-actions[_ngcontent-%COMP%] {\n  justify-content: center;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LoadingPage, [{
        type: Component,
        args: [{ selector: 'app-loading-page', imports: [RouterLink], template: "<section class=\"page-shell\">\n  <div class=\"page-panel glass-surface loading-panel\">\n    <span class=\"page-kicker\">Step 3 of 4</span>\n    <h1>Loading</h1>\n    <p>\n      This is a placeholder transition step for the mocked flow. No timers,\n      no backend requests, and no recommendation generation logic are running yet.\n    </p>\n\n    <div class=\"page-actions\">\n      <a class=\"action-button action-button--secondary\" routerLink=\"/movie-selection\">\n        Back\n      </a>\n      <a class=\"action-button\" routerLink=\"/recommendations\">\n        Continue to recommendations\n      </a>\n    </div>\n  </div>\n</section>\n", styles: [".loading-panel {\n  text-align: center;\n}\n\np {\n  margin: 0;\n  color: var(--color-text-muted);\n}\n\n.page-actions {\n  justify-content: center;\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LoadingPage, { className: "LoadingPage", filePath: "src/app/features/loading/loading.page.ts", lineNumber: 10 }); })();
