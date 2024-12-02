import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonApp, IonContent, IonRouterOutlet } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsideBarComponent } from './components/aside-bar/aside-bar.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonRouterOutlet,
    IonContent,
    IonApp,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AsideBarComponent,
    HeaderComponent,
  ],
})
export class AppComponent {
  constructor() {}
}
