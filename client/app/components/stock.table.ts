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

//import PercentPipe, which formats percent data

import {
    CustomPercentPipe
}
from '../pipes/custom-percent.pipe';

// import FormatPipe, which formats decimal data
import {
    FormatPipe
}
from '../pipes/format.pipe';

//import MetricPipe, which returns the metadefinitons that are metrics
import {
    MetricPipe
}
from '../pipes/metric.pipe';

/* ThresholdPipe filters stocks based on the thresholds*/
import {
    ThresholdPipe
}
from '../pipes/threshold.pipe';
//import QuantileService

import {
    QuantileService
}
from '../services/quantile.service';

//Initialization constants
import {
    defaultSelection
}
from '../constants';

@Component({
    selector: 'stock-table',
    templateUrl: './templates/stock.table.html',
    styleUrls: ['./css/stock.table.css'],
    pipes: [MatchPipe, SortPipe, CustomPercentPipe, MetricPipe, FormatPipe, ThresholdPipe]
})

export class StockTable {
    @Input() stocks
    @Input() metaDefs
    @Input() currentDate
    @Input() futureDates
    @Input() cpMetaDefs
    @Input() benchmarks
    @Input() limit
    @Input() spread
    @Input() thresholds
    selection = defaultSelection
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
        let stocks = this.stocks.slice();
        /*Reality check to ensure at least one stock has a value for the metric*/
        if (stocks.filter(stock => stock[sid] === undefined).length === stocks.length) {
            return null;
        }
        /* Apply ThresholdPipe */
        if (this.thresholds.length) {
            stocks = new ThresholdPipe().transform(stocks, this.thresholds);
            console.log(stocks);
        }
        /* Apply the sort and limit pipes */
        if (sid !== 'n' && sid !== 't') {
            stocks = new SortPipe().transform(stocks, sid, this.metaDefs);

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

        if (this.limit === this.stocks.length || avg === null) {
            return null;
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