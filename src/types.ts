export type NonEmptyArray<T> = [T, ...T[]]

export type NotEmptyReadOnlyArray<T> = Readonly<NonEmptyArray<T>>
