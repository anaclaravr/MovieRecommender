import { ChangeDetectionStrategy, Component, HostListener, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MOCK_MOVIES } from '../../core/mock-data/movies.mock';
import { ParticipantSessionService } from '../../core/services/participant-session.service';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.id;
const _forTrack1 = ($index, $item) => $item.movie.id;
function MovieSelectionPage_For_9_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElement(0, "i", 34);
} }
function MovieSelectionPage_For_9_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "span");
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const step_r1 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(step_r1);
} }
function MovieSelectionPage_For_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 33);
    i0.ɵɵconditionalCreate(1, MovieSelectionPage_For_9_Conditional_1_Template, 1, 0, "i", 34)(2, MovieSelectionPage_For_9_Conditional_2_Template, 2, 1, "span");
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const step_r1 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("is-complete", step_r1 <= ctx_r1.selectedCount());
    i0.ɵɵadvance();
    i0.ɵɵconditional(step_r1 <= ctx_r1.selectedCount() ? 1 : 2);
} }
function MovieSelectionPage_For_19_Template(rf, ctx) { if (rf & 1) {
    const _r3 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "button", 35);
    i0.ɵɵdomListener("click", function MovieSelectionPage_For_19_Template_button_click_0_listener() { const genre_r4 = i0.ɵɵrestoreView(_r3).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.selectGenre(genre_r4.id)); });
    i0.ɵɵdomElement(1, "span", 36);
    i0.ɵɵdomElementStart(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const genre_r4 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("is-selected", ctx_r1.isGenreActive(genre_r4.id));
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(genre_r4.label);
} }
function MovieSelectionPage_Conditional_23_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 17)(1, "h2");
    i0.ɵɵtext(2, "Nenhum resultado encontrado");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "p");
    i0.ɵɵtext(4);
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(ctx_r1.emptyStateMessage());
} }
function MovieSelectionPage_Conditional_24_For_1_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "span", 43);
    i0.ɵɵdomElement(1, "i", 50);
    i0.ɵɵdomElementEnd();
} }
function MovieSelectionPage_Conditional_24_For_1_Conditional_20_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 51);
    i0.ɵɵdomListener("click", function MovieSelectionPage_Conditional_24_For_1_Conditional_20_Template_div_click_0_listener($event) { return $event.stopPropagation(); });
    i0.ɵɵdomElementStart(1, "span", 48);
    i0.ɵɵtext(2, "Sinopse");
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "p", 52);
    i0.ɵɵtext(4);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(5, "p", 53);
    i0.ɵɵtext(6);
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const card_r6 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(card_r6.genresLabel);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r6.movie.synopsis);
} }
function MovieSelectionPage_Conditional_24_For_1_Template(rf, ctx) { if (rf & 1) {
    const _r5 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "article", 38);
    i0.ɵɵdomListener("click", function MovieSelectionPage_Conditional_24_For_1_Template_article_click_0_listener($event) { const card_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleMovieSelection(card_r6.movie.id, $event)); })("keydown", function MovieSelectionPage_Conditional_24_For_1_Template_article_keydown_0_listener($event) { const card_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.onCardKeydown($event, card_r6.movie.id)); });
    i0.ɵɵdomElementStart(1, "div", 39)(2, "button", 40);
    i0.ɵɵdomListener("click", function MovieSelectionPage_Conditional_24_For_1_Template_button_click_2_listener($event) { const card_r6 = i0.ɵɵrestoreView(_r5).$implicit; const ctx_r1 = i0.ɵɵnextContext(2); return i0.ɵɵresetView(ctx_r1.toggleMovieDetails(card_r6.movie.id, $event)); });
    i0.ɵɵdomElementStart(3, "span", 41);
    i0.ɵɵdomElement(4, "i", 42);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(5, "span", 23);
    i0.ɵɵtext(6, "Ver detalhes");
    i0.ɵɵdomElementEnd()();
    i0.ɵɵconditionalCreate(7, MovieSelectionPage_Conditional_24_For_1_Conditional_7_Template, 2, 0, "span", 43);
    i0.ɵɵdomElementStart(8, "div", 44)(9, "span", 45);
    i0.ɵɵtext(10);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(11, "span", 46);
    i0.ɵɵtext(12);
    i0.ɵɵdomElementEnd()()();
    i0.ɵɵdomElementStart(13, "div", 47)(14, "span", 48);
    i0.ɵɵtext(15);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(16, "h2");
    i0.ɵɵtext(17);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(18, "p");
    i0.ɵɵtext(19);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵconditionalCreate(20, MovieSelectionPage_Conditional_24_For_1_Conditional_20_Template, 7, 2, "div", 49);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const card_r6 = ctx.$implicit;
    const ctx_r1 = i0.ɵɵnextContext(2);
    i0.ɵɵclassProp("is-selected", ctx_r1.isMovieSelected(card_r6.movie.id))("is-selection-blocked", ctx_r1.isSelectionBlocked(card_r6.movie.id))("is-details-expanded", ctx_r1.isDetailsExpanded(card_r6.movie.id));
    i0.ɵɵattribute("aria-pressed", ctx_r1.isMovieSelected(card_r6.movie.id))("aria-disabled", ctx_r1.isSelectionBlocked(card_r6.movie.id));
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("--poster-gradient", card_r6.posterGradient)("--poster-image", card_r6.posterImage);
    i0.ɵɵadvance();
    i0.ɵɵclassProp("poster-card-shell__details-pill--on-light", card_r6.detailsContrast === "light")("poster-card-shell__details-pill--on-dark", card_r6.detailsContrast === "dark");
    i0.ɵɵadvance(5);
    i0.ɵɵconditional(ctx_r1.isMovieSelected(card_r6.movie.id) ? 7 : -1);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(card_r6.movie.year);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r6.movie.title);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(card_r6.movie.year);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r6.movie.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r6.genresLabel);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r1.isDetailsExpanded(card_r6.movie.id) ? 20 : -1);
} }
function MovieSelectionPage_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵrepeaterCreate(0, MovieSelectionPage_Conditional_24_For_1_Template, 21, 23, "article", 37, _forTrack1);
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵrepeater(ctx_r1.filteredCards());
} }
function MovieSelectionPage_Conditional_25_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 18);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r1.selectionLimitHint, " ");
} }
function MovieSelectionPage_Conditional_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "span", 26);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r1 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r1.selectedCount());
} }
function MovieSelectionPage_For_46_Template(rf, ctx) { if (rf & 1) {
    const _r7 = i0.ɵɵgetCurrentView();
    i0.ɵɵdomElementStart(0, "article", 32)(1, "div", 54)(2, "span");
    i0.ɵɵtext(3);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(4, "div", 55)(5, "span", 48);
    i0.ɵɵtext(6);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(7, "h3");
    i0.ɵɵtext(8);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(9, "p");
    i0.ɵɵtext(10);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵdomElementStart(11, "button", 56);
    i0.ɵɵdomListener("click", function MovieSelectionPage_For_46_Template_button_click_11_listener($event) { const card_r8 = i0.ɵɵrestoreView(_r7).$implicit; const ctx_r1 = i0.ɵɵnextContext(); return i0.ɵɵresetView(ctx_r1.removeSelectedMovie(card_r8.movie.id, $event)); });
    i0.ɵɵdomElement(12, "i", 30);
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const card_r8 = ctx.$implicit;
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("--poster-gradient", card_r8.posterGradient)("--poster-image", card_r8.posterImage);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r8.movie.title);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(card_r8.movie.year);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r8.movie.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(card_r8.genresLabel);
    i0.ɵɵadvance();
    i0.ɵɵattribute("aria-label", "Remover " + card_r8.movie.title + " da selecao");
} }
const MAX_SELECTED_MOVIES = 5;
const ALL_GENRES_ID = 'all';
const LIGHT_DETAILS_CARD_INDEXES = new Set([1, 6]);
const POSTER_GRADIENTS = [
    'linear-gradient(160deg, #14344f 0%, #325b78 46%, #d2dfeb 100%)',
    'linear-gradient(160deg, #f0e8df 0%, #d4c6b1 48%, #8d6d4f 100%)',
    'linear-gradient(160deg, #451a1d 0%, #b53b2f 48%, #f1a13a 100%)',
    'linear-gradient(160deg, #17193f 0%, #5339ac 48%, #9ea7f0 100%)',
    'linear-gradient(160deg, #5b1016 0%, #a82b1e 44%, #f3c14e 100%)',
    'linear-gradient(160deg, #0f1d33 0%, #204b74 44%, #ff7d32 100%)',
    'linear-gradient(160deg, #b5c1cb 0%, #edf2f5 48%, #7f8f99 100%)',
    'linear-gradient(160deg, #183149 0%, #446c8d 48%, #9ec3de 100%)'
];
const GENRE_LABELS = {
    Action: 'Acao',
    Adventure: 'Aventura',
    Animation: 'Animacao',
    Comedy: 'Comedia',
    Drama: 'Drama',
    Family: 'Familia',
    Horror: 'Terror',
    Mystery: 'Misterio',
    Romance: 'Romance',
    'Science Fiction': 'Ficcao cientifica',
    Thriller: 'Thriller'
};
const SELECTION_LIMIT_HINT = 'Voce ja selecionou 5 filmes. Remova um para escolher outro.';
function getGenreLabel(genre) {
    return GENRE_LABELS[genre] ?? genre;
}
const MOVIE_SELECTION_CARDS = MOCK_MOVIES.map((movie, index) => ({
    movie,
    posterGradient: POSTER_GRADIENTS[index % POSTER_GRADIENTS.length],
    posterImage: `url("${movie.posterUrl}")`,
    detailsContrast: LIGHT_DETAILS_CARD_INDEXES.has(index) ? 'light' : 'dark',
    genresLabel: movie.genres.map((genre) => getGenreLabel(genre)).join(' • ')
}));
const MOVIE_CARD_BY_ID = new Map(MOVIE_SELECTION_CARDS.map((card) => [card.movie.id, card]));
const GENRE_OPTIONS = [
    { id: ALL_GENRES_ID, label: 'Todos' },
    ...Array.from(new Set(MOCK_MOVIES.flatMap((movie) => movie.genres)))
        .sort((left, right) => getGenreLabel(left).localeCompare(getGenreLabel(right)))
        .map((genre) => ({
        id: genre,
        label: getGenreLabel(genre)
    }))
];
function normalizeSelectedMovieIds(ids) {
    return Array.from(new Set(ids))
        .filter((id) => MOVIE_CARD_BY_ID.has(id))
        .slice(0, MAX_SELECTED_MOVIES);
}
function hasSameIds(left, right) {
    return left.length === right.length && left.every((value, index) => value === right[index]);
}
export class MovieSelectionPage {
    participantSessionService = inject(ParticipantSessionService);
    router = inject(Router);
    selectionSteps = [1, 2, 3, 4, 5];
    maxSelectedMovies = MAX_SELECTED_MOVIES;
    genreOptions = GENRE_OPTIONS;
    session = this.participantSessionService.session;
    selectionLimitHint = SELECTION_LIMIT_HINT;
    searchQuery = signal('', ...(ngDevMode ? [{ debugName: "searchQuery" }] : /* istanbul ignore next */ []));
    activeGenreId = signal(ALL_GENRES_ID, ...(ngDevMode ? [{ debugName: "activeGenreId" }] : /* istanbul ignore next */ []));
    expandedMovieId = signal(null, ...(ngDevMode ? [{ debugName: "expandedMovieId" }] : /* istanbul ignore next */ []));
    isDrawerOpen = signal(false, ...(ngDevMode ? [{ debugName: "isDrawerOpen" }] : /* istanbul ignore next */ []));
    showSelectionLimitHint = signal(false, ...(ngDevMode ? [{ debugName: "showSelectionLimitHint" }] : /* istanbul ignore next */ []));
    selectedMovieIds = computed(() => normalizeSelectedMovieIds(this.session().selectedSeedMovieIds), ...(ngDevMode ? [{ debugName: "selectedMovieIds" }] : /* istanbul ignore next */ []));
    selectedMovieIdSet = computed(() => new Set(this.selectedMovieIds()), ...(ngDevMode ? [{ debugName: "selectedMovieIdSet" }] : /* istanbul ignore next */ []));
    selectedCount = computed(() => this.selectedMovieIds().length, ...(ngDevMode ? [{ debugName: "selectedCount" }] : /* istanbul ignore next */ []));
    canContinue = computed(() => this.selectedCount() === this.maxSelectedMovies, ...(ngDevMode ? [{ debugName: "canContinue" }] : /* istanbul ignore next */ []));
    activeGenreLabel = computed(() => this.genreOptions.find((genre) => genre.id === this.activeGenreId())?.label ??
        this.genreOptions[0].label, ...(ngDevMode ? [{ debugName: "activeGenreLabel" }] : /* istanbul ignore next */ []));
    filteredCards = computed(() => {
        const normalizedSearch = this.searchQuery().trim().toLowerCase();
        const activeGenreId = this.activeGenreId();
        return MOVIE_SELECTION_CARDS.filter((card) => {
            const matchesSearch = normalizedSearch
                ? card.movie.title.toLowerCase().includes(normalizedSearch)
                : true;
            const matchesGenre = activeGenreId === ALL_GENRES_ID ? true : card.movie.genres.includes(activeGenreId);
            return matchesSearch && matchesGenre;
        });
    }, ...(ngDevMode ? [{ debugName: "filteredCards" }] : /* istanbul ignore next */ []));
    selectedCards = computed(() => this.selectedMovieIds()
        .map((movieId) => MOVIE_CARD_BY_ID.get(movieId))
        .filter((card) => Boolean(card)), ...(ngDevMode ? [{ debugName: "selectedCards" }] : /* istanbul ignore next */ []));
    hasNoResults = computed(() => this.filteredCards().length === 0, ...(ngDevMode ? [{ debugName: "hasNoResults" }] : /* istanbul ignore next */ []));
    emptyStateMessage = computed(() => {
        const normalizedSearch = this.searchQuery().trim();
        const hasSearch = normalizedSearch.length > 0;
        const hasGenre = this.activeGenreId() !== ALL_GENRES_ID;
        if (hasSearch && hasGenre) {
            return `Nenhum filme encontrado para "${normalizedSearch}" em ${this.activeGenreLabel()}.`;
        }
        if (hasSearch) {
            return `Nenhum filme encontrado para "${normalizedSearch}".`;
        }
        if (hasGenre) {
            return `Nenhum filme encontrado em ${this.activeGenreLabel()}.`;
        }
        return 'Nenhum filme disponivel no momento.';
    }, ...(ngDevMode ? [{ debugName: "emptyStateMessage" }] : /* istanbul ignore next */ []));
    constructor() {
        const normalizedIds = normalizeSelectedMovieIds(this.session().selectedSeedMovieIds);
        if (!hasSameIds(normalizedIds, this.session().selectedSeedMovieIds)) {
            this.participantSessionService.setSelectedSeedMovieIds(normalizedIds);
        }
    }
    handleEscapeKey() {
        if (this.isDrawerOpen()) {
            this.closeDrawer();
            return;
        }
        if (this.expandedMovieId()) {
            this.closeExpandedDetails();
        }
    }
    updateSearchQuery(query) {
        this.searchQuery.set(query);
        this.showSelectionLimitHint.set(false);
    }
    selectGenre(genreId) {
        this.activeGenreId.set(genreId);
        this.showSelectionLimitHint.set(false);
    }
    toggleMovieSelection(movieId, event) {
        event?.preventDefault();
        event?.stopPropagation();
        const selectedMovieIds = this.selectedMovieIds();
        if (selectedMovieIds.includes(movieId)) {
            this.updateSelectedMovieIds(selectedMovieIds.filter((selectedId) => selectedId !== movieId));
            return;
        }
        if (selectedMovieIds.length >= this.maxSelectedMovies) {
            this.showSelectionLimitHint.set(true);
            return;
        }
        this.updateSelectedMovieIds([...selectedMovieIds, movieId]);
    }
    removeSelectedMovie(movieId, event) {
        event?.preventDefault();
        event?.stopPropagation();
        this.updateSelectedMovieIds(this.selectedMovieIds().filter((selectedId) => selectedId !== movieId));
    }
    toggleMovieDetails(movieId, event) {
        event?.preventDefault();
        event?.stopPropagation();
        this.expandedMovieId.update((currentMovieId) => (currentMovieId === movieId ? null : movieId));
    }
    closeExpandedDetails() {
        this.expandedMovieId.set(null);
    }
    openDrawer() {
        this.isDrawerOpen.set(true);
    }
    closeDrawer() {
        this.isDrawerOpen.set(false);
    }
    onCardKeydown(event, movieId) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.toggleMovieSelection(movieId);
        }
    }
    continueToLoading() {
        if (!this.canContinue()) {
            return;
        }
        void this.router.navigateByUrl('/loading');
    }
    isGenreActive(genreId) {
        return this.activeGenreId() === genreId;
    }
    isMovieSelected(movieId) {
        return this.selectedMovieIdSet().has(movieId);
    }
    isSelectionBlocked(movieId) {
        return !this.isMovieSelected(movieId) && this.selectedCount() >= this.maxSelectedMovies;
    }
    isDetailsExpanded(movieId) {
        return this.expandedMovieId() === movieId;
    }
    updateSelectedMovieIds(ids) {
        this.participantSessionService.setSelectedSeedMovieIds(normalizeSelectedMovieIds(ids));
        this.showSelectionLimitHint.set(false);
    }
    static ɵfac = function MovieSelectionPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MovieSelectionPage)(); };
    static ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: MovieSelectionPage, selectors: [["app-movie-selection-page"]], hostBindings: function MovieSelectionPage_HostBindings(rf, ctx) { if (rf & 1) {
            i0.ɵɵlistener("keydown.escape", function MovieSelectionPage_keydown_escape_HostBindingHandler() { return ctx.handleEscapeKey(); }, i0.ɵɵresolveDocument);
        } }, decls: 47, vars: 11, consts: [[1, "page-shell", "movie-selection-preview"], [1, "movie-selection-preview__frame"], [1, "movie-selection-preview__header"], [1, "movie-selection-preview__topbar"], ["aria-label", "Buscar um filme", 1, "search-shell", "glass-surface"], ["aria-hidden", "true", 1, "pi", "pi-search", "search-shell__icon"], ["type", "search", "placeholder", "Buscar um filme", 3, "input", "value"], ["aria-label", "Contador de selecao", 1, "selection-meter"], [1, "selection-step", 3, "is-complete"], [1, "movie-selection-preview__title-block"], [1, "chip-row", "glass-surface"], ["aria-label", "Filtro por genero", 1, "chip-row__viewport"], [1, "chip-row__track"], ["type", "button", 1, "filter-pill", 3, "is-selected"], [1, "movie-selection-preview__content"], [1, "movie-selection-preview__main"], [1, "movie-grid"], [1, "movie-grid__empty", "glass-surface"], [1, "movie-selection-preview__limit-hint", "glass-surface"], [1, "movie-selection-preview__cta"], ["type", "button", 1, "glass-button", "glass-button--light", "glass-button--cta", "movie-selection-preview__continue-button", 3, "click", "disabled"], ["aria-hidden", "true", 1, "glass-button__icon", "glass-button__icon--cta"], [1, "pi", "pi-arrow-right"], [1, "glass-button__content"], ["type", "button", "aria-label", "Abrir filmes selecionados", 1, "selection-drawer-trigger", "glass-button", "glass-button--light", 3, "click"], ["aria-hidden", "true", 1, "pi", "pi-list", "selection-drawer-trigger__icon"], [1, "selection-drawer-trigger__count"], [1, "selection-drawer", "glass-surface"], [1, "selection-drawer__header"], ["type", "button", "aria-label", "Fechar painel", 1, "selection-drawer__close", 3, "click"], ["aria-hidden", "true", 1, "pi", "pi-times"], [1, "selection-drawer__list"], [1, "selection-drawer__item", "glass-surface"], [1, "selection-step"], ["aria-hidden", "true", 1, "pi", "pi-check", "selection-step__icon"], ["type", "button", 1, "filter-pill", 3, "click"], ["aria-hidden", "true", 1, "filter-pill__dot"], ["tabindex", "0", "role", "button", 1, "poster-card-shell", 3, "is-selected", "is-selection-blocked", "is-details-expanded"], ["tabindex", "0", "role", "button", 1, "poster-card-shell", 3, "click", "keydown"], [1, "poster-card-shell__poster"], ["type", "button", 1, "glass-button", "glass-button--compact", "poster-card-shell__details-pill", 3, "click"], ["aria-hidden", "true", 1, "glass-button__icon", "glass-button__icon--compact"], [1, "pi", "pi-info-circle"], ["aria-hidden", "true", 1, "poster-card-shell__selected-badge"], [1, "poster-card-shell__art-copy"], [1, "poster-card-shell__poster-year"], [1, "poster-card-shell__poster-title"], [1, "poster-card-shell__meta"], [1, "text-overline"], [1, "poster-card-shell__details", "glass-surface"], [1, "pi", "pi-check"], [1, "poster-card-shell__details", "glass-surface", 3, "click"], [1, "poster-card-shell__details-genres"], [1, "poster-card-shell__details-synopsis"], [1, "selection-drawer__poster"], [1, "selection-drawer__meta"], ["type", "button", 1, "selection-drawer__remove", 3, "click"]], template: function MovieSelectionPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "section", 0)(1, "div", 1)(2, "header", 2)(3, "div", 3)(4, "label", 4);
            i0.ɵɵdomElement(5, "i", 5);
            i0.ɵɵdomElementStart(6, "input", 6);
            i0.ɵɵdomListener("input", function MovieSelectionPage_Template_input_input_6_listener($event) { return ctx.updateSearchQuery(($event.target.value ?? "").toString()); });
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(7, "div", 7);
            i0.ɵɵrepeaterCreate(8, MovieSelectionPage_For_9_Template, 3, 3, "div", 8, i0.ɵɵrepeaterTrackByIdentity);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(10, "div", 9)(11, "h1");
            i0.ɵɵtext(12, "Selecione 5 filmes que voce ama");
            i0.ɵɵdomElement(13, "br");
            i0.ɵɵtext(14, "para entendermos seu gosto.");
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(15, "div", 10)(16, "div", 11)(17, "div", 12);
            i0.ɵɵrepeaterCreate(18, MovieSelectionPage_For_19_Template, 4, 3, "button", 13, _forTrack0);
            i0.ɵɵdomElementEnd()()()();
            i0.ɵɵdomElementStart(20, "div", 14)(21, "div", 15)(22, "div", 16);
            i0.ɵɵconditionalCreate(23, MovieSelectionPage_Conditional_23_Template, 5, 1, "div", 17)(24, MovieSelectionPage_Conditional_24_Template, 2, 0);
            i0.ɵɵdomElementEnd();
            i0.ɵɵconditionalCreate(25, MovieSelectionPage_Conditional_25_Template, 2, 1, "p", 18);
            i0.ɵɵdomElementStart(26, "div", 19)(27, "button", 20);
            i0.ɵɵdomListener("click", function MovieSelectionPage_Template_button_click_27_listener() { return ctx.continueToLoading(); });
            i0.ɵɵdomElementStart(28, "span", 21);
            i0.ɵɵdomElement(29, "i", 22);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(30, "span", 23);
            i0.ɵɵtext(31, "Continuar");
            i0.ɵɵdomElementEnd()()()();
            i0.ɵɵdomElementStart(32, "button", 24);
            i0.ɵɵdomListener("click", function MovieSelectionPage_Template_button_click_32_listener() { return ctx.openDrawer(); });
            i0.ɵɵdomElement(33, "i", 25);
            i0.ɵɵconditionalCreate(34, MovieSelectionPage_Conditional_34_Template, 2, 1, "span", 26);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(35, "aside", 27)(36, "div", 28)(37, "div")(38, "h2");
            i0.ɵɵtext(39, "Filmes selecionados");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(40, "p");
            i0.ɵɵtext(41);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(42, "button", 29);
            i0.ɵɵdomListener("click", function MovieSelectionPage_Template_button_click_42_listener() { return ctx.closeDrawer(); });
            i0.ɵɵdomElement(43, "i", 30);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(44, "div", 31);
            i0.ɵɵrepeaterCreate(45, MovieSelectionPage_For_46_Template, 13, 9, "article", 32, _forTrack1);
            i0.ɵɵdomElementEnd()()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵclassProp("is-drawer-open", ctx.isDrawerOpen());
            i0.ɵɵadvance(5);
            i0.ɵɵdomProperty("value", ctx.searchQuery());
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.selectionSteps);
            i0.ɵɵadvance(10);
            i0.ɵɵrepeater(ctx.genreOptions);
            i0.ɵɵadvance(5);
            i0.ɵɵconditional(ctx.hasNoResults() ? 23 : 24);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.showSelectionLimitHint() ? 25 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵdomProperty("disabled", !ctx.canContinue());
            i0.ɵɵadvance(7);
            i0.ɵɵconditional(ctx.selectedCount() ? 34 : -1);
            i0.ɵɵadvance();
            i0.ɵɵclassProp("is-open", ctx.isDrawerOpen());
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate2("", ctx.selectedCount(), " de ", ctx.maxSelectedMovies, " filmes escolhidos ate agora.");
            i0.ɵɵadvance(4);
            i0.ɵɵrepeater(ctx.selectedCards());
        } }, styles: [".movie-selection-preview[_ngcontent-%COMP%] {\n  width: 100%;\n  place-items: start center;\n  align-content: start;\n  padding-block: 1.55rem 2.4rem;\n  padding-inline: 1rem;\n}\n\n.movie-selection-preview__frame[_ngcontent-%COMP%] {\n  --card-width: 12.65rem;\n  --drawer-width: 21rem;\n  --content-width: calc((var(--card-width) * 4) + 4.05rem);\n  width: min(100%, var(--content-width));\n  position: relative;\n  display: grid;\n  gap: 1.5rem;\n}\n\n.movie-selection-preview__frame.is-drawer-open[_ngcontent-%COMP%]   .selection-drawer-trigger[_ngcontent-%COMP%] {\n  opacity: 0;\n  pointer-events: none;\n  transform: translateY(0.35rem);\n}\n\n.movie-selection-preview__header[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 1.2rem;\n}\n\n.movie-selection-preview__topbar[_ngcontent-%COMP%] {\n  min-height: 3.55rem;\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding-right: 2.5rem;\n}\n\n.movie-selection-preview__title-block[_ngcontent-%COMP%] {\n  width: min(100%, 40rem);\n  margin: 0 auto;\n  text-align: center;\n}\n\n.movie-selection-preview__title-block[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: clamp(2.3rem, 3vw, var(--font-size-display));\n  font-weight: var(--font-weight-semibold);\n  line-height: 1.28;\n  letter-spacing: -0.05em;\n}\n\n.search-shell[_ngcontent-%COMP%] {\n  width: min(100%, 21.25rem);\n  min-height: 3.55rem;\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding-inline: 1.15rem 1.25rem;\n  border-width: 1.6px;\n  border-color: rgba(255, 255, 255, 0.98);\n  border-radius: var(--radius-search);\n  box-shadow:\n    0 0 0 1px rgba(255, 255, 255, 0.18),\n    var(--shadow-1),\n    inset 0 1px 0 rgba(255, 255, 255, 0.72);\n  transition:\n    box-shadow 150ms ease,\n    border-color 150ms ease,\n    transform 150ms ease;\n}\n\n.search-shell__icon[_ngcontent-%COMP%] {\n  font-size: 1.08rem;\n  line-height: 1;\n  color: var(--color-text-muted);\n  flex: 0 0 auto;\n}\n\n.search-shell[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 0;\n  outline: none;\n  background: transparent;\n  color: var(--color-text);\n  font-size: var(--font-size-body);\n}\n\n.search-shell[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder {\n  color: var(--color-text-muted);\n}\n\n.search-shell[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow:\n    0 0 0 1px rgba(255, 255, 255, 0.22),\n    var(--shadow-2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.78);\n}\n\n.search-shell[_ngcontent-%COMP%]:focus-within {\n  border-color: rgba(163, 69, 164, 0.22);\n  box-shadow:\n    var(--state-focus-ring),\n    var(--shadow-2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.78);\n}\n\n.selection-meter[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.35rem;\n}\n\n.selection-step[_ngcontent-%COMP%] {\n  width: 2.95rem;\n  height: 2.9rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 0.85rem;\n  border: 1px solid rgba(55, 62, 67, 0.1);\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(244, 245, 246, 0.9));\n  box-shadow: var(--shadow-1);\n  color: var(--color-text-muted);\n  font-size: 0.94rem;\n  font-weight: var(--font-weight-medium);\n  transition:\n    box-shadow 140ms ease,\n    transform 140ms ease,\n    border-color 140ms ease;\n}\n\n.selection-step.is-complete[_ngcontent-%COMP%] {\n  background: linear-gradient(180deg, #b95bb9, var(--color-accent));\n  border-color: rgba(163, 69, 164, 0.48);\n  color: #fff;\n  box-shadow:\n    0 10px 24px rgba(163, 69, 164, 0.22),\n    0 4px 10px rgba(55, 62, 67, 0.08);\n}\n\n.selection-step[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  border-color: rgba(163, 69, 164, 0.18);\n  box-shadow: var(--shadow-2);\n}\n\n.selection-step__icon[_ngcontent-%COMP%] {\n  font-size: 0.84rem;\n  line-height: 1;\n}\n\n.chip-row[_ngcontent-%COMP%] {\n  width: min(100%, var(--content-width));\n  margin: 0 auto;\n  padding: 0.24rem 0.55rem;\n  overflow: visible;\n  border-width: 1.6px;\n  border-color: rgba(255, 255, 255, 0.98);\n  border-radius: 999px;\n  box-shadow:\n    0 0 0 1px rgba(255, 255, 255, 0.14),\n    var(--shadow-1);\n}\n\n.chip-row__viewport[_ngcontent-%COMP%] {\n  width: 100%;\n  padding-block: 0.42rem;\n  padding-inline: 0.1rem;\n  overflow-x: auto;\n  overflow-y: hidden;\n  scrollbar-width: none;\n}\n\n.chip-row__viewport[_ngcontent-%COMP%]::-webkit-scrollbar {\n  display: none;\n}\n\n.chip-row__track[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.45rem;\n  align-items: center;\n  width: max-content;\n  min-width: 100%;\n  justify-content: center;\n  margin: 0 auto;\n}\n\n.filter-pill[_ngcontent-%COMP%] {\n  appearance: none;\n  min-height: 2.55rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.55rem;\n  flex: 0 0 auto;\n  padding-inline: 0.92rem;\n  border: 1px solid transparent;\n  border-radius: var(--radius-chip);\n  background: transparent;\n  color: var(--color-text-muted);\n  font-size: 0.95rem;\n  font-weight: var(--font-weight-semibold);\n  cursor: pointer;\n  transition:\n    color 120ms ease,\n    background-color 120ms ease,\n    border-color 120ms ease,\n    box-shadow 120ms ease,\n    transform 120ms ease;\n}\n\n.filter-pill__dot[_ngcontent-%COMP%] {\n  width: 0.5rem;\n  height: 0.5rem;\n  border-radius: 50%;\n  background: currentColor;\n  opacity: 0.78;\n}\n\n.filter-pill[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  border-color: rgba(55, 62, 67, 0.1);\n  background: rgba(255, 255, 255, 0.72);\n  box-shadow: 0 9px 18px rgba(55, 62, 67, 0.08);\n}\n\n.filter-pill[_ngcontent-%COMP%]:focus-visible {\n  outline: none;\n  box-shadow: var(--state-focus-ring);\n}\n\n.filter-pill[_ngcontent-%COMP%]:active {\n  transform: translateY(0);\n  background: rgba(244, 245, 246, 0.92);\n}\n\n.filter-pill.is-selected[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.9);\n  color: var(--color-accent);\n  border-color: rgba(163, 69, 164, 0.14);\n  box-shadow:\n    inset 0 0 0 1px rgba(163, 69, 164, 0.08),\n    0 10px 18px rgba(163, 69, 164, 0.08);\n}\n\n.movie-selection-preview__content[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: minmax(0, var(--content-width));\n  align-items: start;\n  min-width: 0;\n}\n\n.movie-selection-preview__main[_ngcontent-%COMP%] {\n  display: grid;\n  width: 100%;\n  max-width: var(--content-width);\n  gap: 1.15rem;\n  padding-bottom: 5.8rem;\n  min-width: 0;\n}\n\n.movie-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(4, var(--card-width));\n  justify-content: start;\n  gap: 1.45rem 1.35rem;\n  min-width: 0;\n}\n\n.movie-grid__empty[_ngcontent-%COMP%] {\n  grid-column: 1 / -1;\n  padding: 2.5rem 2rem;\n  text-align: center;\n}\n\n.movie-grid__empty[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 0.55rem;\n  font-size: 1.35rem;\n  font-weight: var(--font-weight-semibold);\n}\n\n.movie-grid__empty[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--color-text-muted);\n}\n\n.poster-card-shell[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.8rem;\n  cursor: pointer;\n  outline: none;\n  transition: transform 150ms ease;\n}\n\n.poster-card-shell__poster[_ngcontent-%COMP%] {\n  --poster-gradient: linear-gradient(160deg, #dde6ef 0%, #9eb1c3 100%);\n  --poster-image: none;\n  position: relative;\n  aspect-ratio: 0.775;\n  overflow: hidden;\n  border-radius: var(--radius-card);\n  border: 2px solid rgba(255, 255, 255, 0.98);\n  background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(12, 18, 24, 0.18)),\n    linear-gradient(180deg, transparent 62%, rgba(10, 17, 24, 0.6) 100%),\n    var(--poster-image),\n    var(--poster-gradient);\n  background-size: cover;\n  background-position: center;\n  box-shadow:\n    0 0 0 1px rgba(55, 62, 67, 0.12),\n    var(--shadow-2);\n  transition:\n    transform 150ms ease,\n    box-shadow 150ms ease,\n    border-color 150ms ease;\n}\n\n.poster-card-shell__poster[_ngcontent-%COMP%]::before {\n  content: '';\n  position: absolute;\n  inset: 0;\n  background:\n    radial-gradient(circle at top, rgba(255, 255, 255, 0.14), transparent 32%),\n    linear-gradient(180deg, transparent 54%, rgba(8, 16, 22, 0.36) 100%);\n  pointer-events: none;\n}\n\n.poster-card-shell__details-pill[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.7rem;\n  left: 0.7rem;\n  z-index: 1;\n  letter-spacing: 0.01em;\n  --glass-button-border-active: rgba(255, 255, 255, 0.3);\n  --glass-button-shadow:\n    0 12px 24px rgba(7, 14, 22, 0.14),\n    inset 0 1px 0 rgba(255, 255, 255, 0.26),\n    inset 0 -10px 16px rgba(8, 16, 24, 0.05);\n  --glass-button-shadow-hover:\n    0 15px 26px rgba(7, 14, 22, 0.16),\n    0 0 0 1px rgba(255, 255, 255, 0.06),\n    inset 0 1px 0 rgba(255, 255, 255, 0.3),\n    inset 0 -10px 16px rgba(8, 16, 24, 0.06);\n  --glass-button-shadow-active:\n    0 9px 18px rgba(7, 14, 22, 0.12),\n    inset 0 1px 0 rgba(255, 255, 255, 0.24),\n    inset 0 -10px 16px rgba(8, 16, 24, 0.06);\n}\n\n.poster-card-shell__details-pill--on-dark[_ngcontent-%COMP%] {\n  --glass-button-background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(236, 243, 248, 0.08));\n  --glass-button-border: rgba(255, 255, 255, 0.42);\n  --glass-button-color: rgba(255, 255, 255, 0.96);\n  --glass-button-overlay:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.06));\n  --glass-button-inset-shadow:\n    inset 0 1px 0 rgba(255, 255, 255, 0.32),\n    inset 0 -10px 16px rgba(8, 16, 24, 0.04);\n}\n\n.poster-card-shell__details-pill--on-light[_ngcontent-%COMP%] {\n  --glass-button-background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.46), rgba(232, 239, 244, 0.22));\n  --glass-button-border: rgba(255, 255, 255, 0.56);\n  --glass-button-color: rgba(22, 33, 42, 0.9);\n  --glass-button-overlay:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.46), rgba(255, 255, 255, 0.08));\n  --glass-button-inset-shadow:\n    inset 0 1px 0 rgba(255, 255, 255, 0.46),\n    inset 0 -10px 16px rgba(122, 136, 147, 0.08);\n}\n\n.poster-card-shell__selected-badge[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0.7rem;\n  right: 0.7rem;\n  z-index: 1;\n  width: 2.1rem;\n  height: 2.1rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  border: 1px solid rgba(255, 255, 255, 0.35);\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(245, 236, 245, 0.9));\n  color: var(--color-accent);\n  box-shadow:\n    0 10px 18px rgba(55, 62, 67, 0.14),\n    0 0 0 6px rgba(163, 69, 164, 0.08);\n  font-weight: var(--font-weight-semibold);\n}\n\n.poster-card-shell__art-copy[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: auto 1rem 0.95rem;\n  z-index: 1;\n  display: grid;\n  gap: 0.3rem;\n}\n\n.poster-card-shell__poster-year[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.84);\n  font-size: 0.8rem;\n  font-weight: var(--font-weight-medium);\n  text-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);\n}\n\n.poster-card-shell__poster-title[_ngcontent-%COMP%] {\n  max-width: 8ch;\n  color: #fff;\n  font-size: 1.36rem;\n  line-height: 0.98;\n  font-weight: var(--font-weight-semibold);\n  letter-spacing: -0.05em;\n  text-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);\n}\n\n.poster-card-shell__meta[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \n.selection-drawer__meta[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0.22rem 0 0.14rem;\n  font-size: var(--font-size-card-title);\n  font-weight: var(--font-weight-semibold);\n  line-height: 1.22;\n}\n\n.poster-card-shell__meta[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.selection-drawer__header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.selection-drawer__meta[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], \n.movie-grid__empty[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--color-text-muted);\n  font-size: var(--font-size-body);\n}\n\n.poster-card-shell__meta[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  line-height: 1.45;\n}\n\n.poster-card-shell[_ngcontent-%COMP%]:not(.is-selected):not(.is-selection-blocked):hover {\n  transform: translateY(-2px);\n}\n\n.poster-card-shell[_ngcontent-%COMP%]:not(.is-selected):not(.is-selection-blocked):hover   .poster-card-shell__poster[_ngcontent-%COMP%] {\n  border-color: rgba(255, 255, 255, 1);\n  box-shadow:\n    0 0 0 1px rgba(55, 62, 67, 0.16),\n    var(--shadow-3);\n}\n\n.poster-card-shell[_ngcontent-%COMP%]:not(.is-selected):focus-visible   .poster-card-shell__poster[_ngcontent-%COMP%] {\n  box-shadow:\n    var(--state-focus-ring),\n    0 0 0 1px rgba(55, 62, 67, 0.16),\n    var(--shadow-3);\n}\n\n.poster-card-shell[_ngcontent-%COMP%]:active {\n  transform: translateY(0);\n}\n\n.poster-card-shell.is-selected[_ngcontent-%COMP%] {\n  transform: translateY(-1px);\n}\n\n.poster-card-shell.is-selected[_ngcontent-%COMP%]   .poster-card-shell__poster[_ngcontent-%COMP%], \n.poster-card-shell.is-selected[_ngcontent-%COMP%]:hover   .poster-card-shell__poster[_ngcontent-%COMP%] {\n  border-width: 3px;\n  border-color: rgba(163, 69, 164, 0.72);\n  box-shadow:\n    0 0 0 1px rgba(255, 255, 255, 0.94),\n    0 0 0 5px rgba(163, 69, 164, 0.18),\n    0 22px 38px rgba(55, 62, 67, 0.14);\n}\n\n.poster-card-shell.is-selected[_ngcontent-%COMP%]:focus-visible   .poster-card-shell__poster[_ngcontent-%COMP%] {\n  box-shadow:\n    var(--state-focus-ring),\n    0 0 0 1px rgba(255, 255, 255, 0.94),\n    0 0 0 5px rgba(163, 69, 164, 0.18),\n    0 22px 38px rgba(55, 62, 67, 0.14);\n}\n\n.poster-card-shell.is-selected[_ngcontent-%COMP%]   .poster-card-shell__meta[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  color: var(--color-accent);\n}\n\n.poster-card-shell.is-selected[_ngcontent-%COMP%]   .poster-card-shell__selected-badge[_ngcontent-%COMP%] {\n  border-color: rgba(163, 69, 164, 0.34);\n  box-shadow:\n    0 12px 22px rgba(55, 62, 67, 0.14),\n    0 0 0 5px rgba(163, 69, 164, 0.12);\n}\n\n.poster-card-shell.is-selection-blocked[_ngcontent-%COMP%]:not(.is-selected) {\n  cursor: not-allowed;\n}\n\n.poster-card-shell.is-selection-blocked[_ngcontent-%COMP%]:not(.is-selected)   .poster-card-shell__poster[_ngcontent-%COMP%] {\n  box-shadow:\n    0 0 0 1px rgba(55, 62, 67, 0.1),\n    0 14px 28px rgba(55, 62, 67, 0.08);\n}\n\n.poster-card-shell__details[_ngcontent-%COMP%] {\n  padding: 0.95rem 1rem 1.05rem;\n  border-radius: 1.15rem;\n  border: 1px solid rgba(255, 255, 255, 0.92);\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(244, 245, 246, 0.82));\n  box-shadow:\n    0 12px 24px rgba(55, 62, 67, 0.08),\n    inset 0 1px 0 rgba(255, 255, 255, 0.82);\n}\n\n.poster-card-shell__details-genres[_ngcontent-%COMP%] {\n  margin: 0.45rem 0 0.75rem;\n  color: var(--color-accent-strong);\n  font-size: 0.95rem;\n  font-weight: var(--font-weight-medium);\n  line-height: 1.4;\n}\n\n.poster-card-shell__details-synopsis[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--color-text);\n  font-size: 0.95rem;\n  line-height: 1.6;\n}\n\n.movie-selection-preview__limit-hint[_ngcontent-%COMP%] {\n  position: fixed;\n  left: 50%;\n  bottom: 5.5rem;\n  z-index: 8;\n  margin: 0;\n  transform: translateX(-50%);\n  padding: 0.65rem 1rem;\n  border-radius: 999px;\n  color: var(--color-accent-strong);\n  background: rgba(255, 246, 255, 0.92);\n  border: 1px solid rgba(163, 69, 164, 0.18);\n  box-shadow:\n    0 14px 28px rgba(55, 62, 67, 0.1),\n    inset 0 1px 0 rgba(255, 255, 255, 0.82);\n  font-size: 0.92rem;\n  line-height: 1.35;\n}\n\n.movie-selection-preview__cta[_ngcontent-%COMP%] {\n  position: fixed;\n  left: 50%;\n  bottom: 0.9rem;\n  z-index: 7;\n  display: flex;\n  justify-content: center;\n  transform: translateX(-50%);\n}\n\n.movie-selection-preview__continue-button[_ngcontent-%COMP%] {\n  --glass-button-height: 3rem;\n  --glass-button-padding-block: 0.68rem;\n  --glass-button-padding-inline: 1.05rem;\n  --glass-button-gap: 0.5rem;\n  --glass-button-font-size: 0.95rem;\n  --glass-button-background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(236, 242, 246, 0.68));\n  --glass-button-border: rgba(255, 255, 255, 0.98);\n  --glass-button-border-active: rgba(255, 255, 255, 0.9);\n  --glass-button-color: #23313b;\n  --glass-button-shadow:\n    0 20px 40px rgba(55, 62, 67, 0.14),\n    inset 0 1px 0 rgba(255, 255, 255, 0.88),\n    inset 0 -12px 20px rgba(214, 222, 228, 0.16);\n  --glass-button-shadow-hover:\n    0 22px 42px rgba(55, 62, 67, 0.16),\n    0 0 0 1px rgba(255, 255, 255, 0.38),\n    inset 0 1px 0 rgba(255, 255, 255, 0.9),\n    inset 0 -12px 20px rgba(214, 222, 228, 0.14);\n  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.34);\n}\n\n.movie-selection-preview__continue-button[_ngcontent-%COMP%]   .glass-button__icon[_ngcontent-%COMP%] {\n  color: var(--color-accent-strong);\n  opacity: 0.9;\n  font-size: 0.9rem;\n}\n\n.movie-selection-preview__continue-button[_ngcontent-%COMP%]:disabled {\n  cursor: not-allowed;\n  opacity: 0.8;\n  transform: none;\n  color: rgba(35, 49, 59, 0.76);\n  border-color: rgba(255, 255, 255, 0.92);\n  box-shadow:\n    0 12px 24px rgba(55, 62, 67, 0.08),\n    inset 0 1px 0 rgba(255, 255, 255, 0.76),\n    inset 0 -10px 18px rgba(220, 226, 231, 0.12);\n}\n\n.selection-drawer-trigger[_ngcontent-%COMP%] {\n  position: fixed;\n  right: 0.95rem;\n  bottom: 0.95rem;\n  z-index: 10;\n  width: 3.1rem;\n  height: 3.1rem;\n  padding: 0;\n  border-radius: 50%;\n  --glass-button-background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(238, 243, 247, 0.62));\n  --glass-button-border: rgba(255, 255, 255, 0.96);\n  --glass-button-color: #24313b;\n  --glass-button-shadow:\n    0 18px 34px rgba(55, 62, 67, 0.12),\n    inset 0 1px 0 rgba(255, 255, 255, 0.86),\n    inset 0 -10px 18px rgba(220, 226, 231, 0.14);\n  transition:\n    transform 160ms ease,\n    opacity 160ms ease,\n    box-shadow 160ms ease;\n}\n\n.selection-drawer-trigger__icon[_ngcontent-%COMP%], \n.selection-drawer-trigger__count[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n}\n\n.selection-drawer-trigger__icon[_ngcontent-%COMP%] {\n  font-size: 1.05rem;\n  line-height: 1;\n}\n\n.selection-drawer-trigger__count[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -0.12rem;\n  right: -0.08rem;\n  min-width: 1.45rem;\n  height: 1.45rem;\n  padding-inline: 0.35rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 999px;\n  background: linear-gradient(180deg, #bf66c0, var(--color-accent));\n  box-shadow:\n    0 8px 16px rgba(163, 69, 164, 0.22),\n    inset 0 1px 0 rgba(255, 255, 255, 0.28);\n  color: #fff;\n  font-size: 0.75rem;\n  font-weight: var(--font-weight-semibold);\n}\n\n.selection-drawer[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 9;\n  width: var(--drawer-width);\n  min-width: 0;\n  padding: 1rem 0.82rem 0.82rem;\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  gap: 0.6rem;\n  align-content: start;\n  overflow: hidden;\n  border-radius: 1.75rem 0 0 1.75rem;\n  border-right: 0;\n  box-shadow:\n    -18px 0 42px rgba(55, 62, 67, 0.14),\n    -3px 0 12px rgba(55, 62, 67, 0.05);\n  transform: translateX(calc(100% + 1.2rem));\n  opacity: 0;\n  pointer-events: none;\n  transition:\n    transform 180ms ease,\n    opacity 180ms ease,\n    box-shadow 180ms ease;\n}\n\n.selection-drawer.is-open[_ngcontent-%COMP%] {\n  transform: translateX(0);\n  opacity: 1;\n  pointer-events: auto;\n}\n\n.selection-drawer__header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 0.85rem;\n  padding-inline: 0.2rem;\n}\n\n.selection-drawer__header[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  margin: 0 0 0.28rem;\n  font-size: 1.24rem;\n  line-height: 1.12;\n  font-weight: var(--font-weight-semibold);\n}\n\n.selection-drawer__close[_ngcontent-%COMP%], \n.selection-drawer__remove[_ngcontent-%COMP%] {\n  appearance: none;\n  border: 0;\n  background: transparent;\n  color: var(--color-text-muted);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition:\n    color 120ms ease,\n    transform 120ms ease;\n}\n\n.selection-drawer__close[_ngcontent-%COMP%] {\n  width: 2rem;\n  height: 2rem;\n  padding: 0;\n}\n\n.selection-drawer__remove[_ngcontent-%COMP%] {\n  width: 1.75rem;\n  height: 1.75rem;\n  padding: 0;\n}\n\n.selection-drawer__close[_ngcontent-%COMP%]   .pi[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  line-height: 1;\n}\n\n.selection-drawer__remove[_ngcontent-%COMP%]   .pi[_ngcontent-%COMP%], \n.poster-card-shell__selected-badge[_ngcontent-%COMP%]   .pi[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  line-height: 1;\n}\n\n.selection-drawer__close[_ngcontent-%COMP%]:hover, \n.selection-drawer__remove[_ngcontent-%COMP%]:hover {\n  color: var(--color-accent);\n  transform: scale(1.04);\n}\n\n.selection-drawer__list[_ngcontent-%COMP%] {\n  display: grid;\n  grid-auto-rows: max-content;\n  align-content: start;\n  gap: 0.42rem;\n  min-height: 0;\n  overflow: auto;\n  padding-right: 0;\n}\n\n.selection-drawer__item[_ngcontent-%COMP%] {\n  padding: 0.38rem;\n  display: grid;\n  grid-template-columns: 5.5rem minmax(0, 1fr) auto;\n  gap: 0.45rem;\n  align-items: start;\n  border-radius: 1.18rem;\n  box-shadow:\n    0 0 0 1px rgba(55, 62, 67, 0.06),\n    var(--shadow-1);\n  transition:\n    box-shadow 140ms ease,\n    transform 140ms ease;\n}\n\n.selection-drawer__poster[_ngcontent-%COMP%] {\n  --poster-gradient: linear-gradient(160deg, #dde6ef 0%, #9eb1c3 100%);\n  --poster-image: none;\n  min-height: 7.35rem;\n  display: flex;\n  align-items: flex-end;\n  padding: 0.42rem;\n  border-radius: 0.98rem;\n  background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(12, 18, 24, 0.2)),\n    linear-gradient(180deg, transparent 56%, rgba(10, 17, 24, 0.5) 100%),\n    var(--poster-image),\n    var(--poster-gradient);\n  background-size: cover;\n  background-position: center;\n  color: rgba(255, 255, 255, 0.96);\n  box-shadow:\n    inset 0 1px 0 rgba(255, 255, 255, 0.18),\n    0 0 0 1px rgba(55, 62, 67, 0.08);\n}\n\n.selection-drawer__poster[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  line-height: 1.08;\n  font-weight: var(--font-weight-semibold);\n}\n\n.selection-drawer__meta[_ngcontent-%COMP%] {\n  display: grid;\n  gap: 0.14rem;\n  padding-top: 0.06rem;\n  min-width: 0;\n}\n\n.selection-drawer__item[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow:\n    0 0 0 1px rgba(163, 69, 164, 0.1),\n    var(--shadow-2);\n}\n\n@media (min-width: 1081px) and (max-height: 820px) {\n  .movie-selection-preview[_ngcontent-%COMP%] {\n    padding-block: 1.2rem 2rem;\n  }\n\n  .movie-selection-preview__header[_ngcontent-%COMP%] {\n    gap: 1rem;\n  }\n\n  .movie-selection-preview__topbar[_ngcontent-%COMP%], \n   .search-shell[_ngcontent-%COMP%] {\n    min-height: 3.35rem;\n  }\n\n  .movie-selection-preview__title-block[_ngcontent-%COMP%] {\n    width: min(100%, 37rem);\n  }\n\n  .movie-selection-preview__title-block[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: 2.15rem;\n    line-height: 1.22;\n  }\n\n  .selection-step[_ngcontent-%COMP%] {\n    width: 2.75rem;\n    height: 2.7rem;\n  }\n\n  .chip-row__viewport[_ngcontent-%COMP%] {\n    padding-block: 0.32rem;\n  }\n\n  .filter-pill[_ngcontent-%COMP%] {\n    min-height: 2.4rem;\n  }\n\n  .movie-selection-preview__main[_ngcontent-%COMP%] {\n    padding-bottom: 5.35rem;\n  }\n}\n\n@media (max-width: 1240px) {\n  .movie-selection-preview__frame[_ngcontent-%COMP%] {\n    --content-width: calc((var(--card-width) * 3) + 2.7rem);\n  }\n\n  .movie-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(3, var(--card-width));\n  }\n}\n\n@media (max-width: 1080px) {\n  .movie-selection-preview__frame[_ngcontent-%COMP%] {\n    width: min(100%, 60rem);\n  }\n\n  .movie-selection-preview__topbar[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    justify-items: center;\n    gap: 1rem;\n  }\n\n  .search-shell[_ngcontent-%COMP%], \n   .selection-meter[_ngcontent-%COMP%] {\n    grid-column: auto;\n    justify-self: center;\n  }\n\n  .search-shell[_ngcontent-%COMP%] {\n    width: min(100%, 22.5rem);\n  }\n\n  .chip-row[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n\n  .movie-selection-preview__content[_ngcontent-%COMP%] {\n    display: block;\n  }\n\n  .movie-selection-preview__main[_ngcontent-%COMP%] {\n    width: auto;\n  }\n\n  .movie-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .movie-selection-preview__limit-hint[_ngcontent-%COMP%], \n   .movie-selection-preview__cta[_ngcontent-%COMP%] {\n    left: 50%;\n  }\n}\n\n@media (max-width: 720px) {\n  .movie-selection-preview[_ngcontent-%COMP%] {\n    padding-inline: 1rem;\n    padding-block: 2rem 2.5rem;\n  }\n\n  .movie-selection-preview__title-block[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n    font-size: clamp(2rem, 8vw, 2.625rem);\n  }\n\n  .search-shell[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n\n  .selection-step[_ngcontent-%COMP%] {\n    width: 2.85rem;\n    height: 2.8rem;\n  }\n\n  .movie-selection-preview__main[_ngcontent-%COMP%] {\n    padding-bottom: 7rem;\n  }\n\n  .movie-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n\n  .movie-selection-preview__limit-hint[_ngcontent-%COMP%] {\n    width: min(calc(100vw - 2rem), 24rem);\n    bottom: 5.8rem;\n    border-radius: 1rem;\n    text-align: center;\n  }\n\n  .selection-drawer-trigger[_ngcontent-%COMP%] {\n    right: 1rem;\n    bottom: 1rem;\n  }\n\n  .selection-drawer[_ngcontent-%COMP%] {\n    top: 0.5rem;\n    right: 0.5rem;\n    bottom: 0.5rem;\n    width: calc(100vw - 1rem);\n    min-width: 0;\n    border-radius: 1.45rem;\n    border-right: 1px solid var(--color-border);\n  }\n\n  .selection-drawer__header[_ngcontent-%COMP%] {\n    align-items: center;\n  }\n\n  .selection-drawer__item[_ngcontent-%COMP%] {\n    grid-template-columns: 5.45rem minmax(0, 1fr) auto;\n  }\n\n  .selection-drawer__poster[_ngcontent-%COMP%] {\n    min-height: 7.7rem;\n  }\n}"], changeDetection: 0 });
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MovieSelectionPage, [{
        type: Component,
        args: [{ selector: 'app-movie-selection-page', changeDetection: ChangeDetectionStrategy.OnPush, template: "<section class=\"page-shell movie-selection-preview\">\n  <div class=\"movie-selection-preview__frame\" [class.is-drawer-open]=\"isDrawerOpen()\">\n    <header class=\"movie-selection-preview__header\">\n      <div class=\"movie-selection-preview__topbar\">\n        <label class=\"search-shell glass-surface\" aria-label=\"Buscar um filme\">\n          <i class=\"pi pi-search search-shell__icon\" aria-hidden=\"true\"></i>\n          <input\n            type=\"search\"\n            placeholder=\"Buscar um filme\"\n            [value]=\"searchQuery()\"\n            (input)=\"updateSearchQuery(($any($event.target).value ?? '').toString())\"\n          />\n        </label>\n\n        <div class=\"selection-meter\" aria-label=\"Contador de selecao\">\n          @for (step of selectionSteps; track step) {\n            <div class=\"selection-step\" [class.is-complete]=\"step <= selectedCount()\">\n              @if (step <= selectedCount()) {\n                <i class=\"pi pi-check selection-step__icon\" aria-hidden=\"true\"></i>\n              } @else {\n                <span>{{ step }}</span>\n              }\n            </div>\n          }\n        </div>\n      </div>\n\n      <div class=\"movie-selection-preview__title-block\">\n        <h1>Selecione 5 filmes que voce ama<br />para entendermos seu gosto.</h1>\n      </div>\n\n      <div class=\"chip-row glass-surface\">\n        <div class=\"chip-row__viewport\" aria-label=\"Filtro por genero\">\n          <div class=\"chip-row__track\">\n            @for (genre of genreOptions; track genre.id) {\n              <button\n                class=\"filter-pill\"\n                type=\"button\"\n                [class.is-selected]=\"isGenreActive(genre.id)\"\n                (click)=\"selectGenre(genre.id)\"\n              >\n                <span class=\"filter-pill__dot\" aria-hidden=\"true\"></span>\n                <span>{{ genre.label }}</span>\n              </button>\n            }\n          </div>\n        </div>\n      </div>\n    </header>\n\n    <div class=\"movie-selection-preview__content\">\n      <div class=\"movie-selection-preview__main\">\n        <div class=\"movie-grid\">\n          @if (hasNoResults()) {\n            <div class=\"movie-grid__empty glass-surface\">\n              <h2>Nenhum resultado encontrado</h2>\n              <p>{{ emptyStateMessage() }}</p>\n            </div>\n          } @else {\n            @for (card of filteredCards(); track card.movie.id) {\n              <article\n                class=\"poster-card-shell\"\n                tabindex=\"0\"\n                role=\"button\"\n                [class.is-selected]=\"isMovieSelected(card.movie.id)\"\n                [class.is-selection-blocked]=\"isSelectionBlocked(card.movie.id)\"\n                [class.is-details-expanded]=\"isDetailsExpanded(card.movie.id)\"\n                [attr.aria-pressed]=\"isMovieSelected(card.movie.id)\"\n                [attr.aria-disabled]=\"isSelectionBlocked(card.movie.id)\"\n                (click)=\"toggleMovieSelection(card.movie.id, $event)\"\n                (keydown)=\"onCardKeydown($event, card.movie.id)\"\n              >\n                <div\n                  class=\"poster-card-shell__poster\"\n                  [style.--poster-gradient]=\"card.posterGradient\"\n                  [style.--poster-image]=\"card.posterImage\"\n                >\n                  <button\n                    class=\"glass-button glass-button--compact poster-card-shell__details-pill\"\n                    type=\"button\"\n                    [class.poster-card-shell__details-pill--on-light]=\"card.detailsContrast === 'light'\"\n                    [class.poster-card-shell__details-pill--on-dark]=\"card.detailsContrast === 'dark'\"\n                    (click)=\"toggleMovieDetails(card.movie.id, $event)\"\n                  >\n                    <span class=\"glass-button__icon glass-button__icon--compact\" aria-hidden=\"true\">\n                      <i class=\"pi pi-info-circle\"></i>\n                    </span>\n                    <span class=\"glass-button__content\">Ver detalhes</span>\n                  </button>\n\n                  @if (isMovieSelected(card.movie.id)) {\n                    <span class=\"poster-card-shell__selected-badge\" aria-hidden=\"true\">\n                      <i class=\"pi pi-check\"></i>\n                    </span>\n                  }\n\n                  <div class=\"poster-card-shell__art-copy\">\n                    <span class=\"poster-card-shell__poster-year\">{{ card.movie.year }}</span>\n                    <span class=\"poster-card-shell__poster-title\">{{ card.movie.title }}</span>\n                  </div>\n                </div>\n\n                <div class=\"poster-card-shell__meta\">\n                  <span class=\"text-overline\">{{ card.movie.year }}</span>\n                  <h2>{{ card.movie.title }}</h2>\n                  <p>{{ card.genresLabel }}</p>\n                </div>\n\n                @if (isDetailsExpanded(card.movie.id)) {\n                  <div class=\"poster-card-shell__details glass-surface\" (click)=\"$event.stopPropagation()\">\n                    <span class=\"text-overline\">Sinopse</span>\n                    <p class=\"poster-card-shell__details-genres\">{{ card.genresLabel }}</p>\n                    <p class=\"poster-card-shell__details-synopsis\">{{ card.movie.synopsis }}</p>\n                  </div>\n                }\n              </article>\n            }\n          }\n        </div>\n\n        @if (showSelectionLimitHint()) {\n          <p class=\"movie-selection-preview__limit-hint glass-surface\">\n            {{ selectionLimitHint }}\n          </p>\n        }\n\n        <div class=\"movie-selection-preview__cta\">\n          <button\n            class=\"glass-button glass-button--light glass-button--cta movie-selection-preview__continue-button\"\n            type=\"button\"\n            [disabled]=\"!canContinue()\"\n            (click)=\"continueToLoading()\"\n          >\n            <span class=\"glass-button__icon glass-button__icon--cta\" aria-hidden=\"true\">\n              <i class=\"pi pi-arrow-right\"></i>\n            </span>\n            <span class=\"glass-button__content\">Continuar</span>\n          </button>\n        </div>\n      </div>\n\n      <button\n        class=\"selection-drawer-trigger glass-button glass-button--light\"\n        type=\"button\"\n        aria-label=\"Abrir filmes selecionados\"\n        (click)=\"openDrawer()\"\n      >\n        <i class=\"pi pi-list selection-drawer-trigger__icon\" aria-hidden=\"true\"></i>\n\n        @if (selectedCount()) {\n          <span class=\"selection-drawer-trigger__count\">{{ selectedCount() }}</span>\n        }\n      </button>\n\n      <aside class=\"selection-drawer glass-surface\" [class.is-open]=\"isDrawerOpen()\">\n        <div class=\"selection-drawer__header\">\n          <div>\n            <h2>Filmes selecionados</h2>\n            <p>{{ selectedCount() }} de {{ maxSelectedMovies }} filmes escolhidos ate agora.</p>\n          </div>\n          <button\n            class=\"selection-drawer__close\"\n            type=\"button\"\n            aria-label=\"Fechar painel\"\n            (click)=\"closeDrawer()\"\n          >\n            <i class=\"pi pi-times\" aria-hidden=\"true\"></i>\n          </button>\n        </div>\n\n        <div class=\"selection-drawer__list\">\n          @for (card of selectedCards(); track card.movie.id) {\n            <article class=\"selection-drawer__item glass-surface\">\n              <div\n                class=\"selection-drawer__poster\"\n                [style.--poster-gradient]=\"card.posterGradient\"\n                [style.--poster-image]=\"card.posterImage\"\n              >\n                <span>{{ card.movie.title }}</span>\n              </div>\n\n              <div class=\"selection-drawer__meta\">\n                <span class=\"text-overline\">{{ card.movie.year }}</span>\n                <h3>{{ card.movie.title }}</h3>\n                <p>{{ card.genresLabel }}</p>\n              </div>\n\n              <button\n                class=\"selection-drawer__remove\"\n                type=\"button\"\n                [attr.aria-label]=\"'Remover ' + card.movie.title + ' da selecao'\"\n                (click)=\"removeSelectedMovie(card.movie.id, $event)\"\n              >\n                <i class=\"pi pi-times\" aria-hidden=\"true\"></i>\n              </button>\n            </article>\n          }\n        </div>\n      </aside>\n    </div>\n  </div>\n</section>\n", styles: [".movie-selection-preview {\n  width: 100%;\n  place-items: start center;\n  align-content: start;\n  padding-block: 1.55rem 2.4rem;\n  padding-inline: 1rem;\n}\n\n.movie-selection-preview__frame {\n  --card-width: 12.65rem;\n  --drawer-width: 21rem;\n  --content-width: calc((var(--card-width) * 4) + 4.05rem);\n  width: min(100%, var(--content-width));\n  position: relative;\n  display: grid;\n  gap: 1.5rem;\n}\n\n.movie-selection-preview__frame.is-drawer-open .selection-drawer-trigger {\n  opacity: 0;\n  pointer-events: none;\n  transform: translateY(0.35rem);\n}\n\n.movie-selection-preview__header {\n  display: grid;\n  gap: 1.2rem;\n}\n\n.movie-selection-preview__topbar {\n  min-height: 3.55rem;\n  position: relative;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding-right: 2.5rem;\n}\n\n.movie-selection-preview__title-block {\n  width: min(100%, 40rem);\n  margin: 0 auto;\n  text-align: center;\n}\n\n.movie-selection-preview__title-block h1 {\n  margin: 0;\n  font-size: clamp(2.3rem, 3vw, var(--font-size-display));\n  font-weight: var(--font-weight-semibold);\n  line-height: 1.28;\n  letter-spacing: -0.05em;\n}\n\n.search-shell {\n  width: min(100%, 21.25rem);\n  min-height: 3.55rem;\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding-inline: 1.15rem 1.25rem;\n  border-width: 1.6px;\n  border-color: rgba(255, 255, 255, 0.98);\n  border-radius: var(--radius-search);\n  box-shadow:\n    0 0 0 1px rgba(255, 255, 255, 0.18),\n    var(--shadow-1),\n    inset 0 1px 0 rgba(255, 255, 255, 0.72);\n  transition:\n    box-shadow 150ms ease,\n    border-color 150ms ease,\n    transform 150ms ease;\n}\n\n.search-shell__icon {\n  font-size: 1.08rem;\n  line-height: 1;\n  color: var(--color-text-muted);\n  flex: 0 0 auto;\n}\n\n.search-shell input {\n  width: 100%;\n  border: 0;\n  outline: none;\n  background: transparent;\n  color: var(--color-text);\n  font-size: var(--font-size-body);\n}\n\n.search-shell input::placeholder {\n  color: var(--color-text-muted);\n}\n\n.search-shell:hover {\n  transform: translateY(-1px);\n  box-shadow:\n    0 0 0 1px rgba(255, 255, 255, 0.22),\n    var(--shadow-2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.78);\n}\n\n.search-shell:focus-within {\n  border-color: rgba(163, 69, 164, 0.22);\n  box-shadow:\n    var(--state-focus-ring),\n    var(--shadow-2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.78);\n}\n\n.selection-meter {\n  position: absolute;\n  top: 0;\n  right: 0;\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.35rem;\n}\n\n.selection-step {\n  width: 2.95rem;\n  height: 2.9rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 0.85rem;\n  border: 1px solid rgba(55, 62, 67, 0.1);\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(244, 245, 246, 0.9));\n  box-shadow: var(--shadow-1);\n  color: var(--color-text-muted);\n  font-size: 0.94rem;\n  font-weight: var(--font-weight-medium);\n  transition:\n    box-shadow 140ms ease,\n    transform 140ms ease,\n    border-color 140ms ease;\n}\n\n.selection-step.is-complete {\n  background: linear-gradient(180deg, #b95bb9, var(--color-accent));\n  border-color: rgba(163, 69, 164, 0.48);\n  color: #fff;\n  box-shadow:\n    0 10px 24px rgba(163, 69, 164, 0.22),\n    0 4px 10px rgba(55, 62, 67, 0.08);\n}\n\n.selection-step:hover {\n  transform: translateY(-1px);\n  border-color: rgba(163, 69, 164, 0.18);\n  box-shadow: var(--shadow-2);\n}\n\n.selection-step__icon {\n  font-size: 0.84rem;\n  line-height: 1;\n}\n\n.chip-row {\n  width: min(100%, var(--content-width));\n  margin: 0 auto;\n  padding: 0.24rem 0.55rem;\n  overflow: visible;\n  border-width: 1.6px;\n  border-color: rgba(255, 255, 255, 0.98);\n  border-radius: 999px;\n  box-shadow:\n    0 0 0 1px rgba(255, 255, 255, 0.14),\n    var(--shadow-1);\n}\n\n.chip-row__viewport {\n  width: 100%;\n  padding-block: 0.42rem;\n  padding-inline: 0.1rem;\n  overflow-x: auto;\n  overflow-y: hidden;\n  scrollbar-width: none;\n}\n\n.chip-row__viewport::-webkit-scrollbar {\n  display: none;\n}\n\n.chip-row__track {\n  display: flex;\n  gap: 0.45rem;\n  align-items: center;\n  width: max-content;\n  min-width: 100%;\n  justify-content: center;\n  margin: 0 auto;\n}\n\n.filter-pill {\n  appearance: none;\n  min-height: 2.55rem;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.55rem;\n  flex: 0 0 auto;\n  padding-inline: 0.92rem;\n  border: 1px solid transparent;\n  border-radius: var(--radius-chip);\n  background: transparent;\n  color: var(--color-text-muted);\n  font-size: 0.95rem;\n  font-weight: var(--font-weight-semibold);\n  cursor: pointer;\n  transition:\n    color 120ms ease,\n    background-color 120ms ease,\n    border-color 120ms ease,\n    box-shadow 120ms ease,\n    transform 120ms ease;\n}\n\n.filter-pill__dot {\n  width: 0.5rem;\n  height: 0.5rem;\n  border-radius: 50%;\n  background: currentColor;\n  opacity: 0.78;\n}\n\n.filter-pill:hover {\n  transform: translateY(-1px);\n  border-color: rgba(55, 62, 67, 0.1);\n  background: rgba(255, 255, 255, 0.72);\n  box-shadow: 0 9px 18px rgba(55, 62, 67, 0.08);\n}\n\n.filter-pill:focus-visible {\n  outline: none;\n  box-shadow: var(--state-focus-ring);\n}\n\n.filter-pill:active {\n  transform: translateY(0);\n  background: rgba(244, 245, 246, 0.92);\n}\n\n.filter-pill.is-selected {\n  background: rgba(255, 255, 255, 0.9);\n  color: var(--color-accent);\n  border-color: rgba(163, 69, 164, 0.14);\n  box-shadow:\n    inset 0 0 0 1px rgba(163, 69, 164, 0.08),\n    0 10px 18px rgba(163, 69, 164, 0.08);\n}\n\n.movie-selection-preview__content {\n  display: grid;\n  grid-template-columns: minmax(0, var(--content-width));\n  align-items: start;\n  min-width: 0;\n}\n\n.movie-selection-preview__main {\n  display: grid;\n  width: 100%;\n  max-width: var(--content-width);\n  gap: 1.15rem;\n  padding-bottom: 5.8rem;\n  min-width: 0;\n}\n\n.movie-grid {\n  display: grid;\n  grid-template-columns: repeat(4, var(--card-width));\n  justify-content: start;\n  gap: 1.45rem 1.35rem;\n  min-width: 0;\n}\n\n.movie-grid__empty {\n  grid-column: 1 / -1;\n  padding: 2.5rem 2rem;\n  text-align: center;\n}\n\n.movie-grid__empty h2 {\n  margin: 0 0 0.55rem;\n  font-size: 1.35rem;\n  font-weight: var(--font-weight-semibold);\n}\n\n.movie-grid__empty p {\n  margin: 0;\n  color: var(--color-text-muted);\n}\n\n.poster-card-shell {\n  display: grid;\n  gap: 0.8rem;\n  cursor: pointer;\n  outline: none;\n  transition: transform 150ms ease;\n}\n\n.poster-card-shell__poster {\n  --poster-gradient: linear-gradient(160deg, #dde6ef 0%, #9eb1c3 100%);\n  --poster-image: none;\n  position: relative;\n  aspect-ratio: 0.775;\n  overflow: hidden;\n  border-radius: var(--radius-card);\n  border: 2px solid rgba(255, 255, 255, 0.98);\n  background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(12, 18, 24, 0.18)),\n    linear-gradient(180deg, transparent 62%, rgba(10, 17, 24, 0.6) 100%),\n    var(--poster-image),\n    var(--poster-gradient);\n  background-size: cover;\n  background-position: center;\n  box-shadow:\n    0 0 0 1px rgba(55, 62, 67, 0.12),\n    var(--shadow-2);\n  transition:\n    transform 150ms ease,\n    box-shadow 150ms ease,\n    border-color 150ms ease;\n}\n\n.poster-card-shell__poster::before {\n  content: '';\n  position: absolute;\n  inset: 0;\n  background:\n    radial-gradient(circle at top, rgba(255, 255, 255, 0.14), transparent 32%),\n    linear-gradient(180deg, transparent 54%, rgba(8, 16, 22, 0.36) 100%);\n  pointer-events: none;\n}\n\n.poster-card-shell__details-pill {\n  position: absolute;\n  top: 0.7rem;\n  left: 0.7rem;\n  z-index: 1;\n  letter-spacing: 0.01em;\n  --glass-button-border-active: rgba(255, 255, 255, 0.3);\n  --glass-button-shadow:\n    0 12px 24px rgba(7, 14, 22, 0.14),\n    inset 0 1px 0 rgba(255, 255, 255, 0.26),\n    inset 0 -10px 16px rgba(8, 16, 24, 0.05);\n  --glass-button-shadow-hover:\n    0 15px 26px rgba(7, 14, 22, 0.16),\n    0 0 0 1px rgba(255, 255, 255, 0.06),\n    inset 0 1px 0 rgba(255, 255, 255, 0.3),\n    inset 0 -10px 16px rgba(8, 16, 24, 0.06);\n  --glass-button-shadow-active:\n    0 9px 18px rgba(7, 14, 22, 0.12),\n    inset 0 1px 0 rgba(255, 255, 255, 0.24),\n    inset 0 -10px 16px rgba(8, 16, 24, 0.06);\n}\n\n.poster-card-shell__details-pill--on-dark {\n  --glass-button-background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(236, 243, 248, 0.08));\n  --glass-button-border: rgba(255, 255, 255, 0.42);\n  --glass-button-color: rgba(255, 255, 255, 0.96);\n  --glass-button-overlay:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.34), rgba(255, 255, 255, 0.06));\n  --glass-button-inset-shadow:\n    inset 0 1px 0 rgba(255, 255, 255, 0.32),\n    inset 0 -10px 16px rgba(8, 16, 24, 0.04);\n}\n\n.poster-card-shell__details-pill--on-light {\n  --glass-button-background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.46), rgba(232, 239, 244, 0.22));\n  --glass-button-border: rgba(255, 255, 255, 0.56);\n  --glass-button-color: rgba(22, 33, 42, 0.9);\n  --glass-button-overlay:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.46), rgba(255, 255, 255, 0.08));\n  --glass-button-inset-shadow:\n    inset 0 1px 0 rgba(255, 255, 255, 0.46),\n    inset 0 -10px 16px rgba(122, 136, 147, 0.08);\n}\n\n.poster-card-shell__selected-badge {\n  position: absolute;\n  top: 0.7rem;\n  right: 0.7rem;\n  z-index: 1;\n  width: 2.1rem;\n  height: 2.1rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n  border: 1px solid rgba(255, 255, 255, 0.35);\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(245, 236, 245, 0.9));\n  color: var(--color-accent);\n  box-shadow:\n    0 10px 18px rgba(55, 62, 67, 0.14),\n    0 0 0 6px rgba(163, 69, 164, 0.08);\n  font-weight: var(--font-weight-semibold);\n}\n\n.poster-card-shell__art-copy {\n  position: absolute;\n  inset: auto 1rem 0.95rem;\n  z-index: 1;\n  display: grid;\n  gap: 0.3rem;\n}\n\n.poster-card-shell__poster-year {\n  color: rgba(255, 255, 255, 0.84);\n  font-size: 0.8rem;\n  font-weight: var(--font-weight-medium);\n  text-shadow: 0 8px 18px rgba(0, 0, 0, 0.18);\n}\n\n.poster-card-shell__poster-title {\n  max-width: 8ch;\n  color: #fff;\n  font-size: 1.36rem;\n  line-height: 0.98;\n  font-weight: var(--font-weight-semibold);\n  letter-spacing: -0.05em;\n  text-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);\n}\n\n.poster-card-shell__meta h2,\n.selection-drawer__meta h3 {\n  margin: 0.22rem 0 0.14rem;\n  font-size: var(--font-size-card-title);\n  font-weight: var(--font-weight-semibold);\n  line-height: 1.22;\n}\n\n.poster-card-shell__meta p,\n.selection-drawer__header p,\n.selection-drawer__meta p,\n.movie-grid__empty p {\n  margin: 0;\n  color: var(--color-text-muted);\n  font-size: var(--font-size-body);\n}\n\n.poster-card-shell__meta p {\n  line-height: 1.45;\n}\n\n.poster-card-shell:not(.is-selected):not(.is-selection-blocked):hover {\n  transform: translateY(-2px);\n}\n\n.poster-card-shell:not(.is-selected):not(.is-selection-blocked):hover .poster-card-shell__poster {\n  border-color: rgba(255, 255, 255, 1);\n  box-shadow:\n    0 0 0 1px rgba(55, 62, 67, 0.16),\n    var(--shadow-3);\n}\n\n.poster-card-shell:not(.is-selected):focus-visible .poster-card-shell__poster {\n  box-shadow:\n    var(--state-focus-ring),\n    0 0 0 1px rgba(55, 62, 67, 0.16),\n    var(--shadow-3);\n}\n\n.poster-card-shell:active {\n  transform: translateY(0);\n}\n\n.poster-card-shell.is-selected {\n  transform: translateY(-1px);\n}\n\n.poster-card-shell.is-selected .poster-card-shell__poster,\n.poster-card-shell.is-selected:hover .poster-card-shell__poster {\n  border-width: 3px;\n  border-color: rgba(163, 69, 164, 0.72);\n  box-shadow:\n    0 0 0 1px rgba(255, 255, 255, 0.94),\n    0 0 0 5px rgba(163, 69, 164, 0.18),\n    0 22px 38px rgba(55, 62, 67, 0.14);\n}\n\n.poster-card-shell.is-selected:focus-visible .poster-card-shell__poster {\n  box-shadow:\n    var(--state-focus-ring),\n    0 0 0 1px rgba(255, 255, 255, 0.94),\n    0 0 0 5px rgba(163, 69, 164, 0.18),\n    0 22px 38px rgba(55, 62, 67, 0.14);\n}\n\n.poster-card-shell.is-selected .poster-card-shell__meta h2 {\n  color: var(--color-accent);\n}\n\n.poster-card-shell.is-selected .poster-card-shell__selected-badge {\n  border-color: rgba(163, 69, 164, 0.34);\n  box-shadow:\n    0 12px 22px rgba(55, 62, 67, 0.14),\n    0 0 0 5px rgba(163, 69, 164, 0.12);\n}\n\n.poster-card-shell.is-selection-blocked:not(.is-selected) {\n  cursor: not-allowed;\n}\n\n.poster-card-shell.is-selection-blocked:not(.is-selected) .poster-card-shell__poster {\n  box-shadow:\n    0 0 0 1px rgba(55, 62, 67, 0.1),\n    0 14px 28px rgba(55, 62, 67, 0.08);\n}\n\n.poster-card-shell__details {\n  padding: 0.95rem 1rem 1.05rem;\n  border-radius: 1.15rem;\n  border: 1px solid rgba(255, 255, 255, 0.92);\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(244, 245, 246, 0.82));\n  box-shadow:\n    0 12px 24px rgba(55, 62, 67, 0.08),\n    inset 0 1px 0 rgba(255, 255, 255, 0.82);\n}\n\n.poster-card-shell__details-genres {\n  margin: 0.45rem 0 0.75rem;\n  color: var(--color-accent-strong);\n  font-size: 0.95rem;\n  font-weight: var(--font-weight-medium);\n  line-height: 1.4;\n}\n\n.poster-card-shell__details-synopsis {\n  margin: 0;\n  color: var(--color-text);\n  font-size: 0.95rem;\n  line-height: 1.6;\n}\n\n.movie-selection-preview__limit-hint {\n  position: fixed;\n  left: 50%;\n  bottom: 5.5rem;\n  z-index: 8;\n  margin: 0;\n  transform: translateX(-50%);\n  padding: 0.65rem 1rem;\n  border-radius: 999px;\n  color: var(--color-accent-strong);\n  background: rgba(255, 246, 255, 0.92);\n  border: 1px solid rgba(163, 69, 164, 0.18);\n  box-shadow:\n    0 14px 28px rgba(55, 62, 67, 0.1),\n    inset 0 1px 0 rgba(255, 255, 255, 0.82);\n  font-size: 0.92rem;\n  line-height: 1.35;\n}\n\n.movie-selection-preview__cta {\n  position: fixed;\n  left: 50%;\n  bottom: 0.9rem;\n  z-index: 7;\n  display: flex;\n  justify-content: center;\n  transform: translateX(-50%);\n}\n\n.movie-selection-preview__continue-button {\n  --glass-button-height: 3rem;\n  --glass-button-padding-block: 0.68rem;\n  --glass-button-padding-inline: 1.05rem;\n  --glass-button-gap: 0.5rem;\n  --glass-button-font-size: 0.95rem;\n  --glass-button-background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(236, 242, 246, 0.68));\n  --glass-button-border: rgba(255, 255, 255, 0.98);\n  --glass-button-border-active: rgba(255, 255, 255, 0.9);\n  --glass-button-color: #23313b;\n  --glass-button-shadow:\n    0 20px 40px rgba(55, 62, 67, 0.14),\n    inset 0 1px 0 rgba(255, 255, 255, 0.88),\n    inset 0 -12px 20px rgba(214, 222, 228, 0.16);\n  --glass-button-shadow-hover:\n    0 22px 42px rgba(55, 62, 67, 0.16),\n    0 0 0 1px rgba(255, 255, 255, 0.38),\n    inset 0 1px 0 rgba(255, 255, 255, 0.9),\n    inset 0 -12px 20px rgba(214, 222, 228, 0.14);\n  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.34);\n}\n\n.movie-selection-preview__continue-button .glass-button__icon {\n  color: var(--color-accent-strong);\n  opacity: 0.9;\n  font-size: 0.9rem;\n}\n\n.movie-selection-preview__continue-button:disabled {\n  cursor: not-allowed;\n  opacity: 0.8;\n  transform: none;\n  color: rgba(35, 49, 59, 0.76);\n  border-color: rgba(255, 255, 255, 0.92);\n  box-shadow:\n    0 12px 24px rgba(55, 62, 67, 0.08),\n    inset 0 1px 0 rgba(255, 255, 255, 0.76),\n    inset 0 -10px 18px rgba(220, 226, 231, 0.12);\n}\n\n.selection-drawer-trigger {\n  position: fixed;\n  right: 0.95rem;\n  bottom: 0.95rem;\n  z-index: 10;\n  width: 3.1rem;\n  height: 3.1rem;\n  padding: 0;\n  border-radius: 50%;\n  --glass-button-background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.82), rgba(238, 243, 247, 0.62));\n  --glass-button-border: rgba(255, 255, 255, 0.96);\n  --glass-button-color: #24313b;\n  --glass-button-shadow:\n    0 18px 34px rgba(55, 62, 67, 0.12),\n    inset 0 1px 0 rgba(255, 255, 255, 0.86),\n    inset 0 -10px 18px rgba(220, 226, 231, 0.14);\n  transition:\n    transform 160ms ease,\n    opacity 160ms ease,\n    box-shadow 160ms ease;\n}\n\n.selection-drawer-trigger__icon,\n.selection-drawer-trigger__count {\n  position: relative;\n  z-index: 1;\n}\n\n.selection-drawer-trigger__icon {\n  font-size: 1.05rem;\n  line-height: 1;\n}\n\n.selection-drawer-trigger__count {\n  position: absolute;\n  top: -0.12rem;\n  right: -0.08rem;\n  min-width: 1.45rem;\n  height: 1.45rem;\n  padding-inline: 0.35rem;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 999px;\n  background: linear-gradient(180deg, #bf66c0, var(--color-accent));\n  box-shadow:\n    0 8px 16px rgba(163, 69, 164, 0.22),\n    inset 0 1px 0 rgba(255, 255, 255, 0.28);\n  color: #fff;\n  font-size: 0.75rem;\n  font-weight: var(--font-weight-semibold);\n}\n\n.selection-drawer {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 9;\n  width: var(--drawer-width);\n  min-width: 0;\n  padding: 1rem 0.82rem 0.82rem;\n  display: grid;\n  grid-template-rows: auto minmax(0, 1fr);\n  gap: 0.6rem;\n  align-content: start;\n  overflow: hidden;\n  border-radius: 1.75rem 0 0 1.75rem;\n  border-right: 0;\n  box-shadow:\n    -18px 0 42px rgba(55, 62, 67, 0.14),\n    -3px 0 12px rgba(55, 62, 67, 0.05);\n  transform: translateX(calc(100% + 1.2rem));\n  opacity: 0;\n  pointer-events: none;\n  transition:\n    transform 180ms ease,\n    opacity 180ms ease,\n    box-shadow 180ms ease;\n}\n\n.selection-drawer.is-open {\n  transform: translateX(0);\n  opacity: 1;\n  pointer-events: auto;\n}\n\n.selection-drawer__header {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 0.85rem;\n  padding-inline: 0.2rem;\n}\n\n.selection-drawer__header h2 {\n  margin: 0 0 0.28rem;\n  font-size: 1.24rem;\n  line-height: 1.12;\n  font-weight: var(--font-weight-semibold);\n}\n\n.selection-drawer__close,\n.selection-drawer__remove {\n  appearance: none;\n  border: 0;\n  background: transparent;\n  color: var(--color-text-muted);\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition:\n    color 120ms ease,\n    transform 120ms ease;\n}\n\n.selection-drawer__close {\n  width: 2rem;\n  height: 2rem;\n  padding: 0;\n}\n\n.selection-drawer__remove {\n  width: 1.75rem;\n  height: 1.75rem;\n  padding: 0;\n}\n\n.selection-drawer__close .pi {\n  font-size: 1rem;\n  line-height: 1;\n}\n\n.selection-drawer__remove .pi,\n.poster-card-shell__selected-badge .pi {\n  font-size: 0.95rem;\n  line-height: 1;\n}\n\n.selection-drawer__close:hover,\n.selection-drawer__remove:hover {\n  color: var(--color-accent);\n  transform: scale(1.04);\n}\n\n.selection-drawer__list {\n  display: grid;\n  grid-auto-rows: max-content;\n  align-content: start;\n  gap: 0.42rem;\n  min-height: 0;\n  overflow: auto;\n  padding-right: 0;\n}\n\n.selection-drawer__item {\n  padding: 0.38rem;\n  display: grid;\n  grid-template-columns: 5.5rem minmax(0, 1fr) auto;\n  gap: 0.45rem;\n  align-items: start;\n  border-radius: 1.18rem;\n  box-shadow:\n    0 0 0 1px rgba(55, 62, 67, 0.06),\n    var(--shadow-1);\n  transition:\n    box-shadow 140ms ease,\n    transform 140ms ease;\n}\n\n.selection-drawer__poster {\n  --poster-gradient: linear-gradient(160deg, #dde6ef 0%, #9eb1c3 100%);\n  --poster-image: none;\n  min-height: 7.35rem;\n  display: flex;\n  align-items: flex-end;\n  padding: 0.42rem;\n  border-radius: 0.98rem;\n  background:\n    linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(12, 18, 24, 0.2)),\n    linear-gradient(180deg, transparent 56%, rgba(10, 17, 24, 0.5) 100%),\n    var(--poster-image),\n    var(--poster-gradient);\n  background-size: cover;\n  background-position: center;\n  color: rgba(255, 255, 255, 0.96);\n  box-shadow:\n    inset 0 1px 0 rgba(255, 255, 255, 0.18),\n    0 0 0 1px rgba(55, 62, 67, 0.08);\n}\n\n.selection-drawer__poster span {\n  font-size: 0.8rem;\n  line-height: 1.08;\n  font-weight: var(--font-weight-semibold);\n}\n\n.selection-drawer__meta {\n  display: grid;\n  gap: 0.14rem;\n  padding-top: 0.06rem;\n  min-width: 0;\n}\n\n.selection-drawer__item:hover {\n  transform: translateY(-1px);\n  box-shadow:\n    0 0 0 1px rgba(163, 69, 164, 0.1),\n    var(--shadow-2);\n}\n\n@media (min-width: 1081px) and (max-height: 820px) {\n  .movie-selection-preview {\n    padding-block: 1.2rem 2rem;\n  }\n\n  .movie-selection-preview__header {\n    gap: 1rem;\n  }\n\n  .movie-selection-preview__topbar,\n  .search-shell {\n    min-height: 3.35rem;\n  }\n\n  .movie-selection-preview__title-block {\n    width: min(100%, 37rem);\n  }\n\n  .movie-selection-preview__title-block h1 {\n    font-size: 2.15rem;\n    line-height: 1.22;\n  }\n\n  .selection-step {\n    width: 2.75rem;\n    height: 2.7rem;\n  }\n\n  .chip-row__viewport {\n    padding-block: 0.32rem;\n  }\n\n  .filter-pill {\n    min-height: 2.4rem;\n  }\n\n  .movie-selection-preview__main {\n    padding-bottom: 5.35rem;\n  }\n}\n\n@media (max-width: 1240px) {\n  .movie-selection-preview__frame {\n    --content-width: calc((var(--card-width) * 3) + 2.7rem);\n  }\n\n  .movie-grid {\n    grid-template-columns: repeat(3, var(--card-width));\n  }\n}\n\n@media (max-width: 1080px) {\n  .movie-selection-preview__frame {\n    width: min(100%, 60rem);\n  }\n\n  .movie-selection-preview__topbar {\n    grid-template-columns: 1fr;\n    justify-items: center;\n    gap: 1rem;\n  }\n\n  .search-shell,\n  .selection-meter {\n    grid-column: auto;\n    justify-self: center;\n  }\n\n  .search-shell {\n    width: min(100%, 22.5rem);\n  }\n\n  .chip-row {\n    width: 100%;\n  }\n\n  .movie-selection-preview__content {\n    display: block;\n  }\n\n  .movie-selection-preview__main {\n    width: auto;\n  }\n\n  .movie-grid {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .movie-selection-preview__limit-hint,\n  .movie-selection-preview__cta {\n    left: 50%;\n  }\n}\n\n@media (max-width: 720px) {\n  .movie-selection-preview {\n    padding-inline: 1rem;\n    padding-block: 2rem 2.5rem;\n  }\n\n  .movie-selection-preview__title-block h1 {\n    font-size: clamp(2rem, 8vw, 2.625rem);\n  }\n\n  .search-shell {\n    width: 100%;\n  }\n\n  .selection-step {\n    width: 2.85rem;\n    height: 2.8rem;\n  }\n\n  .movie-selection-preview__main {\n    padding-bottom: 7rem;\n  }\n\n  .movie-grid {\n    grid-template-columns: 1fr;\n  }\n\n  .movie-selection-preview__limit-hint {\n    width: min(calc(100vw - 2rem), 24rem);\n    bottom: 5.8rem;\n    border-radius: 1rem;\n    text-align: center;\n  }\n\n  .selection-drawer-trigger {\n    right: 1rem;\n    bottom: 1rem;\n  }\n\n  .selection-drawer {\n    top: 0.5rem;\n    right: 0.5rem;\n    bottom: 0.5rem;\n    width: calc(100vw - 1rem);\n    min-width: 0;\n    border-radius: 1.45rem;\n    border-right: 1px solid var(--color-border);\n  }\n\n  .selection-drawer__header {\n    align-items: center;\n  }\n\n  .selection-drawer__item {\n    grid-template-columns: 5.45rem minmax(0, 1fr) auto;\n  }\n\n  .selection-drawer__poster {\n    min-height: 7.7rem;\n  }\n}\n"] }]
    }], () => [], { handleEscapeKey: [{
            type: HostListener,
            args: ['document:keydown.escape']
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(MovieSelectionPage, { className: "MovieSelectionPage", filePath: "src/app/features/movie-selection/movie-selection.page.ts", lineNumber: 92 }); })();
