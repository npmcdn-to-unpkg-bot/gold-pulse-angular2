import {
    Pipe,
    PipeTransform
}
from '@angular/core';

@Pipe({
    name: 'sort',
    pure: false
})
export class SortPipe implements PipeTransform {
    transform(stocks, args) {
        const sid = args,
            alpha = (sid === 'n' || sid === 't') ? 1 : -1;

        //If sid refers to name or ticker, sort in descending order; otherwise, sort in ascending order.
        //Hence the need for alpha.

        if (stocks && stocks.length && sid) {
            stocks.sort((s1, s2) => {
                const a = s1[sid],
                    b = s2[sid];

                if (a < b) {
                    return -1 * alpha;
                }
                else if (a > b) {
                    return 1 * alpha;
                }
                else {
                    return 0;
                }
            });
        }
        return stocks;
    }
}