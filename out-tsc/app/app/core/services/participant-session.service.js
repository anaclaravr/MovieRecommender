import { Injectable, signal } from '@angular/core';
import * as i0 from "@angular/core";
function createInitialSession() {
    return {
        name: '',
        email: undefined,
        selectedSeedMovieIds: [],
        variant: 'neutral'
    };
}
export class ParticipantSessionService {
    sessionState = signal(createInitialSession(), ...(ngDevMode ? [{ debugName: "sessionState" }] : /* istanbul ignore next */ []));
    session = this.sessionState.asReadonly();
    setParticipant(name, email) {
        const trimmedName = name.trim();
        const trimmedEmail = email?.trim();
        this.sessionState.update((session) => ({
            ...session,
            name: trimmedName,
            email: trimmedEmail ? trimmedEmail : undefined
        }));
    }
    setSelectedSeedMovieIds(ids) {
        this.sessionState.update((session) => ({
            ...session,
            selectedSeedMovieIds: [...ids]
        }));
    }
    setVariant(variant) {
        this.sessionState.update((session) => ({
            ...session,
            variant
        }));
    }
    reset() {
        this.sessionState.set(createInitialSession());
    }
    static ɵfac = function ParticipantSessionService_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ParticipantSessionService)(); };
    static ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: ParticipantSessionService, factory: ParticipantSessionService.ɵfac, providedIn: 'root' });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ParticipantSessionService, [{
        type: Injectable,
        args: [{ providedIn: 'root' }]
    }], null, null); })();
