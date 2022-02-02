import { Injectable } from '@angular/core';
import { MessageService } from 'primeng';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  error(detail: string, summary: string) {
    this.messageService.add({ severity: 'error', summary, detail });
  }
  success(detail: string, summary: string) {
    this.messageService.add({ severity: 'success', summary, detail });
  }
  warn(detail: string, summary: string) {
    this.messageService.add({ severity: 'warn', summary, detail });
  }
  info(detail: string, summary: string) {
    this.messageService.add({ severity: 'info', summary, detail });
  }
}
