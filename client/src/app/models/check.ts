export class Check {
    public constructor(
        public _id?: string,
        public userID?: string,
        public name?: string,
        public bankNumber?: number,
        public amount?: number,
        public date?: string,
        public dateAdded?: string,
        public dateApproved?: string,
        public usedDate?: string,
        public status?: string
    ) {
    }
}