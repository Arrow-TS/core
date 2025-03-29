import {accumulate, left, right, tryE, zipOrAccumulate, zipOrBind} from "../src";

describe("TryE", () => {

    test("tryE sync ", () => {
        expect(tryE(()=>{
            return "Success"
        })).toStrictEqual(right("Success"))

        expect(tryE(()=>{
             throw new Error("Failure")
        })).toStrictEqual(left(Error("Failure")))

    })


    test("tryE async ", async  () => {
        const result = await tryE<string>(async ()=>{
            return Promise.resolve("Success")
        })
        expect(result).toStrictEqual(right("Success"))

        const reject = await tryE<string>(async ()=>{
            throw new Error("Failure")
        })
        expect(reject).toStrictEqual(left(Error("Failure")))

    })

})


describe("ZipOrBind", () => {

    test("zipOrBind AB sync ", () => {

        const successA = right("A")
        const successB = right("B")
        const error = left("error")

        const abE = zipOrBind(
            successA,
            successB,
        )
        expect(abE).toStrictEqual(right(["A","B"]))

        const aError = zipOrBind(
            successA,
            error,
        )
        expect(aError).toStrictEqual(left("error"))


    })

    test("zipOrBind ABC sync ", () => {

        const successA = right("A")
        const successB = right("B")
        const successC = right("C")
        const error = left("error")

        const abcE = zipOrBind(
            successA,
            successB,
            successC
        )
        expect(abcE).toStrictEqual(right(["A","B","C"]))

        const abError = zipOrBind(
            successA,
            successB,
            error,
        )
        expect(abError).toStrictEqual(left("error"))

    })


    test("zipOrBind ABCD sync ", () => {

        const successA = right("A")
        const successB = right("B")
        const successC = right("C")
        const successD = right("D")
        const error = left("error")

        const abcdE = zipOrBind(
            successA,
            successB,
            successC,
            successD
        )
        expect(abcdE).toStrictEqual(right(["A","B","C","D"]))

        const abcError = zipOrBind(
            successA,
            successB,
            successC,
            error,
        )
        expect(abcError).toStrictEqual(left("error"))

    })


    test("zipOrBind ABCDE sync ", () => {

        const successA = right("A")
        const successB = right("B")
        const successC = right("C")
        const successD = right("D")
        const successE = right("E")
        const error = left("error")

        const abcdeE = zipOrBind(
            successA,
            successB,
            successC,
            successD,
            successE
        )
        expect(abcdeE).toStrictEqual(right(["A","B","C","D","E"]))

        const abcdError = zipOrBind(
            successA,
            successB,
            successC,
            successD,
            error,
        )
        expect(abcdError).toStrictEqual(left("error"))

    })


    test("zipOrBind ABCDEF sync ", () => {

        const successA = right("A")
        const successB = right("B")
        const successC = right("C")
        const successD = right("D")
        const successE = right("E")
        const successF = right("F")
        const error = left("error")

        const abcdefE = zipOrBind(
            successA,
            successB,
            successC,
            successD,
            successE,
            successF
        )
        expect(abcdefE).toStrictEqual(right(["A","B","C","D","E","F"]))

        const abcdeError = zipOrBind(
            successA,
            successB,
            successC,
            successD,
            successE,
            error,
        )
        expect(abcdeError).toStrictEqual(left("error"))

    })


    test("zipOrBind ABCDEFG sync ", () => {

        const successA = right("A")
        const successB = right("B")
        const successC = right("C")
        const successD = right("D")
        const successE = right("E")
        const successF = right("F")
        const successG = right("G")
        const error = left("error")

        const abcdefgE = zipOrBind(
            successA,
            successB,
            successC,
            successD,
            successE,
            successF,
            successG
        )
        expect(abcdefgE).toStrictEqual(right(["A","B","C","D","E","F","G"]))

        const abcdefError = zipOrBind(
            successA,
            successB,
            successC,
            successD,
            successE,
            successF,
            error,
        )
        expect(abcdefError).toStrictEqual(left("error"))

    })

})


