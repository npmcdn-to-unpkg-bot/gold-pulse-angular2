import * as _ from 'lodash';

import {
    ApiDate
}
from '../interfaces/api-date';

export class Stock {
    closes: Array < any > ;
    id: string;
    c: number;
    constructor(oids: any) {
        _.assign(this, oids);
    }
    setCloses(futureDates: string[], dates: ApiDate[]): void {
        /* Method to assign a closing price and a percentage change
         * relative to stock.close for each future date
         */
        let closes = [];
        for (let ymd of futureDates) {
            const id = this.id;
            const close = this.c;
            const oid = dates.find(date => date.ymd === ymd).oids.find(oid => oid.id === id);
            const futureClose = oid ? oid.c : 'NA';
            const change = (!isNaN(close) && close !== 0 && !isNaN(futureClose)) ?
                `${(((futureClose - close)/close)*100).toFixed(1)}%` :
                'NA';

            closes.push({
                ymd,
                close: futureClose,
                change
            });
        }
        this.closes = closes;
    }
    modifySpread(futureDates: string[], spread: number): void {
        /* Method to adjust the spread */
        const dollarSpread = spread / 100;
        const close = this.c;
        const oldCloses = this.closes;

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
        this.closes = newCloses;
    }
    meanReturn() {
        /* Method to calculate the mean return of a stock over this.returns array */
        //const returns = _.filter(this.closes, day => !isNaN(parseFloat(day.change)));
        //return (returns.length) ? _.meanBy(returns, day => parseFloat(day.change)) : null;
        let sum = 0,
            count = 0;
        for (let day of this.closes) {
            const change = parseFloat(day.change)
            if (!isNaN(change)) {
                sum += change;
                count++;
            }
        }
        return sum / count;

    }
}