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
var _ = require('lodash');
var ThresholdPipe = (function () {
    function ThresholdPipe() {
    }
    ThresholdPipe.prototype.transform = function (stocks, thresholds) {
        var copy = stocks.slice();
        var _loop_1 = function(threshold) {
            var sid = threshold.sid;
            var val = threshold.val;
            var sign = threshold.sign;
            switch (sign) {
                case 'gt':
                    _.remove(copy, function (stock) { return stock[sid] < val; });
                    break;
                case 'lt':
                    _.remove(copy, function (stock) { return stock[sid] > val; });
                    break;
                case 'eq':
                    _.remove(copy, function (stock) { return stock[sid] !== val; });
            }
        };
        for (var _i = 0, thresholds_1 = thresholds; _i < thresholds_1.length; _i++) {
            var threshold = thresholds_1[_i];
            _loop_1(threshold);
        }
        return copy;
    };
    ThresholdPipe = __decorate([
        core_1.Pipe({
            name: 'threshold',
            pure: false
        }), 
        __metadata('design:paramtypes', [])
    ], ThresholdPipe);
    return ThresholdPipe;
}());
exports.ThresholdPipe = ThresholdPipe;
//# sourceMappingURL=threshold.pipe.js.map