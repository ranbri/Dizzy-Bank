import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-contact',
  templateUrl: './user-contact.component.html',
  styleUrls: ['./user-contact.component.scss']
})
export class UserContactComponent implements OnInit {
  @ViewChild("errorMessage", { read: ElementRef, static: true })
  errorMessage!: ElementRef;

  public newMessage!: FormGroup;
  public admins: User[] = [];
  public user: User = new User;
  public message: Message = new Message;
  public messages: Message[] = [];
  public selectedAdmin: User = new User;
  public messageBol: boolean = true;
  constructor(
    private messagesService: MessagesService,
    private store: Store,

  ) { }
  ngOnInit(): void {
    this.validateMessage();

    this.newMessage = new FormGroup({
      title: new FormControl(),
      body: new FormControl(),
      select: new FormControl()
    })
    this.store.select(state => state.user)
      .subscribe(user => {
        if (user.user.email) {
          this.getMessages(user.user._id);
          this.user = user.user;
        }
      })


    let loading: any = document.getElementById('loadingSpinner');
    this.messagesService.getAllAdmins()
      .subscribe(admins => {
        let adminSelect: any = document.getElementById('adminSelect');
        if (admins.length > 0) {
          this.admins = admins;
          admins.forEach((admin: User) => {
            let fullName = admin.firstName + " " + admin.lastName;
            let option: HTMLElement | any = document.createElement('option');
            option.value = admin._id;
            option.innerHTML = `<option value="${admin._id}">${fullName}</option>`
            adminSelect.append(option);
            loading.style.display = "none";
          })
        }
      })
  }


  public validateMessage() {
    let title: any = document.getElementById('title');
    let body: any = document.getElementById('body');
    if (body.value && title.value) {
      if (body.value.length > 10 && title.value.length > 3) {
        this.messageBol = false;
      } else {
        this.messageBol = true;
      }
      if (body.value.length < 10) {
        body.style.border = "1px solid red";
      } else {
        body.style.border = "1px solid lightgray";
      }
      if (title.value.length < 3) {
        title.style.border = "1px solid red";
      } else {
        title.style.border = "1px solid lightgray";
      }
    } else {
      this.messageBol = true;
    }
  }
  public getMessages(id: string) {
    let loading: any = document.getElementById('loadingSpinner');
    if (loading) {
      loading.style.display = "block";
    }
    this.messagesService.getMessagesByUserId(id || "")
      .subscribe(messages => {
        this.messages = messages;
        if (messages.length == 0) {
          this.errorMessage.nativeElement.style.display = "block";
          if (loading) {
            loading.style.display = 'none';
          }
        }
      })
  }

  public sendMessage() {
    let loading: any = document.getElementById('loading');
    loading.style.display = "block";
    let selectValue: any = document.getElementById('adminSelect');
    let admin: User;
    for (admin of this.admins) {
      if (admin._id === selectValue.value) {
        this.selectedAdmin = admin;
        this.message = {
          userID: this.user._id,
          adminID: this.selectedAdmin._id,
          title: this.newMessage.controls['title'].value,
          body: this.newMessage.controls['body'].value,
          status: "pending",
          date: new Date().toLocaleDateString(),
          hour: new Date().getHours().toString() + ":" + new Date().getMinutes().toString(),
          sender: "User",
          from: this.user.firstName + " " + this.user.lastName,
          to: this.selectedAdmin.firstName + " " + this.selectedAdmin.lastName
        }
        this.messagesService.sendMessage(this.message).subscribe(() => {
          loading.style.display = "none";
          alert(`Message sent to ${this.selectedAdmin.firstName + " " + this.selectedAdmin.lastName}`)
          let title: any = document.getElementById('title');
          let body: any = document.getElementById('body');
          title.value = "";
          body.value = "";
          this.ngOnInit();
        });
      }
    }
  }
  public sendRead(_id: any) {
    let readBtn: any = document.getElementById(`readBtn-${_id}`);
    let read: any = document.getElementById(`readText-${_id}`);
    let btnLoader: any = document.getElementById(`btnLoader-${_id}`);
    read.innerHTML = "";
    btnLoader.style.display = "block";
    this.messagesService.sendRead(_id).subscribe(() => {
      btnLoader.style.display = "none";
      readBtn.innerHTML = "✔";
      readBtn.classList.add('readTrue');
      setTimeout(() => { readBtn.style.display = "none"; }, 1000);
    }, err => { console.log(err) })
  }
}
