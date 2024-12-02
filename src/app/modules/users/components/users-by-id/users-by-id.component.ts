import {Component, inject, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {User as AppUser} from '../../interfaces/user';
import {UserService} from '../../services/user.service';
import {AsyncPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-users-by-id',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './users-by-id.component.html',
  styleUrl: './users-by-id.component.scss'
})
export class UsersByIdComponent implements OnInit {
  /** IO **/
  @Input() userId: string | undefined;
  /** injects **/
  private userService = inject(UserService);
  /** variables **/
  user$: Observable<AppUser> | undefined;

  ngOnInit(): void {
    if (this.userId) {
      this.user$ = this.userService.getUserById(this.userId);
    }
  }
}
