export type NonEmptyArray<T> = [T, ...T[]]

export type NonEmptyReadOnlyArray<T> = Readonly<NonEmptyArray<T>>
