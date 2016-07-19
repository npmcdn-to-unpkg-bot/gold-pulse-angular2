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
var stock_table_1 = require('./stock.table');
var date_component_1 = require('./date.component');
var data_service_1 = require('../services/data.service');
var date_service_1 = require('../services/date.service');
var ExplorationViewer = (function () {
    function ExplorationViewer(_dataService) {
        this._dataService = _dataService;
        this.currentDate = '2014-01-02';
        this.stocks = [];
        this.metaDefs = [];
        this.futureDates = [];
        this.limit = 25;
    }
    ExplorationViewer.prototype.update = function (event) {
        var _this = this;
        this.currentDate = event;
        console.log(event);
        this._dataService.getData(event).subscribe(function (processedData) {
            _this.stocks = processedData[0], _this.metaDefs = processedData[1], _this.futureDates = processedData[2];
            console.log(_this.stocks);
        });
    };
    ExplorationViewer.prototype.ngOnInit = function () {
        var _this = this;
        this._dataService.getData().subscribe(function (processedData) {
            _this.stocks = processedData[0], _this.metaDefs = processedData[1], _this.futureDates = processedData[2];
        });
    };
    ExplorationViewer = __decorate([
        core_1.Component({
            selector: 'exploration-viewer',
            templateUrl: './templates/exploration.viewer.html',
            directives: [stock_table_1.StockTable, date_component_1.DateComponent],
            providers: [http_1.HTTP_PROVIDERS, data_service_1.DataService, date_service_1.DateService]
        }), 
        __metadata('design:paramtypes', [data_service_1.DataService])
    ], ExplorationViewer);
    return ExplorationViewer;
}());
exports.ExplorationViewer = ExplorationViewer;
//# sourceMappingURL=exploration.viewer.js.map