import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-google-btn',
  templateUrl: './google-btn.component.html',
  styleUrls: ['./google-btn.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class GoogleBtnComponent implements OnInit {
  @Output() clickMe = new EventEmitter<void>();

  handleClick() {
    this.clickMe.emit();
  }
  constructor() {}

  ngOnInit() {}
}
