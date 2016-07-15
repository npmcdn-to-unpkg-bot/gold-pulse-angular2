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

        //add closing prices for the future dates;
        for (let stock of stocks) {
            const id = stock.id;
            let closes = [];
            for (let ymd of futureDates) {
                const oid = dates.find((date) => date.ymd === ymd).oids.find((oid) => oid.id === id),
                    close = oid ? oid.c : "NA";

                closes.push({
                    ymd,
                    close
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
