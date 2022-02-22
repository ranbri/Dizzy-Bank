export class Message {
    public constructor(
        public _id?: string,
        public body?: string,
        public adminID?: string,
        public userID?: string,
        public title?: string,
        public date?: string,
        public hour?: string,
        public status?: string,
        public sender?: string,
        public from?:string,
        public to?:string

    ) { }
}