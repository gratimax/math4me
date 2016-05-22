export class ClientProblem {
  constructor(
    public given: Array<number>,
    public goal: string,
    public ops: Array<string>,
    public problemNumber: number,
    public whoGotIt: Array<number> = [],
    public currentValues: {[id: number]: string} = {}) {}
}