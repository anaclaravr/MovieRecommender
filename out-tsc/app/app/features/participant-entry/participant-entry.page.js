import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ParticipantSessionService } from '../../core/services/participant-session.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
export class ParticipantEntryPage {
    router = inject(Router);
    participantSessionService = inject(ParticipantSessionService);
    name = this.participantSessionService.session().name;
    email = this.participantSessionService.session().email ?? '';
    get canContinue() {
        return this.name.trim().length > 0;
    }
    submit() {
        if (!this.canContinue) {
            return;
        }
        this.participantSessionService.setParticipant(this.name, this.email);
        void this.router.navigate(['/movie-selection']);
    }
    static ɵfac = function ParticipantEntryPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ParticipantEntryPage)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ParticipantEntryPage, selectors: [["app-participant-entry-page"]], decls: 22, vars: 3, consts: [[1, "page-shell"], [1, "page-panel", "glass-surface"], [1, "page-kicker"], [1, "lead"], [1, "entry-form", 3, "ngSubmit"], [1, "field"], ["type", "text", "name", "name", "placeholder", "Enter participant name", "required", "", 3, "ngModelChange", "ngModel"], ["type", "email", "name", "email", "placeholder", "name@example.com", 3, "ngModelChange", "ngModel"], [1, "helper-text"], [1, "page-actions"], ["type", "submit", 1, "action-button", 3, "disabled"]], template: function ParticipantEntryPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "section", 0)(1, "div", 1)(2, "span", 2);
            i0.ɵɵtext(3, "Step 1 of 4");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "h1");
            i0.ɵɵtext(5, "Participant entry");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(6, "p", 3);
            i0.ɵɵtext(7, " Capture the participant identity first so the later recommendation flow can stay attached to a single mocked session. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "form", 4);
            i0.ɵɵlistener("ngSubmit", function ParticipantEntryPage_Template_form_ngSubmit_8_listener() { return ctx.submit(); });
            i0.ɵɵelementStart(9, "label", 5)(10, "span");
            i0.ɵɵtext(11, "Name *");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "input", 6);
            i0.ɵɵtwoWayListener("ngModelChange", function ParticipantEntryPage_Template_input_ngModelChange_12_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.name, $event) || (ctx.name = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(13, "label", 5)(14, "span");
            i0.ɵɵtext(15, "Email (optional)");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(16, "input", 7);
            i0.ɵɵtwoWayListener("ngModelChange", function ParticipantEntryPage_Template_input_ngModelChange_16_listener($event) { i0.ɵɵtwoWayBindingSet(ctx.email, $event) || (ctx.email = $event); return $event; });
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(17, "p", 8);
            i0.ɵɵtext(18, " The continue action stays disabled until the participant name is filled. ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(19, "div", 9)(20, "button", 10);
            i0.ɵɵtext(21, " Continue to movie selection ");
            i0.ɵɵelementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(12);
            i0.ɵɵtwoWayProperty("ngModel", ctx.name);
            i0.ɵɵadvance(4);
            i0.ɵɵtwoWayProperty("ngModel", ctx.email);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", !ctx.canContinue);
        } }, dependencies: [FormsModule, i1.ɵNgNoValidate, i1.DefaultValueAccessor, i1.NgControlStatus, i1.NgControlStatusGroup, i1.RequiredValidator, i1.NgModel, i1.NgForm], styles: [".lead[_ngcontent-%COMP%], \n.helper-text[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--color-text-muted);\n}\n\n.entry-form[_ngcontent-%COMP%] {\n  display: grid;\n  gap: var(--space-5);\n  margin-top: var(--space-6);\n}\n\n.field[_ngcontent-%COMP%] {\n  display: grid;\n  gap: var(--space-2);\n}\n\n.field[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-weight: 600;\n}\n\n.field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 0.95rem 1rem;\n  border: 1px solid var(--color-border);\n  border-radius: var(--radius-2);\n  background: rgba(255, 255, 255, 0.7);\n  color: var(--color-text);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);\n}\n\n.field[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: rgba(15, 76, 92, 0.35);\n  box-shadow:\n    inset 0 1px 0 rgba(255, 255, 255, 0.6),\n    0 0 0 4px rgba(15, 76, 92, 0.08);\n}"] });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ParticipantEntryPage, [{
        type: Component,
        args: [{ selector: 'app-participant-entry-page', imports: [FormsModule], template: "<section class=\"page-shell\">\n  <div class=\"page-panel glass-surface\">\n    <span class=\"page-kicker\">Step 1 of 4</span>\n    <h1>Participant entry</h1>\n    <p class=\"lead\">\n      Capture the participant identity first so the later recommendation flow can\n      stay attached to a single mocked session.\n    </p>\n\n    <form class=\"entry-form\" (ngSubmit)=\"submit()\">\n      <label class=\"field\">\n        <span>Name *</span>\n        <input\n          type=\"text\"\n          name=\"name\"\n          [(ngModel)]=\"name\"\n          placeholder=\"Enter participant name\"\n          required\n        />\n      </label>\n\n      <label class=\"field\">\n        <span>Email (optional)</span>\n        <input\n          type=\"email\"\n          name=\"email\"\n          [(ngModel)]=\"email\"\n          placeholder=\"name@example.com\"\n        />\n      </label>\n\n      <p class=\"helper-text\">\n        The continue action stays disabled until the participant name is filled.\n      </p>\n\n      <div class=\"page-actions\">\n        <button class=\"action-button\" type=\"submit\" [disabled]=\"!canContinue\">\n          Continue to movie selection\n        </button>\n      </div>\n    </form>\n  </div>\n</section>\n", styles: [".lead,\n.helper-text {\n  margin: 0;\n  color: var(--color-text-muted);\n}\n\n.entry-form {\n  display: grid;\n  gap: var(--space-5);\n  margin-top: var(--space-6);\n}\n\n.field {\n  display: grid;\n  gap: var(--space-2);\n}\n\n.field span {\n  font-weight: 600;\n}\n\n.field input {\n  width: 100%;\n  padding: 0.95rem 1rem;\n  border: 1px solid var(--color-border);\n  border-radius: var(--radius-2);\n  background: rgba(255, 255, 255, 0.7);\n  color: var(--color-text);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);\n}\n\n.field input:focus {\n  outline: none;\n  border-color: rgba(15, 76, 92, 0.35);\n  box-shadow:\n    inset 0 1px 0 rgba(255, 255, 255, 0.6),\n    0 0 0 4px rgba(15, 76, 92, 0.08);\n}\n"] }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ParticipantEntryPage, { className: "ParticipantEntryPage", filePath: "src/app/features/participant-entry/participant-entry.page.ts", lineNumber: 13 }); })();
