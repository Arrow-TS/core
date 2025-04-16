import {Either, Left, left, Right, right} from "../src";

describe("Simple Either", () => {

    test("Left Either", () => {
        expect(left("LEFT")).toStrictEqual(new Left("LEFT"));
    });
    test("Right Either", () => {
        expect(right("RIGHT")).toStrictEqual(new Right("RIGHT"));
    })
});


describe("Either Equality", () => {

    test("Left Eithers", () => {
        expect(left("LEFT")).toStrictEqual(left("LEFT"));
    });
    test("Right Eithers", () => {
        expect(right("RIGHT")).toStrictEqual(right("RIGHT"));
    });
})

describe("Either unwrapped", () => {

    test("Left Either", () => {
        const unwrappedLeft = left("LEFT").unwrap()
        expect(unwrappedLeft.isLeft()).toBeTruthy();
        expect(unwrappedLeft.isRight()).toBeFalsy();
    });
    test("Right Either", () => {
        const unwrappedRight = right("RIGHT").unwrap()
        expect(unwrappedRight.isRight()).toBeTruthy();
        expect(unwrappedRight.isLeft()).toBeFalsy();
    });
})


describe("Either Fold", () => {

    test("Either sync fold", () => {
        const leftEither =  left("LEFT")
        const leftVal = leftEither.fold((it)=> `MappedLeftValue-${it}`, (it)=> `MappedRightValue-${it}`)
        expect(leftVal).toBe("MappedLeftValue-LEFT")

        const rightEither = right("RIGHT")
        const rightVal = rightEither.fold((it)=> `MappedLeftValue-${it}`, (it)=> `MappedRightValue-${it}`)
        expect(rightVal).toBe("MappedRightValue-RIGHT")
    })

    test("Either async fold", async () => {
        const leftEither = left("LEFT")
        const leftVal = await leftEither.fold((it)=>Promise.resolve(`MappedLeftValue-${it}`), (it)=>  Promise.resolve(`MappedRightValue-${it}`))
        expect(leftVal).toBe("MappedLeftValue-LEFT")

        const rightEither = right("RIGHT")
        const rightVal = await rightEither.fold((it)=> Promise.resolve(`MappedLeftValue-${it}`), (it)=> Promise.resolve(`MappedRightValue-${it}`))
        expect(rightVal).toBe("MappedRightValue-RIGHT")
    })

})


describe("Either Map", () => {

    test("Either sync map", () => {
        const leftEither =  left("LEFT")
        const leftVal = leftEither.map((it)=> `MappedRightValue-${it}`)
        expect(leftVal).toStrictEqual(left("LEFT"));

        const rightEither = right("RIGHT")
        const rightVal = rightEither.map((it)=> `MappedRightValue-${it}`)
        expect(rightVal).toStrictEqual(right("MappedRightValue-RIGHT"))
    })

    test("Either async map", async () => {
        const leftEither =  left("LEFT")
        const leftVal = await leftEither.map<string>((it)=> Promise.resolve(`MappedRightValue-${it}`))
        expect(leftVal).toStrictEqual(left("LEFT"));

        const rightEither = right("RIGHT")
        const rightVal = await rightEither.map<string>((it)=> Promise.resolve(`MappedRightValue-${it}`))
        expect(rightVal).toStrictEqual(right("MappedRightValue-RIGHT"))
    })
})


describe("Either MapLeft", () => {

    test("Either sync mapLeft", () => {
        const leftEither =  left("LEFT")
        const leftVal = leftEither.mapLeft((it)=> `MappedLeftValue-${it}`)
        expect(leftVal).toStrictEqual(left("MappedLeftValue-LEFT"));

        const rightEither = right("RIGHT")
        const rightVal = rightEither.mapLeft((it)=> `MappedLeftValue-${it}`)
        expect(rightVal).toStrictEqual(right("RIGHT"))
    })

    test("Either async mapLeft", async () => {
        const leftEither =  left("LEFT")
        const leftVal = await leftEither.mapLeft<string>((it)=> Promise.resolve(`MappedLeftValue-${it}`))
        expect(leftVal).toStrictEqual(left("MappedLeftValue-LEFT"));

        const rightEither = right("RIGHT")
        const rightVal = await rightEither.mapLeft<string>((it)=> Promise.resolve(`MappedLeftValue-${it}`))
        expect(rightVal).toStrictEqual(right("RIGHT"))
    })
})

