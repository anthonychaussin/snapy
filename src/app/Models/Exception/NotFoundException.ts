export class NotFoundException extends Error {
  public Code: number = 404;
  public Message: string = 'Not Found';

  constructor(details: string | undefined) {
    super(details ?? 'Object not found');
    this.name = 'NotFoundException';
    this.stack = (<any> new Error()).stack;
  }
}
