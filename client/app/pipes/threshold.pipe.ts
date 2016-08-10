import {
    Pipe,
    PipeTransform
}
from '@angular/core';

import * as _ from 'lodash';

@Pipe({
    name: 'threshold',
    pure: false
})

export class ThresholdPipe implements PipeTransform {
    transform(stocks, thresholds) {
        let copy = stocks;

        for (let threshold of thresholds) {
            const sid = threshold.sid;
            const val = threshold.val;
            const sign = threshold.sign;
            switch (sign) {
                case 'gt':
                    _.remove(copy, stock => stock[sid] < val);
                    break;
                case 'lt':
                    _.remove(copy, stock => stock[sid] > val);
                    break;
                case 'eq':
                    _.remove(copy, stock => stock[sid] !== val);
            }
        }
        
        return copy;
    }
}