describe("Either FlatMap", () => {

    test("Either sync flatMap", () => {
        const leftEither =  left("LEFT")
        const leftVal = leftEither.flatMap((it)=> left(`MappedLeftValue-${it}`))
        const rightShiftVal = leftEither.flatMap((it)=> right(`MappedRightValue-${it}`))
        expect(leftVal).toStrictEqual(left("LEFT"));
        expect(rightShiftVal).toStrictEqual(left("LEFT"));

        const rightEither:Either<string,string> = right("RIGHT")
        const rightVal = rightEither.flatMap((it)=> right(`MappedRightValue-${it}`))
        const leftShiftVal = rightEither.flatMap((it)=> left(`MappedLeftValue-${it}`))
        expect(rightVal).toStrictEqual(right("MappedRightValue-RIGHT"))
        expect(leftShiftVal).toStrictEqual(left("MappedLeftValue-RIGHT"));
    })

    test("Either async flatMap", async () => {
        const leftEither =  left("LEFT")
        const leftVal = await leftEither.flatMap((it)=> Promise.resolve(left(`MappedLeftValue-${it}`)))
        const rightShiftVal = await leftEither.flatMap((it)=> Promise.resolve(right(`MappedRightValue-${it}`)))
        expect(leftVal).toStrictEqual(left("LEFT"));
        expect(rightShiftVal).toStrictEqual(left("LEFT"));

        const rightEither:Either<string,string> = right("RIGHT")
        const rightVal = await rightEither.flatMap((it)=> Promise.resolve(right(`MappedRightValue-${it}`)))
        const leftShiftVal = await rightEither.flatMap((it)=> Promise.resolve(left(`MappedLeftValue-${it}`)))
        expect(rightVal).toStrictEqual(right("MappedRightValue-RIGHT"))
        expect(leftShiftVal).toStrictEqual(left("MappedLeftValue-RIGHT"));
    })
})


describe("Either FlatMapLeft", () => {

    test("Either sync flatMapLeft", () => {
        const leftEither:Either<string,string> =  left("LEFT")
        const leftVal = leftEither.flatMapLeft((it)=> left(`MappedLeftValue-${it}`))
        const rightShiftVal = leftEither.flatMapLeft((it)=> right(`MappedRightValue-${it}`))
        expect(leftVal).toStrictEqual(left("MappedLeftValue-LEFT"));
        expect(rightShiftVal).toStrictEqual( right("MappedRightValue-LEFT"));

        const rightEither = right("RIGHT")
        const rightVal = rightEither.flatMapLeft((it)=> right(`MappedRightValue-${it}`))
        const leftShiftVal = rightEither.flatMapLeft((it)=> left(`MappedLeftValue-${it}`))
        expect(rightVal).toStrictEqual(right("RIGHT"))
        expect(leftShiftVal).toStrictEqual(right("RIGHT"));
    })

    test("Either async flatMapLeft", async () => {
        const leftEither:Either<string,string> =  left("LEFT")
        const leftVal = await leftEither.flatMapLeft((it)=> Promise.resolve(left(`MappedLeftValue-${it}`)))
        const rightShiftVal = await leftEither.flatMapLeft((it)=> Promise.resolve(right(`MappedRightValue-${it}`)))
        expect(leftVal).toStrictEqual(left("MappedLeftValue-LEFT"));
        expect(rightShiftVal).toStrictEqual( right("MappedRightValue-LEFT"));

        const rightEither = right("RIGHT")
        const rightVal = await rightEither.flatMapLeft((it)=> Promise.resolve(right(`MappedRightValue-${it}`)))
        const leftShiftVal = await rightEither.flatMapLeft((it)=> Promise.resolve(left(`MappedLeftValue-${it}`)))
        expect(rightVal).toStrictEqual(right("RIGHT"))
        expect(leftShiftVal).toStrictEqual(right("RIGHT"));
    })
})


