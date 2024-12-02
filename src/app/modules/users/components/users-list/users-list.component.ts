import {Component, EventEmitter, Output} from '@angular/core';
import {AsyncPipe, SlicePipe} from '@angular/common';
import {NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {User as AppUser} from '../../interfaces/user';
import {Observable} from 'rxjs';
import {AuthService} from '../../../auth/services/auth.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [NgbPagination, SlicePipe, AsyncPipe],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent {
  @Output() userEdit = new EventEmitter<AppUser>();
  users$: Observable<AppUser[]>;
  page: number = 1;
  pageSize: number = 10;

  constructor(private authService: AuthService) {
    this.users$ = this.authService.getAllUsers();
  }

  getUserEdit(user: AppUser) {
    this.userEdit.emit(user);
  }
}
