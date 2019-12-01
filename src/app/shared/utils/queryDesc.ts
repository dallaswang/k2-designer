export enum QueryDecOrderBySortTypes {
    Asc = 1,
    Desc = 2
}

export enum QueryDecOperatorTypes {
    Equal = 1,
    NotEqual = 2,
    GreaterThan = 3,
    GreaterThanOrEqual = 4,
    LessThan = 5,
    LessThanOrEqual = 6,
    StartsWith = 16,
    EndsWith = 17,
    Contains = 18,
}

export enum QueryDescAppendTypes {
    And,
    Or,
    Not
}

class Paging {
    P: number;
    Ps: number;
    Ts: number;
    Tps: number;
    constructor(p: number, ps: number, ts: number, tps: number) {
        this.P = p;
        this.Ps = ps;
        this.Ts = ts;
        this.Tps = tps;
    }
}

class OrderBy {
    Fld: string;
    Sort: QueryDecOrderBySortTypes;
    ThenBy: OrderBy;

    constructor(fld: any, orderby: QueryDecOrderBySortTypes, thenby: OrderBy) {
        this.Fld = fld;
        this.Sort = orderby;
        this.ThenBy = thenby;
    }
}

class Field {
    _t: string;
    Name: string;

    constructor(name: string) {
        this._t = 'Fld';
        this.Name = name;
    }
}

class Constant {
    _t: string;
    Val: string | number;

    constructor(val: string | number) {
        this._t = 'Const';
        this.Val = val;
    }
}

class ArrayConstant {
    _t: string;
    Val: string | number;
    constructor(val: string | number) {
        this._t = 'ArrConst';
        this.Val = val;
    }
}

class BinaryOpFilter {
    _t: string;
    FOF: any;
    Arg: any;
    Op: any;
    constructor(fof: any, arg: any, op: any) {
        this._t = 'BinOp';
        this.FOF = fof;
        this.Arg = arg;
        this.Op = op;
    }
}

class RefOpFilter {
    _t: string;
    FOF1: any;
    FOF2: any;
    Op: any;

    constructor(fof1: any, fof2: any, op: any) {
        this._t = 'RefOp';
        this.FOF1 = fof1;
        this.FOF2 = fof2;
        this.Op = op;
    }
}

class InOpFilter {
    _t: string;
    FOF: any;
    Arg: any;

    constructor(fof: any, arg: any) {
        this._t = 'InOp';
        this.FOF = fof;
        this.Arg = arg;
    }
}

class TriOpFilter {
    _t: string;
    FOF: any;
    Arg1: any;
    Arg2: any;

    constructor(fof: any, arg1: any, arg2: any) {
        this._t = 'TriOp';
        this.FOF = fof;
        this.Arg1 = arg1;
        this.Arg2 = arg2;
    }
}

class AndOpFilter {
    _t: string;
    Arg1: any;
    Arg2: any;

    constructor(arg1: any, arg2: any) {
        this._t = 'And';
        this.Arg1 = arg1;
        this.Arg2 = arg2;
    }
}

class OrOpFilter {
    _t: string;
    Arg1: any;
    Arg2: any;

    constructor(arg1: any, arg2: any) {
        this._t = 'Or';
        this.Arg1 = arg1;
        this.Arg2 = arg2;
    }
}

class NotOpFilter {
    _t: string;
    Arg: any;

    constructor(arg: any) {
        this._t = 'Not';
        this.Arg = arg;
    }
}

class UnknownFilter {
    _t?: string;
    FOF?: any;
    Op?: any;
    Arg?: any;
    Arg1?: any;
    Arg2?: any;
    constructor() { }
}

export declare type KnownFilter = BinaryOpFilter | RefOpFilter | InOpFilter | TriOpFilter | AndOpFilter | OrOpFilter | NotOpFilter;
export declare type FilterDesc = KnownFilter | UnknownFilter;

export interface IQueryDesc {
    Paging: Paging;
    Filter: FilterDesc;
    OrderBy: OrderBy;
    // Operators: OperatorTypes;
    // binFilter(field: any, op: any, val: any): BinaryOpFilter;
    // buildQuery(queryDesc: QueryDesc): QueryDesc;
    // orderBy(field: any, asc: any, thenby: any): OrderBy;
    // paging(page: number, pageSize: number): Paging;
}

/**
* Generate query description
* 
* @class QueryDesc
*/
export class QueryDesc implements IQueryDesc {
    Paging: Paging;
    Filter: FilterDesc;
    OrderBy: OrderBy;
    constructor() {
    }

    appendFilter(filter: FilterDesc, type: QueryDescAppendTypes = QueryDescAppendTypes.And) {
        if (!this.Filter) {
            this.Filter = filter;
        } else {
            switch (type) {
                case QueryDescAppendTypes.And:
                    this.Filter = QueryDesc.and(filter, this.Filter)
                    break;
                case QueryDescAppendTypes.Or:
                    this.Filter = QueryDesc.or(filter, this.Filter)
                    break;
                case QueryDescAppendTypes.Not:
                    this.Filter = QueryDesc.not(filter)
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Build Filter expressions
     * 
     * @param {*} field  Filter Field
     * @param {*} op Operator
     * @param {*} val Value
     * @returns 
     * 
     * @memberOf QueryDesc
     */
    static binFilter(field: any, op: any, val: any): BinaryOpFilter {
        return new BinaryOpFilter(new Field(field), new Constant(val), op);
    }

    static buildQuery(queryDesc: QueryDesc) {
        var desc = new QueryDesc();
        if (queryDesc.Filter)
            desc.Filter = queryDesc.Filter;
        if (queryDesc.OrderBy)
            desc.OrderBy = queryDesc.OrderBy;
        if (queryDesc.Paging)
            desc.Paging = queryDesc.Paging;
        return desc;
    }

    static and(arg1: any, arg2: any) {
        return new AndOpFilter(arg1, arg2);
    }

    static or(arg1: any, arg2: any) {
        return new OrOpFilter(arg1, arg2);
    }

    static not(arg: any) {
        return new NotOpFilter(arg);
    }

    static refFilter(field1: any, op: any, field2: any) {
        return new RefOpFilter(new Field(field1), new Field(field2), op);
    }

    static inFilter(field: any, val: any) {
        return new InOpFilter(new Field(field), new ArrayConstant(val));
    }

    static betweenFilter(field: any, val1: any, val2: any) {
        return new TriOpFilter(new Field(field), new Constant(val1), new Constant(val2));
    }

    static orderBy(field: any, asc?: any, thenby?: OrderBy) {
        if (asc === undefined || asc === null || asc)
            return new OrderBy(field, QueryDecOrderBySortTypes.Asc, thenby);
        else
            return new OrderBy(field, QueryDecOrderBySortTypes.Desc, thenby);
    }

    static paging(page: number, pageSize: number) {
        return new Paging(page, pageSize, 0, 0);
    }
}

