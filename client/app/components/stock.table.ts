import {
    Component,
    Input
}
from '@angular/core';

//import MatchPipe, which matches future dates to closing prices
import {
    MatchPipe
}
from '../pipes/match.pipe';

//import SortPipe, which ranks stocks in descending order according to metric selected by user
import {
    SortPipe
}
from '../pipes/sort.pipe';

//import PercentPipe, which formats decimal data

import {
    CustomPercentPipe
}
from '../pipes/custom-percent.pipe';

//import MetricPipe, which returns the metadefinitons that are metrics
import {
    MetricPipe
}
from '../pipes/metric.pipe';

//import QuantileService

import {
    QuantileService
}
from '../services/quantile.service';

@Component({
    selector: 'stock-table',
    templateUrl: './templates/stock.table.html',
    styleUrls: ['./css/stock.table.css'],
    pipes: [MatchPipe, SortPipe, CustomPercentPipe, MetricPipe]
})

export class StockTable {
    @Input() stocks
    @Input() metaDefs
    @Input() futureDates
    @Input() limit
    selection = null
    stockAverages = {}
    metricAverages = {}
    quartilesDates = {}
    quartilesStockAvg = []
    quartilesMetricAvg = []
    constructor(private _quantileService: QuantileService) {

    }
    set(event, sid) {
        event.preventDefault();
        this.selection = sid;
    }
    averageByStock(stock) {
        let sum = 0,
            count = 0;
        for (let date of stock.closes) {
            const change = parseFloat(date.change)
            if (!isNaN(change)) {
                sum += change;
                count++;
            }
        }
        return sum / count;
    }
    averageByMetric(metaDef) {
        const sid = metaDef.sid;
        let stocks = this.stocks;
        if (sid !== 'n' && sid !== 't') {
            stocks.sort((s1, s2) => {
                const a = s1[sid],
                    b = s2[sid];

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
            let sum = 0,
                count = 0;
            for (let stock of stocks) {
                const avg = this.stockAverages[stock.id];
                if (!isNaN(avg)) {
                    sum += avg;
                    count++;
                }
            }
            return sum / count;
        }
        else {
            return null
        }
    }
    colorByQuartile(el, quartiles) {
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
    }
    colorDates(stock, ymd) {
        let change = stock.closes.find((date) => date.ymd === ymd).change;
        const quartiles = this.quartilesDates[ymd];
        change = (change === 'NA') ? change : parseFloat(change);
        return this.colorByQuartile(change, quartiles);
    }

    colorStockAvg(stock) {
        const id = stock.id,
            avg = this.stockAverages[id],
            quartiles = this.quartilesStockAvg;
        return this.colorByQuartile(avg, quartiles);
    }
    colorMetricAvg(metaDef) {
        const sid = metaDef.sid,
            avg = this.metricAverages[sid],
            quartiles = this.quartilesMetricAvg;
        if (this.selection === metaDef.sid) {
            return 'highlight';
        }
        else {
            return this.colorByQuartile(avg, quartiles);
        }
    }

    ngOnChanges(changes) {
        this.stockAverages = {};
        this.metricAverages = {};
        for (let stock of this.stocks) {
            this.stockAverages[stock.id] = this.averageByStock(stock);
        }
        for (let metaDef of this.metaDefs) {
            this.metricAverages[metaDef.sid] = this.averageByMetric(metaDef);
        }
        this.quartilesDates = this._quantileService.quartilesDates(this.stocks, this.futureDates);
        this.quartilesStockAvg = this._quantileService.quartilesStockAvg(this.stockAverages);
        this.quartilesMetricAvg = this._quantileService.quartilesMetricAvg(this.metricAverages);

    }
}