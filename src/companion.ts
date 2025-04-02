import { NonEmptyReadOnlyArray } from "./types";
import { Either, left, right } from "./either";
import { isNotEmpty } from "./util";

export function ensureExists<T,L>(val:T|null|undefined,l:L):Either<L,T>{
    if (val === null || typeof val == "undefined") {
        return left(l)
    }
    return right(val)
}

export function ensureContains<T,L>(val:T[]|null|undefined,searchVal:T,l:L):Either<L,T>{
    if (val === null || typeof val == "undefined") {
        return left(l)
    }
    if(!val.includes(searchVal)){
        return left(l)
    }
    return right(searchVal)
}

function zipOrAccumulateInternal <L,A extends any[],B>(
    argA:Either<NonEmptyReadOnlyArray<L>,A>, argB:Either<L,B>
):Either<NonEmptyReadOnlyArray<L>,[...A,B]>{
    return argA.fold(
        (lA)=> argB.fold<Either<NonEmptyReadOnlyArray<L>,[...A,B]>>(lB=>left([...lA,lB]), _=>  left([...lA])),
        (rA)=> argB.fold<Either<NonEmptyReadOnlyArray<L>,[...A,B]>>(lB=>left([lB]), rB=>  right([...rA,rB] ))
    )
}

export function zipOrAccumulate <L,A,B>(
    argA:Either<L,A>, argB:Either<L,B>
):Either<NonEmptyReadOnlyArray<L>,[A,B]>
export function zipOrAccumulate <L,A,B,C>(
    argA:Either<L,A>, argB:Either<L,B>, argC:Either<L,C>
):Either<NonEmptyReadOnlyArray<L>,[A,B,C]>
export function zipOrAccumulate <L,A,B,C,D>(
    argA:Either<L,A>, argB:Either<L,B>, argC:Either<L,C>, argD:Either<L,D>
):Either<NonEmptyReadOnlyArray<L>,[A,B,C,D]>
export function zipOrAccumulate <L,A,B,C,D,E>(
    argA:Either<L,A>, argB:Either<L,B>, argC:Either<L,C>, argD:Either<L,D>, argE: Either<L,E>
):Either<NonEmptyReadOnlyArray<L>,[A,B,C,D,E]>
export function zipOrAccumulate <L,A,B,C,D,E,F>(
    argA:Either<L,A>, argB:Either<L,B>, argC:Either<L,C>, argD:Either<L,D>, argE: Either<L,E>, argF: Either<L,F>
):Either<NonEmptyReadOnlyArray<L>,[A,B,C,D,E,F]>
export function zipOrAccumulate <L,A,B,C,D,E,F,G>(
    argA:Either<L,A>, argB:Either<L,B>, argC:Either<L,C>, argD:Either<L,D>, argE: Either<L,E>, argF: Either<L,F>,
    argG: Either<L,G>
):Either<NonEmptyReadOnlyArray<L>,[A,B,C,D,E,F,G]>
export function zipOrAccumulate <L,A,B,C,D,E,F,G>(
    argA:Either<L,A>, argB:Either<L,B>, argC?:Either<L,C>, argD?:Either<L,D>, argE?: Either<L,E>, argF?: Either<L,F>,
    argG?: Either<L,G>
):Either<NonEmptyReadOnlyArray<L>,[A,B]|[A,B,C]|[A,B,C,D]|[A,B,C,D,E]|[A,B,C,D,E,F]|[A,B,C,D,E,F,G]> {

    const eitherAB =  zipOrAccumulateInternal<L,[A],B>(argA.map(r=>[r] as [A]).mapLeft(l=>[l]), argB)

    if(!argC){
        return eitherAB
    }

    const eitherABC =  zipOrAccumulateInternal(eitherAB,argC)

    if(!argD){
        return eitherABC
    }

    const eitherABCD =  zipOrAccumulateInternal(eitherABC,argD)

    if(!argE){
        return eitherABCD
    }

    const eitherABCDE =  zipOrAccumulateInternal(eitherABCD,argE)

    if(!argF){
        return eitherABCDE
    }

    const eitherABCDEF =  zipOrAccumulateInternal(eitherABCDE,argF)

    if(!argG){
        return eitherABCDEF
    }

    return zipOrAccumulateInternal(eitherABCDEF,argG)
}

function zipOrBindInternal<L,A extends any[],B>(argA:Either<L,A>,argB:Either<L, B>):Either<L,[...A,B]>{
    return argA.fold((it)=>left(it), (itA)=>argB.map((itB)=>[...itA,itB]))
}

