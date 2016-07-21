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
    stockAverages = {};
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
                const avg = this.averageByStock(stock);
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
    }


    ngOnChanges(changes) {
        if (changes.stocks) {
            for (let stock of this.stocks) {
                this.stockAverages[stock.id] = this.averageByStock(stock);
            }
        }
    }
}