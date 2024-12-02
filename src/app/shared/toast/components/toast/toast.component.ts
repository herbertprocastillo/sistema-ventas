import {Component, TemplateRef} from '@angular/core';
import {NgbToast} from '@ng-bootstrap/ng-bootstrap';
import {NgClass, NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {ToastService} from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    NgbToast,
    NgClass,
    NgIf,
    NgTemplateOutlet,
    NgForOf
  ],
  templateUrl: './toast.component.html',
  host: { 'class': 'toast-container position-fixed top-0 end-0 p-3', 'style': 'z-index: 1200;' },
  styleUrl: './toast.component.scss'

})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  isTemplate(toast: any): toast is TemplateRef<any> {
    return toast instanceof TemplateRef;
  }
}
