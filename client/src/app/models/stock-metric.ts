export class Stock {
    public constructor(
        public date?: Date | any,
        public open?: number,
        public high?: number,
        public low?: number,
        public close?: number,
        public adjClose?: number,
        public volume?: number,
        public symbol?: string
    ) {
    }
}

export class StockDetail {
    public constructor(
        public bid?: number,
        public ask?: number,
        public quoteSourceName?: string,
        public currencySymbol?: string,
    ) {
    }
}
export class StockPrice {
    public constructor(
        public shortName?: string,
        public currency?: string,
        public quoteSourceName?: string,
        public currencySymbol?: string,
    ) {}
}

export class FullStock {
    public constructor(
        public price : StockPrice,
        public detail : StockDetail
    ){}
}