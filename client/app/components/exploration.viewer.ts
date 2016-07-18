import {
  Component
}
from '@angular/core';
import {
  HTTP_PROVIDERS
}
from '@angular/http';

//import subcomponents (directives)
import {
  StockTable
}
from './stock.table';
import {
  DateComponent
}
from './date.component';

//import services
import {
  DataService
}
from '../services/data.service';
import {
  DateService
}
from '../services/date.service';

@Component({
  selector: 'exploration-viewer',
  templateUrl: './templates/exploration.viewer.html',
  directives: [StockTable, DateComponent],
  providers: [HTTP_PROVIDERS, DataService, DateService]
})
export class ExplorationViewer {
  constructor(private _dataService: DataService) {

  }
  currentDate = '2014-01-02'
  stocks = []
  metaDefs = []
  futureDates = []
  update(event) {
    this.currentDate = event;
    console.log(event);
    this._dataService.getData(event).subscribe((processedData) => {
      [this.stocks, this.metaDefs, this.futureDates] = processedData;
      console.log(this.stocks);
    });
  }
  ngOnInit() {
    this._dataService.getData().subscribe((processedData) => {
      [this.stocks, this.metaDefs, this.futureDates] = processedData;
    });
  }

}