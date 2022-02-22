import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { GetMessages } from 'src/app/redux/user-store/actions';
import { AdminService } from 'src/app/services/admin.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {
  public messages: Message[] = [];
  public messageBol: boolean = true;
  public pendingMessages: number = 0;
  constructor(
    private store: Store,
    private adminService: AdminService,
    private messagesService: MessagesService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.store.select(state => state.user)
      .subscribe(user => {
        if (user.user.isAdmin) {
          this.getMessages(user.user._id || "");
          if (user.user.isAdmin !== true) {
            this.router.navigate(['/NiceTry']);
          }
        }
      })
  }
  public getMessages(id: string) {
    let notification: any = document.getElementById('notification');
    this.messagesService.getMessagesByAdminId(id || "")
      .subscribe((messages: Message[]) => {
        this.messages = messages;
        if (this.messages.length > 0) {
          if (this.messageBol) {
            this.store.dispatch(new GetMessages(messages))
            this.messageBol = false;
            this.messages.forEach((message: Message) => {
              if (message.status === 'pending' && message.sender == 'User') {

                this.pendingMessages = ++this.pendingMessages;
              }
              if (this.pendingMessages > 0) {
                notification.style.display = ' block';
                notification.innerHTML = this.pendingMessages;
              } else {
                notification.style.display = ' none';
              }
            });
          }
        } else {
          notification.style.display = "none";
        }
      })
  }
}
