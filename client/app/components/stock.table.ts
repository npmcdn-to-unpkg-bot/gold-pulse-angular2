import {
    Component,
    Input
}
from '@angular/core';


@Component({
    selector: 'stock-table',
    templateUrl: './templates/stock.table.html'
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