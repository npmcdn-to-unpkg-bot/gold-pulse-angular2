import {
    Injectable
}
from '@angular/core';
import * as d3 from "d3";

@Injectable()
export class QuantileService {
    getQuartiles(arr) {
        arr.sort((el1, el2) => el1 - el2);
        let quartiles = [];
        for (let i = 0; i <= 1; i += 0.25) {
            quartiles.push(d3.quantile(arr, i));
        }
        return quartiles;
    }
    quartilesStockAvg(returns) {
        let arr = [];
        const ids = Object.keys(returns);
        for (let id of ids) {
            const stockReturn = returns[id];
            if (!isNaN(stockReturn)) {
                arr.push(stockReturn);
            }
        }
        return this.getQuartiles(arr);
    }
    quartilesMetricAvg(returns) {
        let arr = [];
        const sids = Object.keys(returns);
        for (let sid of sids) {
            const metricReturn = returns[sid];
            if (metricReturn !== null && !isNaN(metricReturn)) {
                arr.push(metricReturn);
            }
        }
        return this.getQuartiles(arr);
    }
    quartilesDates(stocks, futureDates) {
        //Create object to store an array of quartiles for each ymd;
        let quartilesByDate = {};

        //Get quartiles for each ymd
        for (let ymd of futureDates) {
            let changes = [];

            //Collect the changes for each with data on ymd
            for (let stock of stocks) {
                const change = stock.closes.find((date) => date.ymd === ymd).change;
                if (change !== 'NA') {
                    changes.push(parseFloat(change));
                }
            }

            quartilesByDate[ymd] = this.getQuartiles(changes);
        }
        return quartilesByDate;
    }

}