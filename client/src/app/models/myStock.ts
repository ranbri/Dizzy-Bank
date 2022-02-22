export class MyStock {
    public constructor(
        public _id?:string,
        public symbol?: string,
        public name?: string,
        public userID?: string,
        public cardID?: number,
        public ask?: number,
        public size?: number,
        public total?: number,
    ) {
    }
}