export function zipOrBind<L,A,B>(
    argA:Either<L,A>,argB:Either<L, B>
):Either<L,[A,B]>
export function zipOrBind<L,A,B,C>(
    argA:Either<L,A>,argB:Either<L, B>,argC:Either<L, C>
):Either<L,[A,B,C]>
export function zipOrBind<L,A,B,C,D>(
    argA:Either<L,A>,argB:Either<L, B>,argC:Either<L, C>,argD:Either<L, D>
):Either<L,[A,B,C,D]>
export function zipOrBind<L,A,B,C,D,E>(
    argA:Either<L,A>,argB:Either<L, B>,argC:Either<L, C>,argD:Either<L, D>,argE:Either<L, E>
):Either<L,[A,B,C,D,E]>
export function zipOrBind<L,A,B,C,D,E,F>(
    argA:Either<L,A>,argB:Either<L, B>,argC:Either<L, C>,argD:Either<L, D>,argE:Either<L, E>,argF:Either<L, F>
):Either<L,[A,B,C,D,E,F]>
export function zipOrBind<L,A,B,C,D,E,F,G>(
    argA:Either<L,A>,argB:Either<L, B>,argC:Either<L, C>,argD:Either<L, D>,argE:Either<L, E>,argF:Either<L, F>,
    argG:Either<L, G>
):Either<L,[A,B,C,D,E,F,G]>
export function zipOrBind<L,A,B,C,D,E,F,G>(
    argA:Either<L,A>,argB:Either<L, B>,argC?:Either<L, C>,argD?:Either<L, D>,argE?:Either<L, E>,argF?:Either<L, F>,
    argG?:Either<L, G>
):Either<L,[A,B]|[A,B,C]|[A,B,C,D]|[A,B,C,D,E]|[A,B,C,D,E,F]|[A,B,C,D,E,F,G]>
{
    const eitherAB =  zipOrBindInternal(argA.map(it=>[it] as [A]), argB)
    if(!argC){
        return eitherAB
    }

    const eitherABC =  zipOrBindInternal(eitherAB, argC)
    if(!argD){
        return eitherABC
    }

    const eitherABCD =  zipOrBindInternal(eitherABC, argD)
    if(!argE){
        return eitherABCD
    }

    const eitherABCDE =  zipOrBindInternal(eitherABCD, argE)
    if(!argF){
        return eitherABCDE
    }

    const eitherABCDEF =  zipOrBindInternal(eitherABCDE, argF)
    if(!argG){
        return eitherABCDEF
    }

    return zipOrBindInternal(eitherABCDEF, argG)
}

export function tryE<R>(executor:()=>R):Either<any, R>
export function tryE<R>(executor:()=>Promise<R>):Promise<Either<any, R>>
export function tryE<R>(executor:()=>R|Promise<R>):Either<any, R> | Promise<Either<any, R>>{
    try{
        const response = executor()
        if (response instanceof Promise) {
            return response
                .then(resolvedResponse =>right(resolvedResponse))
                .catch(resolvedError=> left(resolvedError))
        }
        return right(response);
    }catch(e){
        return left(e)
    }
}

export function accumulate<L,R>(eithers:Either<L,R>[]):Either<NonEmptyReadOnlyArray<L>,readonly R[]>{
   const { lefts, rights } =  eithers.reduce((preVal,currentVal)=>{
        const currentValUnwrapped = currentVal.unwrap()
        if(currentValUnwrapped.isRight()){
            return {
                ...preVal,
                rights: [...preVal.rights, currentValUnwrapped.val ]
            }
        }else {
            return {
                ...preVal,
                lefts: [...preVal.lefts,currentValUnwrapped.val ]
            }
        }
    },{ lefts:[] as L[], rights:[] as R [] })

    if(isNotEmpty(lefts)){
        return left(lefts)
    }
    return right(rights)
}

export function separateEithers<L,R>(eithers:Either<L,R>[]): [ReadonlyArray<L>, ReadonlyArray<R>]{
    return eithers.reduce((previousVal:[ReadonlyArray<L>, ReadonlyArray<R>], either:Either<L,R>)=>{
        const [ls,rs] = previousVal
        return either.fold<[ReadonlyArray<L>, ReadonlyArray<R>]>(
            (it)=> [[...ls, it],rs],
            (it)=> [ls, [...rs,it]]
        )
    },[[],[]])
}
