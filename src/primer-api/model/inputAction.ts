/**
 * Generated by orval v6.15.0 🍺
 * Do not edit manually.
 * Primer backend API
 * A backend service implementing a pedagogic functional programming language.
 * OpenAPI spec version: 0.7
 */

export type InputAction = typeof InputAction[keyof typeof InputAction];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const InputAction = {
  MakeCon: 'MakeCon',
  MakeConSat: 'MakeConSat',
  MakeInt: 'MakeInt',
  MakeChar: 'MakeChar',
  MakeVar: 'MakeVar',
  MakeVarSat: 'MakeVarSat',
  MakeLet: 'MakeLet',
  MakeLetRec: 'MakeLetRec',
  MakeLam: 'MakeLam',
  MakeLAM: 'MakeLAM',
  RenamePattern: 'RenamePattern',
  RenameLet: 'RenameLet',
  RenameLam: 'RenameLam',
  RenameLAM: 'RenameLAM',
  MakeTCon: 'MakeTCon',
  MakeTVar: 'MakeTVar',
  MakeForall: 'MakeForall',
  RenameForall: 'RenameForall',
  RenameDef: 'RenameDef',
} as const;
