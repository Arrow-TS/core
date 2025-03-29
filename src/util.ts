import { NonEmptyArray, NonEmptyReadOnlyArray } from "./types";
export function isNotEmpty<T>(t:readonly T[]) :t is NonEmptyReadOnlyArray<T>
export function isNotEmpty<T>(t:T[]): t is NonEmptyArray<T>
export function isNotEmpty<T>(t:T[]|readonly T[]): t is NonEmptyArray<T>|NonEmptyReadOnlyArray<T>{
    return t.length > 0
}