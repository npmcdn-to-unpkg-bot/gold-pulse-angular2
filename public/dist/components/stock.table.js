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
var custom_percent_pipe_1 = require('../pipes/custom-percent.pipe');
var metric_pipe_1 = require('../pipes/metric.pipe');
var quantile_service_1 = require('../services/quantile.service');
var StockTable = (function () {
    function StockTable(_quantileService) {
        this._quantileService = _quantileService;
        this.selection = null;
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
    StockTable.prototype.averageByStock = function (stock) {
        var sum = 0, count = 0;
        for (var _i = 0, _a = stock.closes; _i < _a.length; _i++) {
            var date = _a[_i];
            var change = parseFloat(date.change);
            if (!isNaN(change)) {
                sum += change;
                count++;
            }
        }
        return sum / count;
    };
    StockTable.prototype.averageByMetric = function (metaDef) {
        var sid = metaDef.sid;
        var stocks = this.stocks;
        if (sid !== 'n' && sid !== 't') {
            stocks.sort(function (s1, s2) {
                var a = s1[sid], b = s2[sid];
                if (a < b) {
                    return 1;
                }
                else if (a > b) {
                    return -1;
                }
                else {
                    return 0;
                }
            });
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
        if (this.selection === metaDef.sid) {
            return 'highlight';
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
            this.stockAverages[stock.id] = this.averageByStock(stock);
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
    ], StockTable.prototype, "futureDates", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], StockTable.prototype, "limit", void 0);
    StockTable = __decorate([
        core_1.Component({
            selector: 'stock-table',
            templateUrl: './templates/stock.table.html',
            styleUrls: ['./css/stock.table.css'],
            pipes: [match_pipe_1.MatchPipe, sort_pipe_1.SortPipe, custom_percent_pipe_1.CustomPercentPipe, metric_pipe_1.MetricPipe]
        }), 
        __metadata('design:paramtypes', [quantile_service_1.QuantileService])
    ], StockTable);
    return StockTable;
}());
exports.StockTable = StockTable;
//# sourceMappingURL=stock.table.js.map