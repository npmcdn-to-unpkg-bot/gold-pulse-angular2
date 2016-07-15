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

//import services
import {
  DataService
}
from '../services/data.service';

@Component({
  selector: 'exploration-viewer',
  templateUrl: './templates/exploration.viewer.html',
  directives: [StockTable],
  providers: [HTTP_PROVIDERS, DataService]
})
export class ExplorationViewer {
  constructor(private _dataService: DataService) {

  }
  currentDate = '2014-01-02'
  stocks = []
  metaDefs = []
  futureDates = []

  ngOnInit() {
    this._dataService.getData().subscribe((processedData) => {
      [this.stocks, this.metaDefs, this.futureDates] = processedData;
    });
  }
}