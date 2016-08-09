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
var constants_1 = require('../constants');
var stock_table_1 = require('./stock.table');
var date_component_1 = require('./date.component');
var data_service_1 = require('../services/data.service');
var date_service_1 = require('../services/date.service');
var quantile_service_1 = require('../services/quantile.service');
var shorten_pipe_1 = require('../pipes/shorten.pipe');
var ExplorationViewer = (function () {
    function ExplorationViewer(_dataService) {
        this._dataService = _dataService;
        this.currentDate = constants_1.start;
        this.hp = constants_1.hp;
        this.stocks = [];
        this.metaDefs = [];
        this.futureDates = [];
        this.cpMetaDefs = [];
        this.benchmarks = {};
        this.limit = constants_1.limit;
        this.limitOptions = constants_1.limitOptions;
        this.spread = constants_1.spread;
        this.spreadOptions = constants_1.spreadOptions;
    }
    ExplorationViewer.prototype.update = function (event) {
        var _this = this;
        if (isNaN(event)) {
            this.currentDate = event;
        }
        else {
            this.hp = event;
        }
        this._dataService.getData(this.currentDate, this.hp).subscribe(function (processedData) {
            _this.stocks = processedData[0], _this.metaDefs = processedData[1], _this.futureDates = processedData[2], _this.cpMetaDefs = processedData[3], _this.benchmarks = processedData[4];
            if (_this.limit > _this.stocks.length || _this.limitOptions.indexOf(_this.limit) === -1) {
                _this.limit = _this.stocks.length;
            }
            if (_this.spread !== 0) {
                _this.modifySpread(_this.spread);
            }
        });
    };
    ExplorationViewer.prototype.modifySpread = function (event) {
        this.spread = event;
        this.stocks = this._dataService.modifySpread(this.stocks, this.futureDates, this.spread);
    };
    ExplorationViewer.prototype.ngOnInit = function () {
        var _this = this;
        this._dataService.getData(this.currentDate).subscribe(function (processedData) {
            _this.stocks = processedData[0], _this.metaDefs = processedData[1], _this.futureDates = processedData[2], _this.cpMetaDefs = processedData[3], _this.benchmarks = processedData[4];
        });
    };
    ExplorationViewer = __decorate([
        core_1.Component({
            selector: 'exploration-viewer',
            templateUrl: './templates/exploration.viewer.html',
            styleUrls: ['./css/exploration.viewer.css'],
            directives: [stock_table_1.StockTable, date_component_1.DateComponent],
            pipes: [shorten_pipe_1.ShortenPipe],
            providers: [http_1.HTTP_PROVIDERS, data_service_1.DataService, date_service_1.DateService, quantile_service_1.QuantileService]
        }), 
        __metadata('design:paramtypes', [data_service_1.DataService])
    ], ExplorationViewer);
    return ExplorationViewer;
}());
exports.ExplorationViewer = ExplorationViewer;
//# sourceMappingURL=exploration.viewer.js.map