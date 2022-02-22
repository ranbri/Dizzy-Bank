export class Loan {
    public constructor(
        public years?: number,
        public interestRate?: string,
        public totalAmount?: number,
        public remainingAmount?: number,
        public payPerMonth?: number,
        public minBalance?:number,
        public minCreditScore?:number,
        public fulfilled?: boolean,
        public _id?: string,
        public userID?:string,
        public dateAdded?:string,
        public dateApproved?:string,
        public status?:string
    ) {
    }
}