import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  date: Number;
  constructor() { }

  ngOnInit() {
    this.date=new Date().getFullYear();
  }

}
