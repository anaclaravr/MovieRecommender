import { __decorate } from "tslib";
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
let App = class App {
};
App = __decorate([
    Component({
        selector: 'app-root',
        imports: [ButtonModule],
        templateUrl: './app.html',
        styleUrl: './app.scss'
    })
], App);
export { App };
