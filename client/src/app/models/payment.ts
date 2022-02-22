export class Payment {
    public constructor(
        public _id?: string,
        public amount?: number,
        public loanID?: string,
        public cardId?: string,
        public reason?: string,
        public userID?: number,
        public date?: Date,
        public status?:string,
        public type?:string,
        public by?:string,
        public payType?:string
        ){
    }
}