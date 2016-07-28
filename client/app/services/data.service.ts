import {
    Injectable
}
from '@angular/core';
import {
    Http
}
from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()

export class DataService {
    constructor(private http: Http) {}

    processData(raw_data) {
        const dates = raw_data.dates,
            metaDefs = raw_data.meta_definitions,
            cpMetaDefs = raw_data.cp_meta_definitions;
        let stocks = dates[0].oids,
            futureDates = dates.map((date) => date.ymd);
        futureDates.splice(0, 1); //remove current date from future_dates
        metaDefs.splice(0, 1); //remove id from metaDefs

        //add closing prices for the future dates;
        for (let stock of stocks) {
            const id = stock.id,
                close = stock.c;
            let closes = [];
            for (let ymd of futureDates) {
                const oid = dates.find((date) => date.ymd === ymd).oids.find((oid) => oid.id === id),
                    futureClose = oid ? oid.c : 'NA',
                    change = (!isNaN(close) && close !== 0 && !isNaN(futureClose)) ?
                    `${(((futureClose - close)/close)*100).toFixed(1)}%` :
                    'NA'

                closes.push({
                    ymd,
                    "close": futureClose,
                    change
                });
            }
            stock.closes = closes;
        }

        /*//aggregate cp data;
        let cpCloses = ;
        
        for (let cp of cpMetaDefs) {

            for (let date of dates) {
                const cpReturn = date.cp[cp.sid];
                if (!isNaN(cpReturn)) {
                    cpCloses.push(cpReturn);
                }
            }
        }*/

        return [stocks, metaDefs, futureDates];
    }

    getData(query = '') {
        return this.http.get(`../edp-api-v3a.php?m=${query}`).map(response => {
            return response.json();
        }).map(data => this.processData(data));
    }
    modifySpread(stocks, futureDates, spread) {
        const dollarSpread = spread / 100;

        for (let stock of stocks) {
            const close = stock.c,
                oldCloses = stock.closes;
            let newCloses = [];
            for (let ymd of futureDates) {
                let date = oldCloses.find(date => date.ymd === ymd);
                if (!isNaN(date.close) && !isNaN(close) && (close + dollarSpread) > 0) {
                    const modifiedClose = close + dollarSpread,
                        modifiedFutureClose = Math.max(date.close - dollarSpread, 0);
                    const change = `${(((modifiedFutureClose - modifiedClose)/modifiedClose)*100).toFixed(1)}%`;
                    date.change = change;
                }
                newCloses.push(date);
            }
            stock.closes = newCloses;
        }
        return stocks
    }
}