describe("Either OnLeft", () => {

    test("Either sync onLeft", () => {
        const leftEither = left("LEFT")
        const onLeftFunctionLeftEither = jest.fn( (it:string)=>{})
        leftEither.onLeft(onLeftFunctionLeftEither)
        expect(onLeftFunctionLeftEither).toHaveBeenCalledWith("LEFT")
        const rightEither = right("RIGHT")
        const onLeftFunctionRightEither = jest.fn( (it:string)=>{})
        rightEither.onLeft(onLeftFunctionRightEither)
        expect(onLeftFunctionRightEither).toHaveBeenCalledTimes(0)
    })

    test("Either async onLeft", async () => {
        const leftEither = left("LEFT")
        const onLeftFunctionLeftEither = jest.fn( async (it:string)=>{})
        await leftEither.onLeft(onLeftFunctionLeftEither)
        expect(onLeftFunctionLeftEither).toHaveBeenCalledWith("LEFT")
        const rightEither = right("RIGHT")
        const onLeftFunctionRightEither = jest.fn( async (it:string)=>{})
        await rightEither.onLeft(onLeftFunctionRightEither)
        expect(onLeftFunctionRightEither).toHaveBeenCalledTimes(0)
    })
})


describe("Either OnRight", () => {

    test("Either sync onRight", () => {
        const leftEither = left("LEFT")
        const onRightFunctionLeftEither = jest.fn( (it:string)=>{})
        leftEither.onRight(onRightFunctionLeftEither)
        expect(onRightFunctionLeftEither).toHaveBeenCalledTimes(0)
        const rightEither = right("RIGHT")
        const onRightFunctionRightEither = jest.fn( (it:string)=>{})
        rightEither.onRight(onRightFunctionRightEither)
        expect(onRightFunctionRightEither).toHaveBeenCalledWith("RIGHT")
    })

    test("Either async onRight", async () => {
        const leftEither = left("LEFT")
        const onRightFunctionLeftEither = jest.fn( async (it:string)=>{})
        await leftEither.onRight(onRightFunctionLeftEither)
        expect(onRightFunctionLeftEither).toHaveBeenCalledTimes(0)
        const rightEither = right("RIGHT")
        const onRightFunctionRightEither = jest.fn( async (it:string)=>{})
        await rightEither.onRight(onRightFunctionRightEither)
        expect(onRightFunctionRightEither).toHaveBeenCalledWith("RIGHT")
    })
})


describe("Either Get", () => {

    test("Either getOrDefault", () => {
        const leftEither: Either<string, string> = left("LEFT")
        expect(leftEither.getOrDefault("Test")).toEqual("Test")
        const rightEither = right("RIGHT")
        expect(rightEither.getOrDefault("Test")).toEqual("RIGHT")
    })

    test("Either getOrNull", () => {
        const leftEither: Either<string, string> = left("LEFT")
        expect(leftEither.getOrNull()).toBeNull()
        const rightEither = right("RIGHT")
        expect(rightEither.getOrNull()).toEqual("RIGHT")
    })

    test("Either getOrElse", () => {
        const leftEither: Either<string, string> = left("LEFT")
        expect(() => {
            leftEither.getOrElse((it)=>{throw Error(it)})
        }).toThrow(Error('LEFT'));
        const rightEither = right("RIGHT")
        expect(rightEither.getOrElse((it)=>{throw Error(it)})).toEqual("RIGHT")
    })
})


describe("Either Merge", () => {
    test("Either merge", () => {
        const leftEither = left("LEFT")
        expect(leftEither.merge()).toEqual("LEFT")
        const rightEither = right("RIGHT")
        expect(rightEither.merge()).toEqual("RIGHT")
    })
})


describe("Either Switch", () => {
    test("Either switch", () => {
        const leftEither = left("LEFT")
        const rightEither = right("LEFT")
        expect(leftEither.switch()).toEqual(rightEither)
        expect(rightEither.switch()).toEqual(leftEither)
    })
})