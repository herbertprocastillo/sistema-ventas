import {Component} from '@angular/core';
import {NavbarComponent} from '../../../../shared/components/navbar/navbar.component';
import {User as AppUser} from '../../interfaces/user';
import {RouterLink} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {UsersEditComponent} from '../users-edit/users-edit.component';
import {UsersNewComponent} from '../users-new/users-new.component';
import {UsersListComponent} from '../users-list/users-list.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterLink,
    ReactiveFormsModule,
    UsersEditComponent,
    UsersNewComponent,
    UsersListComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  public userToEdit: AppUser | null = null;

  getUserEdit(user: AppUser): void {
    this.userToEdit = user;
  }

  getCancel(cancel: boolean): void {
    if (cancel) {
      this.userToEdit = null;
    }
  }
}
