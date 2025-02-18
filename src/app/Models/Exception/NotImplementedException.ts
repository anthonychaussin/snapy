export class NotImplementedException extends Error {
  public Code: number = 500;
  public Message: string = 'Not Implemented';

  constructor(details: string = 'This function is not implemented') {
    super(details);
    this.name = 'NotImplementedException';
    this.stack = (<any> new Error()).stack;
  }

}
