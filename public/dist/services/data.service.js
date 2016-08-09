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
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var DataService = (function () {
    function DataService(http) {
        this.http = http;
    }
    DataService.prototype._buildBenchmarks = function (cpMetaDefs, futureDates, dates) {
        var benchmarks = dates[0].cp;
        var _loop_1 = function(cpMetaDef) {
            var close_1 = benchmarks[cpMetaDef.sid];
            if (!isNaN(close_1) && close_1 > 0) {
                var futureCloses = [];
                var _loop_2 = function(ymd) {
                    var cp = dates.find(function (date) { return date.ymd === ymd; }).cp, futureClose = cp[cpMetaDef.sid];
                    if (!isNaN(futureClose)) {
                        futureCloses.push(futureClose);
                    }
                };
                for (var _i = 0, futureDates_1 = futureDates; _i < futureDates_1.length; _i++) {
                    var ymd = futureDates_1[_i];
                    _loop_2(ymd);
                }
                var futureReturns = futureCloses.map(function (fclose) { return (fclose - close_1) / close_1; }), avg = futureReturns.reduce(function (sum, cur) { return sum + cur; }, 0) / futureReturns.length, formattedAvg = (avg * 100).toFixed(1);
                benchmarks[cpMetaDef.sid] = isNaN(parseFloat(formattedAvg)) ? null : formattedAvg + "%";
            }
        };
        for (var _a = 0, cpMetaDefs_1 = cpMetaDefs; _a < cpMetaDefs_1.length; _a++) {
            var cpMetaDef = cpMetaDefs_1[_a];
            _loop_1(cpMetaDef);
        }
        return benchmarks;
    };
    DataService.prototype._processData = function (raw_data) {
        var dates = raw_data.dates, metaDefs = raw_data.meta_definitions, cpMetaDefs = raw_data.cp_meta_definitions;
        var stocks = dates[0].oids, futureDates = dates.map(function (date) { return date.ymd; });
        futureDates.splice(0, 1);
        metaDefs.splice(0, 1);
        console.log(futureDates);
        var _loop_3 = function(stock) {
            var id = stock.id, close_2 = stock.c;
            var closes = [];
            var _loop_4 = function(ymd) {
                var oid = dates.find(function (date) { return date.ymd === ymd; }).oids.find(function (oid) { return oid.id === id; }), futureClose = oid ? oid.c : 'NA', change = (!isNaN(close_2) && close_2 !== 0 && !isNaN(futureClose)) ?
                    (((futureClose - close_2) / close_2) * 100).toFixed(1) + "%" :
                    'NA';
                closes.push({
                    ymd: ymd,
                    "close": futureClose,
                    change: change
                });
            };
            for (var _i = 0, futureDates_2 = futureDates; _i < futureDates_2.length; _i++) {
                var ymd = futureDates_2[_i];
                _loop_4(ymd);
            }
            stock.closes = closes;
        };
        for (var _a = 0, stocks_1 = stocks; _a < stocks_1.length; _a++) {
            var stock = stocks_1[_a];
            _loop_3(stock);
        }
        var benchmarks = this._buildBenchmarks(cpMetaDefs, futureDates, dates);
        return [stocks, metaDefs, futureDates, cpMetaDefs, benchmarks];
    };
    DataService.prototype.getData = function (ymd, hp) {
        var _this = this;
        if (ymd === void 0) { ymd = ''; }
        if (hp === void 0) { hp = 63; }
        return this.http.get("../edp-api-v3a.php?m=" + ymd + "&hp=" + hp)
            .map(function (response) { return response.json(); })
            .map(function (data) { return _this._processData(data); });
    };
    DataService.prototype.modifySpread = function (stocks, futureDates, spread) {
        var dollarSpread = spread / 100;
        for (var _i = 0, stocks_2 = stocks; _i < stocks_2.length; _i++) {
            var stock = stocks_2[_i];
            var close_3 = stock.c, oldCloses = stock.closes;
            var newCloses = [];
            var _loop_5 = function(ymd) {
                var date = oldCloses.find(function (date) { return date.ymd === ymd; });
                if (!isNaN(date.close) && !isNaN(close_3) && (close_3 + dollarSpread) > 0) {
                    var modifiedClose = close_3 + dollarSpread, modifiedFutureClose = Math.max(date.close - dollarSpread, 0);
                    var change = (((modifiedFutureClose - modifiedClose) / modifiedClose) * 100).toFixed(1) + "%";
                    date.change = change;
                }
                newCloses.push(date);
            };
            for (var _a = 0, futureDates_3 = futureDates; _a < futureDates_3.length; _a++) {
                var ymd = futureDates_3[_a];
                _loop_5(ymd);
            }
            stock.closes = newCloses;
        }
        return stocks;
    };
    DataService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], DataService);
    return DataService;
}());
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map