"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var match_pipe_1 = require('../pipes/match.pipe');
var sort_pipe_1 = require('../pipes/sort.pipe');
var StockTable = (function () {
    function StockTable() {
        this.selection = null;
    }
    StockTable.prototype.set = function (event, sid) {
        event.preventDefault();
        this.selection = sid;
    };
    StockTable.prototype.ngOnChanges = function () { };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], StockTable.prototype, "stocks", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], StockTable.prototype, "metaDefs", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], StockTable.prototype, "futureDates", void 0);
    StockTable = __decorate([
        core_1.Component({
            selector: 'stock-table',
            templateUrl: './templates/stock.table.html',
            styleUrls: ['./css/stock.table.css'],
            pipes: [match_pipe_1.MatchPipe, sort_pipe_1.SortPipe]
        }), 
        __metadata('design:paramtypes', [])
    ], StockTable);
    return StockTable;
}());
exports.StockTable = StockTable;
//# sourceMappingURL=stock.table.js.map