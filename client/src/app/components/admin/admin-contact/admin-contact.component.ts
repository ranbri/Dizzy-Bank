import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-admin-contact',
  templateUrl: './admin-contact.component.html',
  styleUrls: ['./admin-contact.component.scss']
})
export class AdminContactComponent implements OnInit {
  @ViewChild("errorMessage", { read: ElementRef, static: true })
  errorMessage!: ElementRef;

  public newMessage!: FormGroup;
  public admin: User = new User;
  public users: User[] = [];
  public message: Message = new Message;
  public messages: Message[] = [];
  public selectedUser: User = new User;
  public messageBol: boolean = true;
  constructor(
    private messagesService: MessagesService,
    private adminService: AdminService,
    private store: Store,


  ) { }

  ngOnInit(): void {
    this.store.select(state => state.user)
      .subscribe(user => {
        if (user.user._id) {
          if (user.messages.length) {
            this.messages = user.messages;
          }
          this.admin = user.user;
        }
      })
    let loading: any = document.getElementById('loading');
    loading.style.display = "block";
    this.newMessage = new FormGroup({
      title: new FormControl(),
      body: new FormControl(),
      select: new FormControl()
    })
    let userSelect: HTMLElement | any = document.getElementById('userSelect');
    this.adminService.getAllUser()
      .subscribe(users => {
        if (users.length > 0) {
          this.users = users;
          users.forEach((user: User) => {
            let fullName = user.firstName + " " + user.lastName;
            let option: HTMLElement | any = document.createElement('option');
            option.value = user._id;
            option.innerHTML = `<option value="">${fullName}</option>`
            userSelect.append(option);
          })
        }
        loading.style.display = "none";
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
  public sendMessage() {
    let loading: any = document.getElementById('loading');
    loading.style.display = "block";
    let selectValue: any = document.getElementById('userSelect');
    let admin: User;
    for (admin of this.users) {
      if (admin._id === selectValue.value) {
        this.selectedUser = admin;
        this.message = {
          userID: this.selectedUser._id,
          adminID: this.admin._id,
          title: this.newMessage.controls['title'].value,
          body: this.newMessage.controls['body'].value,
          status: "pending",
          date: new Date().toLocaleDateString(),
          hour: new Date().getHours().toString() + ":" + new Date().getMinutes().toString(),
          sender: "Admin",
          from: this.admin.firstName + " " + this.admin.lastName,
          to: this.selectedUser.firstName + " " + this.selectedUser.lastName,

        }
        this.messagesService.sendMessage(this.message).subscribe(() => {
          loading.style.display = "none";
          alert(`Message sent to ${this.selectedUser.firstName + " " + this.selectedUser.lastName}`)
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
