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
var sort_pipe_1 = require('../pipes/sort.pipe');
var threshold_pipe_1 = require('../pipes/threshold.pipe');
var quantile_service_1 = require('../services/quantile.service');
var constants_1 = require('../constants');
var StockTable = (function () {
    function StockTable(_quantileService) {
        this._quantileService = _quantileService;
        this.selection = constants_1.defaultSelection;
        this.stockAverages = {};
        this.metricAverages = {};
        this.quartilesDates = {};
        this.quartilesStockAvg = [];
        this.quartilesMetricAvg = [];
    }
    StockTable.prototype.set = function (event, sid) {
        event.preventDefault();
        this.selection = sid;
    };
    StockTable.prototype.averageByMetric = function (metaDef) {
        var sid = metaDef.sid;
        var stocks = this.stocks.slice();
        if (stocks.filter(function (stock) { return stock[sid] === undefined; }).length === stocks.length) {
            return null;
        }
        if (this.thresholds.length) {
            stocks = new threshold_pipe_1.ThresholdPipe().transform(stocks, this.thresholds);
            console.log(stocks);
        }
        if (sid !== 'n' && sid !== 't') {
            stocks = new sort_pipe_1.SortPipe().transform(stocks, sid, this.metaDefs);
            stocks = stocks.slice(0, this.limit);
            var sum = 0, count = 0;
            for (var _i = 0, stocks_1 = stocks; _i < stocks_1.length; _i++) {
                var stock = stocks_1[_i];
                var avg = this.stockAverages[stock.id];
                if (!isNaN(avg)) {
                    sum += avg;
                    count++;
                }
            }
            return sum / count;
        }
        else {
            return null;
        }
    };
    StockTable.prototype.colorByQuartile = function (el, quartiles) {
        if (isNaN(el)) {
            return null;
        }
        else if (el <= quartiles[1]) {
            return 'red';
        }
        else if (el <= quartiles[2]) {
            return 'yellow';
        }
        else if (el <= quartiles[3]) {
            return 'blue';
        }
        else {
            return 'green';
        }
    };
    StockTable.prototype.colorDates = function (stock, ymd) {
        var change = stock.closes.find(function (date) { return date.ymd === ymd; }).change;
        var quartiles = this.quartilesDates[ymd];
        change = (change === 'NA') ? change : parseFloat(change);
        return this.colorByQuartile(change, quartiles);
    };
    StockTable.prototype.colorStockAvg = function (stock) {
        var id = stock.id, avg = this.stockAverages[id], quartiles = this.quartilesStockAvg;
        return this.colorByQuartile(avg, quartiles);
    };
    StockTable.prototype.colorMetricAvg = function (metaDef) {
        var sid = metaDef.sid, avg = this.metricAverages[sid], quartiles = this.quartilesMetricAvg;
        if (this.limit === this.stocks.length || avg === null) {
            return null;
        }
        else {
            return this.colorByQuartile(avg, quartiles);
        }
    };
    StockTable.prototype.ngOnChanges = function (changes) {
        this.stockAverages = {};
        this.metricAverages = {};
        for (var _i = 0, _a = this.stocks; _i < _a.length; _i++) {
            var stock = _a[_i];
            this.stockAverages[stock.id] = stock.meanReturn();
        }
        for (var _b = 0, _c = this.metaDefs; _b < _c.length; _b++) {
            var metaDef = _c[_b];
            this.metricAverages[metaDef.sid] = this.averageByMetric(metaDef);
        }
        this.quartilesDates = this._quantileService.quartilesDates(this.stocks, this.futureDates);
        this.quartilesStockAvg = this._quantileService.quartilesStockAvg(this.stockAverages);
        this.quartilesMetricAvg = this._quantileService.quartilesMetricAvg(this.metricAverages);
    };
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
    ], StockTable.prototype, "currentDate", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], StockTable.prototype, "futureDates", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], StockTable.prototype, "cpMetaDefs", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], StockTable.prototype, "benchmarks", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], StockTable.prototype, "limit", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], StockTable.prototype, "spread", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], StockTable.prototype, "thresholds", void 0);
    StockTable = __decorate([
        core_1.Component({
            selector: 'stock-table',
            templateUrl: './templates/stock.table.html',
            styleUrls: ['./css/stock.table.css'],
        }), 
        __metadata('design:paramtypes', [quantile_service_1.QuantileService])
    ], StockTable);
    return StockTable;
}());
exports.StockTable = StockTable;
//# sourceMappingURL=stock.table.js.map