describe("ZipOrAccumulate", () => {

    test("zipOrAccumulate AB sync ", () => {

        const successA = right("A")
        const successB = right("B")
        const errorA = left("A")
        const errorB = left("B")

        const abE = zipOrAccumulate(
            successA,
            successB,
        )
        expect(abE).toStrictEqual(right(["A","B"]))

        const abError = zipOrAccumulate(
            errorA,
            errorB,
        )
        expect(abError).toStrictEqual(left(["A","B"]))


    })

    test("zipOrAccumulate ABC sync ", () => {

        const successA = right("A")
        const successB = right("B")
        const successC = right("C")
        const errorA = left("A")
        const errorB = left("B")
        const errorC = left("C")

        const abcE = zipOrAccumulate(
            successA,
            successB,
            successC
        )
        expect(abcE).toStrictEqual(right(["A","B","C"]))

        const abcError = zipOrAccumulate(
            errorA,
            errorB,
            errorC
        )
        expect(abcError).toStrictEqual(left(["A","B","C"]))

    })

    test("zipOrAccumulate ABCD sync ", () => {

        const successA = right("A")
        const successB = right("B")
        const successC = right("C")
        const successD = right("D")
        const errorA = left("A")
        const errorB = left("B")
        const errorC = left("C")
        const errorD = left("D")

        const abcdE = zipOrAccumulate(
            successA,
            successB,
            successC,
            successD,
        )
        expect(abcdE).toStrictEqual(right(["A","B","C","D"]))

        const abcdError = zipOrAccumulate(
            errorA,
            errorB,
            errorC,
            errorD,
        )
        expect(abcdError).toStrictEqual(left(["A","B","C","D"]))

    })


    test("zipOrAccumulate ABCDE sync ", () => {

        const successA = right("A")
        const successB = right("B")
        const successC = right("C")
        const successD = right("D")
        const successE = right("E")
        const errorA = left("A")
        const errorB = left("B")
        const errorC = left("C")
        const errorD = left("D")
        const errorE = left("E")

        const abcdeE = zipOrAccumulate(
            successA,
            successB,
            successC,
            successD,
            successE
        )
        expect(abcdeE).toStrictEqual(right(["A","B","C","D","E"]))

        const abcdeError = zipOrAccumulate(
            errorA,
            errorB,
            errorC,
            errorD,
            errorE
        )
        expect(abcdeError).toStrictEqual(left(["A","B","C","D","E"]))

    })


    test("zipOrAccumulate ABCDEF sync ", () => {

        const successA = right("A")
        const successB = right("B")
        const successC = right("C")
        const successD = right("D")
        const successE = right("E")
        const successF = right("F")
        const errorA = left("A")
        const errorB = left("B")
        const errorC = left("C")
        const errorD = left("D")
        const errorE = left("E")
        const errorF = left("F")

        const abcdefE = zipOrAccumulate(
            successA,
            successB,
            successC,
            successD,
            successE,
            successF,
        )
        expect(abcdefE).toStrictEqual(right(["A","B","C","D","E",'F']))

        const abcdefError = zipOrAccumulate(
            errorA,
            errorB,
            errorC,
            errorD,
            errorE,
            errorF,
        )
        expect(abcdefError).toStrictEqual(left(["A","B","C","D","E",'F']))

    })
})


describe("Accumulate", () => {


    test("accumulate no lefts", () => {
        const rights = [right("R1"), right("R2")]
        const rightsE = accumulate(rights)
        expect(rightsE).toStrictEqual(right(["R1","R2"]))
    })

    test("accumulate rights with lefts", () => {
        const mixE = [right("R1"), right("R2"), left("L1"), left("L2")]
        const lefts = accumulate(mixE)
        expect(lefts).toStrictEqual(left(["L1","L2"]))
    })


    test("accumulate empty", () => {
        const rights = []
        const rightsE = accumulate(rights)
        expect(rightsE).toStrictEqual(right([]))
    })

})