import { DurationInputArg1 } from "moment";

declare module 'moment' {
  export function __setOffset__(clear: null): void;
  export function __setOffset__(amount?: DurationInputArg1, unit?: DurationInputArg2): void;
}