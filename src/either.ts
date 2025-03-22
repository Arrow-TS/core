
export abstract class Either<out L, out R>{

    protected abstract get():L|R

    mapLeft<S>(mapper: (l: L) => S): Either<S, R>
    mapLeft<S>(mapper: (l: L) => Promise<S>):Promise<Either<S, R>>
    mapLeft<S>(mapper: ((l: L) => S)|((l: L) => Promise<S>)): Either<S, R>|Promise<Either<S, R>>{
        return this as unknown as Either<S, R>;
    }

    map<S>(mapper: (r: R) => S): Either<L, S>
    map<S>(mapper: (r: R) => Promise<S>):Promise<Either<L, S>>
    map<S>(mapper: ((r: R) => S)|((r: R) => Promise<S>)): Either<L, S>|Promise<Either<L, S>>{
        return this as unknown as Either<L, S>;
    }

    unwrap():Left<L>|Right<R>{
        return this as unknown as Left<L>|Right<R>
    }

    onRight(handler: ((r: R) => void)|((r: R) => Promise<void>)):void|Promise<void>{};

    onLeft(handler: ((l: L) => void)|((l: L) => Promise<void>)):void|Promise<void>{};

    getOrDefault(r:R): R{
        return (this.mapLeft(()=>r) as unknown as Either<R, R>).get();
    }

    getOrElse(handler:(l:L)=>never): R{
        return (this.mapLeft((l)=>handler(l))as unknown as Either<never, R>).get()
    }

    getOrNull(): R|null{
        return (this.mapLeft(()=>null) as unknown as Either<null, R>).get();
    }

    flatMap<S>(r: (r: R) => Either<L, S>): Either<L, S>
    flatMap<S>(r: (r: R) => Promise<Either<L, S>>):Promise<Either<L, S>>
    flatMap<S>(r: ((r: R) => Promise<Either<L, S>>)|((r: R) => Either<L, S>)): Either<L, S>|Promise<Either<L, S>>{
        return this.fold(()=> this as unknown as Promise<Either<L, S>>, (data)=> r(data))
    }

    flatMapLeft<S>(l: (l: L) => Either<S, R>): Either<S, R>
    flatMapLeft<S>(l: (l: L) => Promise<Either<S, R>>):Promise<Either<S, R>>
    flatMapLeft<S>(l: ((l: L) => Promise<Either<S, R>>)|((l: L) => Either<S,R>)): Either<S, R>|Promise<Either<S, R>>{
        return this.fold((data)=> l(data), ()=> this as unknown as Promise<Either<S, R>>)
    }

    abstract fold<S>(left: (l:L)=>S, right: (l:R)=>S): S
    abstract fold<S>(left: (l:L)=>Promise<S>, right: (l:R)=>S): Promise<S>
    abstract fold<S>(left: (l:L)=>S, right: (l:R)=>Promise<S>): Promise<S>
    abstract fold<S>(left: (l:L)=>Promise<S>, right: (l:R)=>Promise<S>): Promise<S>

    merge():L|R{
        return this.get()
    }

}

export function left<T>(val:T):Either<T,never>{
    return new Left<T>(val)
}

export class Left<out L> extends Either<L, never>{
    constructor(val: L) {
        super()
        this.val = val;
    }
    readonly val: L;

    [Symbol.toPrimitive](hint:'string'|'number'|'default') {
        if (hint === "number") {
            return NaN;
        }
        if (hint === "string") {
            return toString()
        }
        return toString()
    }

    toString() {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `Left(${this.val})`;
    }

    mapLeft<S>(mapper: (l: L) => S): Either<S, never>
    mapLeft<S>(mapper: (l: L) => Promise<S>): Promise<Either<S, never>>
    mapLeft<S>(mapper: ((l: L) => S)|((l: L) => Promise<S>)): Either<S, never>|Promise<Either<S, never>> {
        const response = mapper(this.val)
        if (response instanceof Promise) {
            return response.then((it)=>  new Left(it))
        }
        return new Left(response);
    }

    onLeft(handler: ((l: L) => void)|((l: L) => Promise<void>)):void|Promise<void>{
        return handler(this.val);
    }
    protected get(): L {
        return this.val;
    }

    fold<S>(left: (l: L) => Promise<S>, _:never): Promise<S> {
        return left(this.val);
    }

    isLeft():this is Left<L>{
        return true
    }

    isRight():this is Right<never>{
        return false
    }

}

export function right<T>(val:T):Either<never,T>{
    return new Right<T>(val)
}

export class Right<out R> extends Either<never, R> {

    constructor(val: R) {
        super()
        this.val = val;
    }
    readonly val: R;

    [Symbol.toPrimitive](hint:'string'|'number'|'default') {
        if (hint === "number") {
            return NaN;
        }
        if (hint === "string") {
            return toString();
        }
        return toString();
    }

    toString() {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        return `Right(${this.val})`;
    }

    map<S>(r: (r: R) => S): Either<never,S>
    map<S>(r: (r: R) => Promise<S>):Promise<Either<never,S>>
    map<S>(mapper: ((r: R) => S)|((r: R) => Promise<S>)): Either<never,S> | Promise<Either<never,S>>{
        const response = mapper(this.val)
        if (response instanceof Promise) {
            return response.then((it)=>  new Right(it))
        }
        return new Right(response);
    }

    onRight(handler: ((r: R) => void)|((r: R) => Promise<void>)):void|Promise<void>{
       return handler(this.val);
    }

    protected get(): R {
        return this.val;
    }

    fold<S>(_: never, right: (r: R) => Promise<S>): Promise<S> {
        return right(this.val);
    }

    isLeft():this is Left<never>{
        return false
    }

    isRight():this is Right<R>{
        return true
    }
}

