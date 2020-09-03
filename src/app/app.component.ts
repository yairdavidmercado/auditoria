import { Component } from '@angular/core';
import { StoreService } from "../app/services/store.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'apptools';
  constructor( public _storeServises: StoreService){
    
  }
}
