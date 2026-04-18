import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ParticipantSessionService } from '../../core/services/participant-session.service';
import * as i0 from "@angular/core";
export class RecommendationsPage {
    participantSessionService = inject(ParticipantSessionService);
    session = this.participantSessionService.session;
    static ɵfac = function RecommendationsPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RecommendationsPage)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RecommendationsPage, selectors: [["app-recommendations-page"]], decls: 16, vars: 3, consts: [[1, "page-shell"], [1, "page-panel", "glass-surface"], [1, "page-kicker"], [1, "lead"], [1, "debug-output"], [1, "page-actions"], ["routerLink", "/loading", 1, "action-button", "action-button--secondary"]], template: function RecommendationsPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "div", 1)(2, "span", 2);
            i0.ɵɵtext(3, "Step 4 of 4");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "h1");
            i0.ɵɵtext(5, "Recommendations");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "p", 3);
            i0.ɵɵtext(7, " This screen is still a shell. For now it exposes the current participant session so the next UI phase can build on a stable routed foundation. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "h2");
            i0.ɵɵtext(9, "Current mocked session");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "pre", 4);
            i0.ɵɵtext(11);
            i0.ɵɵpipe(12, "json");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(13, "div", 5)(14, "a", 6);
            i0.ɵɵtext(15, " Back ");
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(11);
            i0.ɵɵtextInterpolate(i0.ɵɵpipeBind1(12, 1, ctx.session()));
        } }, dependencies: [RouterLink, JsonPipe], styles: [".lead[_ngcontent-%COMP%] {\n  margin: 0 0 var(--space-6);\n  color: var(--color-text-muted);\n}\n\nh2[_ngcontent-%COMP%] {\n  margin: 0 0 var(--space-3);\n  font-size: 1rem;\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RecommendationsPage, [{
        type: Component,
        args: [{ selector: 'app-recommendations-page', imports: [JsonPipe, RouterLink], template: "<section class=\"page-shell\">\n  <div class=\"page-panel glass-surface\">\n    <span class=\"page-kicker\">Step 4 of 4</span>\n    <h1>Recommendations</h1>\n    <p class=\"lead\">\n      This screen is still a shell. For now it exposes the current participant\n      session so the next UI phase can build on a stable routed foundation.\n    </p>\n\n    <h2>Current mocked session</h2>\n    <pre class=\"debug-output\">{{ session() | json }}</pre>\n\n    <div class=\"page-actions\">\n      <a class=\"action-button action-button--secondary\" routerLink=\"/loading\">\n        Back\n      </a>\n    </div>\n  </div>\n</section>\n", styles: [".lead {\n  margin: 0 0 var(--space-6);\n  color: var(--color-text-muted);\n}\n\nh2 {\n  margin: 0 0 var(--space-3);\n  font-size: 1rem;\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RecommendationsPage, { className: "RecommendationsPage", filePath: "src/app/features/recommendations/recommendations.page.ts", lineNumber: 13 }); })();
