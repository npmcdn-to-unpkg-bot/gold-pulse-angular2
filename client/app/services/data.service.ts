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
            metaDefs = raw_data.meta_definitions;
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
        return [stocks, metaDefs, futureDates];
    }

    getData(query = '') {
        console.log('...retrieving data from GoldMinerPulse API');
        return this.http.get(`../edp-api-v3a.php?m=${query}`).map(response => {
            return response.json();
        }).map(data => this.processData(data));
    }
}
