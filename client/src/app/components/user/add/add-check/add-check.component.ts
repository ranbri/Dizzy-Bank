import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { User } from 'src/app/models/user';
import { GetChecks } from 'src/app/redux/user-store/actions';
import { PaycheckService } from 'src/app/services/paycheck.service';
import { MoneyMoveComponent } from '../../money-move/money-move.component';

@Component({
  selector: 'app-add-check',
  templateUrl: './add-check.component.html',
  styleUrls: ['./add-check.component.scss']
})
export class AddCheckComponent implements OnInit {
  loading:any = document.getElementById('loading');
  public checkFormGroup!: FormGroup;
  constructor(
    private paycheckService: PaycheckService,
    private moneyMoveComponent: MoneyMoveComponent,
    private store: Store,
  ) { }

  public addCheck() {
    
    let addedCheck = this.checkFormGroup.value;
    let user: User | any;
    this.store.select(state => state.user.user).subscribe(resUser => { user = resUser })
    addedCheck['userID'] = user._id;
    addedCheck['status'] = "pending";
    addedCheck['year'] = "202" + addedCheck['year'];
    addedCheck['date'] = addedCheck['year'] + "/" + addedCheck['month'];
    let dateAdded = new Date().toLocaleDateString();
    addedCheck['dateAdded'] = dateAdded;
    delete addedCheck['month'];
    delete addedCheck['year'];

    let paySub = this.paycheckService.addPaycheck(addedCheck)
      .subscribe(async () => {
        this.store.dispatch(GetChecks)
        paySub.unsubscribe();
        try {
          await this.moneyMoveComponent.findChecks();
        } finally {
          alert("Check deposite has been submitted successfully and will be reviewed by an admin.");
          this.moneyMoveComponent.loading.style.display = 'none';
        }
      })
  }

  ngOnInit(): void {
    this.checkFormGroup = new FormGroup({
      name: new FormControl(),
      bankNumber: new FormControl(),
      year: new FormControl(),
      month: new FormControl(),
      amount: new FormControl()
    });
  }

}
