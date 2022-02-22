export class Card {
    public constructor(
        public _id?:string,
        public cardNumber?: string,
        public userID?: string,
        public expYear?: number,
        public expMonth?: number,
        public provider?: string,
        public monthlyLimit?: number,
        public remainedLimit?: string,
        public status?: string,
        public dateAdded?: string,
        public dateApproved?: string,
        public usedCredit?:number
    ) {
    }
}