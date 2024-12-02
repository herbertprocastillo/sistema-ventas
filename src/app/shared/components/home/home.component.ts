import {Component, inject} from '@angular/core';
import {NavbarComponent} from '../navbar/navbar.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  /** injects **/
  private router = inject(Router);
  
  /** variables **/
  public listModules = [
    {name: "Punto de venta", url: "/pos", icon: "fa-solid fa-cash-register"},
    {name: "Ventas", url: "/sales", icon: "fa-solid fa-chart-line"},
    {name: "Productos", url: "/products", icon: "fa-solid fa-candy-cane"},
    {name: "Almacen", url: "/warehouse", icon: "fa-solid fa-warehouse"},
    {name: "Compras", url: "/purchasing", icon: "fa-solid fa-cart-shopping"},
    {name: "Clientes", url: "/customers", icon: "fa-solid fa-users"},
    {name: "Usuarios", url: "/users", icon: "fa-regular fa-address-card"},
  ];

  async goModule(url: string) {
    await this.router.navigate([url]);
  }
}
