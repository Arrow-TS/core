# <ins>Arrow-TS</ins>


## What is Arrow-TS

Before diving into what Arrow-TS is, let’s take a step back to where it all began. 
In the functional programming paradigm, concepts like functors, applicatives, and monads
play a vital role in managing effects and side-effects. 
Arrow-TS emerged from the challenges of finding a type-safe implementation for handling effects and side-effects in TypeScript. 
As a result, Arrow-TS is a ground-up, type-safe monadic library that brings a comprehensive set of tools for managing 
effects and side-effects in the TypeScript ecosystem. Arrow-TS is heavily inspired by the awesome magic of [Arrow-KT](https://arrow-kt.io/) and 
brings those powerful ideas into the TypeScript world, with a native TypeScript twist that feels right at home.



## What makes Arrow-TS special? 

While [FP-TS](https://gcanti.github.io/fp-ts/) (now [Effect-TS](https://github.com/Effect-TS)), the OG of functional programming in TypeScript, covers nearly everything Arrow-TS aims to address, 
it often comes with a heavy dose of boilerplate that can disrupt the natural flow of TypeScript code. Arrow-TS, on the other hand, takes a more intuitive, 
TypeScript-native approach that feels much more familiar to everyday TS developers. 
Arrow-TS is not a replacement for FP-TS or any other existing library.
Arrow-TS aims to solve effects and side-effects (one of the most common problems in TS world) with a unique and minimalistic typescript native approach.


## Exploring Arrow-TS

> **Note:** Arrow-TS doesn't require prior knowledge of advanced functional programming concepts like functors or monads.
> In fact, its documentation is structured in a way that makes it accessible to any developer, regardless of their FP background.
> That said, having a solid foundation in functional programming can certainly be beneficial.

### Typed Errors

Typed errors are a functional programming technique where potential runtime errors are explicitly represented in the function's type signature. 
Unlike exceptions, this pattern is more declarative, offering explicit error handling and reducing runtime failures by leveraging type safety. 

#### **With Exceptions:**

```typescript
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Divider cannot be zero");
  }
  return a / b;
}
```

#### **With TypedErrors:**

```typescript
function divide(a: number, b: number): Either<Error,number> {
  if (b === 0) {
    return left(new Error("Divider cannot be zero"));
  }
  return right(a / b);
}
```

TypedErrors brings error handling (side-effects) into the application logic in a typesafe manner. 

### What is `Either<L,R>`

Either is a data type that can hold either `L` or `R`, but never both at the same time. Although it only contains one of these values at any given moment, 
the Either type signature enforces handling both `L` and `R` throughout the code, ensuring that both cases are accounted for. TypeScript has a similar native 
feature with `|` union type. Instead of using `Either<L, R>`, it can be written as `L | R`. While both are more or less similar from a signature perspective,
`Either` is much powerful and offers advance capabilities that go beyond the traditional union type.

#### Promises are <i> not so promising </i>

Promises are among the most useful features in the TypeScript/JavaScript ecosystem. However, combining typed errors with promises can be a bit tricky when it comes 
to type signatures. The issue often boils down to the ordering: should it be `Either<Promise<L>, R>` or `Promise<Either<L, R>>`? Arrow-TS addresses this in a 
non-opinionated way, giving developers the flexibility to choose the order that best fits their needs with very minimal boilerplate.


### Either Construction

`Either<L,R>` represents either  `Left<L>` or `Right<R>` and **is not interpreted as** `Left<L>|Right<R>`. 

```typescript
const leftE: Either<string,never> = new Left("I'm Left") // or left("I'm Left")     

const rightE: Either<never,string> = new Right("I'm Right") // or right("I'm Right")
```

### Either Transformation

An `Either<L,R>` can be transformed in various ways. The true power `Either` comes from these transforms, making it a highly useful tool.

#### map `<S>(mapper: (r: R) => S): Either<L, S>`

```typescript
const rightE: Either<never, string> = right("I'm Right")

const rightMappedE: Either<never, number> = rightE.map((it:string)=> 20)

const rightMappedAsyncE: Either<never, number> = await rightE.map<number>((it:string)=> Promise.resolve(20))
```

#### mapLeft `mapLeft<S>(mapper: (l: L) => S): Either<S, R>`

```typescript
const leftE: Either<string, never> = left("I'm Left")

const leftMappedE: Either<number, never> = leftE.mapLeft((it:string)=> 20)

const leftMappedAsyncE: Either<number, number> = await leftE.mapLeft<number>((it:string)=> Promise.resolve(20))
```

#### flatMap `flatMap<S>(r: (r: R) => Either<L, S>): Either<L, S>`

```typescript
const rightE: Either<never, string> = right("I'm Right")

const mappedRightE: Either<never, number> = right(20)

const rightMappedE: Either<never, number> = rightE.flatMap((it:string)=> mappedRightE)

const rightMappedAsyncE: Either<never, number> = await rightE.flatMap<number>((it:string)=> Promise.resolve(rightMappedE))
```

#### flatMapLeft `flatMapLeft<S>(l: (l: L) => Either<S, R>): Either<S, R>`

```typescript
const leftE: Either<string, never> = left("I'm Left")

const mappedLeftE: Either<never, number> = left(20)

const leftMappedE: Either<number, never> = leftE.flatMapLeft((it:string)=> mappedLeftE)

const leftMappedAsyncE: Either<number, number> = await leftE.flatMapLeft<number>((it:string)=> Promise.resolve(mappedLeftE))
```

#### fold `fold<S>(left: (l:L)=>S, right: (l:R)=>S): S`

```typescript

const rightE: Either<never, string> = right("I'm Right")

const leftE: Either<string, never> = left("I'm Left")

const foldedFromLeftE: number = leftE.fold(
    (it:string)=> 20,
    (it:never) => 20
)

const foldedFromRightE: number = rightE.fold(
    (it:never)=> 20,
    (it:string) => 20
)

```


#### merge `()=>L|R`

```typescript

const rightE: Either<never, string> = right("I'm Right")

const merged: never|string = rightE.merge()

const mappedE:Either<string, string> = rightE.flatMapLeft(()=> left("I'm Left") )

const mappedMerged: string = mappedE.merge()

```

#### merge `()=>L|R`

```typescript

const rightE: Either<never, string> = right("I'm Right")

const leftE: string|never = rightE.switch()

```

### Either Extractions

Different techniques allow for extracting the value from an `Either` while ensuring type safety.

#### getOrDefault `getOrDefault(r:R): R`

```typescript

const rightE: Either<never, string> = right("I'm Right")

const leftE: Either<string, never> = left("I'm Left")

const valFromRightE: string = rightE.getOrDefault("I'm not a Right") // valFromRightE is "I'm Right"

const valFromLeftE: string = leftE.getOrDefault("I'm not a Right") // valFromLeftE is "I'm not a Right"

```

#### getOrNull `getOrNull(): R|null`

```typescript

const rightE: Either<never, string> = right("I'm Right")

const leftE: Either<string, never> = left("I'm Left")

const valFromRightE: string = rightE.getOrNull() // valFromRightE is "I'm Right"

const valFromLeftE: string = leftE.getOrNull() // valFromLeftE is null

```

#### getOrElse `getOrElse(handler:(l:L)=>never): R`

```typescript

const rightE: Either<never, string> = right("I'm Right")

const leftE: Either<string, never> = left("I'm Left")

const valFromRightE: string = rightE.getOrElse(()=> { throw new Error("I'm Not Right") }) // valFromRightE is "I'm Right"

const valFromLeftE: string = leftE.getOrElse(()=> { throw new Error("I'm Not Right") }) // Error "I'm Not Right" will be thrown

```

#### unwrap `unwrap(): Left<L>|Right<R>`

```typescript

const rightE: Either<never, string> = right("I'm Right")

const leftE: Either<string, never> = left("I'm Left")

const unwrappedRightE: Left<never>|Right<string> = rightE.unwrap()

const unwrappedLeftE: Left<string>|Right<never> = leftE.unwrap()

if(unwrappedRightE.isRight()){
    const rightVal: string = unwrappedRightE.val
}

if(unwrappedLeftE.isLeft()){
    const leftVal: string = unwrappedLeftE.val
}

```

### Either Observation

The value in an `Either` can be inspected without unwrapping it.

#### onRight `onRight(handler: ((r: R) => void)`

```typescript

const rightE: Either<never, string> = right("I'm Right")

const leftE: Either<string, never> = left("I'm Left")

rightE.onRight((it:string)=> {console.log(it)})   // prints "I'm Right"

leftE.onRight((it:string)=> {console.log(it)})   // Nothing

```

#### onLeft `onLeft(handler: ((l: L) => void)`

```typescript

const rightE: Either<never, string> = right("I'm Right")

const leftE: Either<string, never> = left("I'm Left")

rightE.onLeft((it:string)=> {console.log(it)})   // Nothing

leftE.onLeft((it:string)=> {console.log(it)})   // prints "I'm Left"

```

### Control Flows 

`Either<L, R>` on its own is useful, but when combined with control flows, it becomes even more useful in applications. Arrow-TS provides 
a set of simple yet powerful operators to handle different combinations of `Either`s.


#### ensureExists `ensureExists<L,T>(val:T|null|undefined,l:L):Either<L,T>`

```typescript

const value: number|null =  20

const eitherE: Either<string, number> = ensureExists(value, "Value is not defined")

```

#### ensureContains `ensureContains<L,T>(val:ReadonlyArray<T>|T[]|null|undefined,searchVal:T,l:L):Either<L,T>`

```typescript

const values: number[] =  [20]

const eitherE: Either<string, number> = ensureContains(values, 20 , "20 is not included in values")

```

#### ensure `ensure(func:()=>boolean):<L,T>(eitherParam:{left:L,right:T})=>Either<L,T>`

```typescript

const eitherE: Either<string, boolean> = ensure(()=> 1 === 1)({right:true, left:"One is not equal to one"})

```

#### zipOrAccumulate `zipOrAccumulate<L,A,B...>(argA:Either<L,A>, argB:Either<L,B>,...):Either<NonEmptyReadOnlyArray<L>,[A,B...]>`

```typescript

type BookEntity = {
    readonly name: string,
    readonly author: string,
    readonly ISBN: string,
    readonly pages: 10,
}

const validBookEntity: Partial<BookEntity> = {
    "name": "Simple FP",
    "author": "Author",
    "ISBN": "978-5-6898-9405-8",
    "pages": 10
}

const validatedBookeEntityE: Either<NonEmptyReadOnlyArray<L>, BookEntity> = zipOrAccumulate(
    ensureExists(validBookEntity.name, "Attribute `name` doesn't exist"),
    ensureExists(validBookEntity.author, "Attribute `author` doesn't exist"),
    ensureExists(validBookEntity.ISBN, "Attribute `ISBN` doesn't exist"),
    ensureExists(validBookEntity.pages, "Attribute `pages` doesn't exist"),
).map(([name, author, ISBN, pages])=>({
    name,
    author,
    ISBN,
    pages
})) 

// validatedBookeEntityE is Right<BookEntity>

const invalidBookEntity: Partial<BookEntity> = {
    "name": "Simple FP",
    "ISBN": "978-5-6898-9405-8",
}

const inValidBookeEntityE: Either<NonEmptyReadOnlyArray<L>, BookEntity> = zipOrAccumulate(
    ensureExists(validBookEntity.name, "Attribute `name` doesn't exist"),
    ensureExists(validBookEntity.author, "Attribute `author` doesn't exist"),
    ensureExists(validBookEntity.ISBN, "Attribute `ISBN` doesn't exist"),
    ensureExists(validBookEntity.pages, "Attribute `pages` doesn't exist"),
).map(([name, author, ISBN, pages])=>({
    name,
    author,
    ISBN,
    pages
}))

// inValidBookeEntityE is Left<["Attribute `author` doesn't exist", "Attribute `pages` doesn't exist" ]>

```

#### zipOrBind `zipOrBind<L,A,B...>(argA:Either<L,A>, argB:Either<L,B>,...):Either<L,[A,B...]>`

```typescript

const step1E: Either<string, number> = (await step1Execution()).mapLeft(()=>"Step1 failed")

const step2E: Either<string, boolean> = step1E.map<boolean>(async(it) => (await step2Execution(it)).mapLeft(()=>"Step2 failed"))

const combinedE: Either<string, [number, boolean]> = zipOrBind(
    step1E,
    step2E
)

```
- If `step1` and `step2` are both successful then combinedE is `Right<[number,boolean]>`

- If `step1` successful and `step2` is unsuccessful then combinedE is `Left<"Step2 failed">`

- If `step1` failed (step2 won't get executed) then combinedE is `Left<"Step1 failed">`

#### accumulate `accumulate<L,R>(eithers:Either<L,R>[]):Either<NonEmptyReadOnlyArray<L>,ReadonlyArray<R>>`

```typescript

const eitherWithErrors: Either<string, number>[] = [right(1), right(2), left("No 3"), right(4), left("No 5"), right(6)]

const accumulatedErrorsWithEithers: Either<NonEmptyReadOnlyArray<string>, ReadonlyArray<number>> = accumulate(eitherWithErrors) 

// accumulatedErrorsWithEithers is Left<["No 3", "No 5"]>

const eithers: Either<string, number>[] = [right(1), right(2), right(3), right(4), right(5), right(6)]

const accumulatedEithers: Either<NonEmptyReadOnlyArray<string>, ReadonlyArray<number>> = accumulate(eithers)

// accumulatedEithers is Right<[1,2,3,4,5,6]>

```

#### separateEithers `separateEithers<L,R>(eithers:Either<L,R>[]): [ReadonlyArray<L>, ReadonlyArray<R>]`

```typescript

const eithers: Either<string, number>[] = [right(1), right(2), left("No 3"), right(4), left("No 5"), right(6)]

const sepereatedEithers: [ReadonlyArray<string>, ReadonlyArray<number>] = separateEithers(eithers) 

// sepereatedEithers is [["No 3", "No 5"],[1,2,4,6]]

```


### from non Eithers

Arrow-TS can be easily integrated with traditional code.

#### tryE `tryE<L,R>(executor:()=>R):Either<L, R>`

```typescript

function divide(a: number, b: number): number {
    if (b === 0) {
        throw new Error("Divider cannot be zero");
    }
    return a / b;
}

async function asyncDivide(a: number, b: number): number {
    if (b === 0) {
      return Promise.reject(new Error("Divider cannot be zero"));
    }
    return Promise.resolve(a / b);
}

const either:Either<Error,number> = tryE<Error,number>(()=>divide(2,2))

// or const either:Either<Error,number> = tryE(()=>divide(2,2)).mapLeft((it:Error)=>it)

const asyncEither:Either<Error,number> = await tryE<Error,number>(()=>asyncDivide(2,2))

//In case of unknown errors

const unknonErrorEither:Either<any,number> = tryE<number>(()=>divide(2,2))

const unknonErrorAsyncEither:Either<any,number> = await tryE<number>(()=>asyncDivide(2,2))

```

#### A traditional approach for async flows

```typescript

async function asyncDivide(a: number, b: number): number {
    if (b === 0) {
      return Promise.reject(new Error("Divider cannot be zero"));
    }
    return Promise.resolve(a / b);
}

const asyncEither:Either<Error,number> = await asyncDivide(2,2).then(it=> right(it)).catch((it:Error)=>left(it))

```


