import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ToastComponent} from './shared/toast/components/toast/toast.component';
import {NavbarComponent} from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sistema-ventas';
}
