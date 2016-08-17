"use strict";
var _ = require('lodash');
var Stock = (function () {
    function Stock(oids) {
        _.assign(this, oids);
    }
    Stock.prototype.setCloses = function (futureDates, dates) {
        var closes = [];
        var _loop_1 = function(ymd) {
            var id = this_1.id;
            var close_1 = this_1.c;
            var oid = dates.find(function (date) { return date.ymd === ymd; }).oids.find(function (oid) { return oid.id === id; });
            var futureClose = oid ? oid.c : 'NA';
            var change = (!isNaN(close_1) && close_1 !== 0 && !isNaN(futureClose)) ?
                (((futureClose - close_1) / close_1) * 100).toFixed(1) + "%" :
                'NA';
            closes.push({
                ymd: ymd,
                close: futureClose,
                change: change
            });
        };
        var this_1 = this;
        for (var _i = 0, futureDates_1 = futureDates; _i < futureDates_1.length; _i++) {
            var ymd = futureDates_1[_i];
            _loop_1(ymd);
        }
        this.closes = closes;
    };
    Stock.prototype.modifySpread = function (futureDates, spread) {
        var dollarSpread = spread / 100;
        var close = this.c;
        var oldCloses = this.closes;
        var newCloses = [];
        var _loop_2 = function(ymd) {
            var date = oldCloses.find(function (date) { return date.ymd === ymd; });
            if (!isNaN(date.close) && !isNaN(close) && (close + dollarSpread) > 0) {
                var modifiedClose = close + dollarSpread, modifiedFutureClose = Math.max(date.close - dollarSpread, 0);
                var change = (((modifiedFutureClose - modifiedClose) / modifiedClose) * 100).toFixed(1) + "%";
                date.change = change;
            }
            newCloses.push(date);
        };
        for (var _i = 0, futureDates_2 = futureDates; _i < futureDates_2.length; _i++) {
            var ymd = futureDates_2[_i];
            _loop_2(ymd);
        }
        this.closes = newCloses;
    };
    Stock.prototype.meanReturn = function () {
        var sum = 0, count = 0;
        for (var _i = 0, _a = this.closes; _i < _a.length; _i++) {
            var day = _a[_i];
            var change = parseFloat(day.change);
            if (!isNaN(change)) {
                sum += change;
                count++;
            }
        }
        return sum / count;
    };
    return Stock;
}());
exports.Stock = Stock;
//# sourceMappingURL=stock.js.map