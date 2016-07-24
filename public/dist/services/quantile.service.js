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
var d3 = require("d3");
var QuantileService = (function () {
    function QuantileService() {
    }
    QuantileService.prototype.getQuartiles = function (arr) {
        arr.sort(function (el1, el2) { return el1 - el2; });
        var quartiles = [];
        for (var i = 0; i <= 1; i += 0.25) {
            quartiles.push(d3.quantile(arr, i));
        }
        return quartiles;
    };
    QuantileService.prototype.quartilesStockAvg = function (returns) {
        var arr = [];
        var ids = Object.keys(returns);
        for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
            var id = ids_1[_i];
            var stockReturn = returns[id];
            if (!isNaN(stockReturn)) {
                arr.push(stockReturn);
            }
        }
        return this.getQuartiles(arr);
    };
    QuantileService.prototype.quartilesMetricAvg = function (returns) {
        var arr = [];
        var sids = Object.keys(returns);
        for (var _i = 0, sids_1 = sids; _i < sids_1.length; _i++) {
            var sid = sids_1[_i];
            var metricReturn = returns[sid];
            if (metricReturn !== null && !isNaN(metricReturn)) {
                arr.push(metricReturn);
            }
        }
        return this.getQuartiles(arr);
    };
    QuantileService.prototype.quartilesDates = function (stocks, futureDates) {
        var quartilesByDate = {};
        var _loop_1 = function(ymd) {
            var changes = [];
            for (var _i = 0, stocks_1 = stocks; _i < stocks_1.length; _i++) {
                var stock = stocks_1[_i];
                var change = stock.closes.find(function (date) { return date.ymd === ymd; }).change;
                if (change !== 'NA') {
                    changes.push(parseFloat(change));
                }
            }
            quartilesByDate[ymd] = this_1.getQuartiles(changes);
        };
        var this_1 = this;
        for (var _a = 0, futureDates_1 = futureDates; _a < futureDates_1.length; _a++) {
            var ymd = futureDates_1[_a];
            _loop_1(ymd);
        }
        return quartilesByDate;
    };
    QuantileService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], QuantileService);
    return QuantileService;
}());
exports.QuantileService = QuantileService;
//# sourceMappingURL=quantile.service.js.map