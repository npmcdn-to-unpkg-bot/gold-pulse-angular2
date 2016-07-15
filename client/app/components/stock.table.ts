import {
    Component,
    Input
}
from '@angular/core';

//import Match pipe, which matches future dates to closing prices
import { MatchPipe } from '../pipes/match.pipe';

@Component({
    selector: 'stock-table',
    templateUrl: './templates/stock.table.html',
    pipes: [MatchPipe]
})

export class StockTable {
    @Input() stocks
    @Input() metaDefs
    @Input() futureDates
    ngOnChanges() {
        console.log(this.stocks);
        console.log(this.metaDefs);
        console.log(this.futureDates);
    }
}