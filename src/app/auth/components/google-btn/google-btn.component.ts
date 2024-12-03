import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-google-btn',
  templateUrl: './google-btn.component.html',
  styleUrls: ['./google-btn.component.scss'],
  standalone: true,
  imports: [IonButton, CommonModule],
})
export class GoogleBtnComponent implements OnInit {
  @Output() clickMe = new EventEmitter<void>();

  handleClick() {
    this.clickMe.emit();
  }
  constructor() { }

  ngOnInit() { }
}
