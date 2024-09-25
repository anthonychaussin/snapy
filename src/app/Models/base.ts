export abstract class Base {
  /**
   * Unique Identifier
   * @type {string}
   */
  public Uuid: string;
  /**
   * Name
   * @type {string}
   */
  public Name: string;
  public ParentsIds: Map<string, string> = new Map();
  public static DBName: string;

  public abstract get RealTimePath(): string;

  public abstract get FirestorePath(): string;

  public abstract set RealTimePath(parentsIds: Map<string, string>);

  public abstract set FirestorePath(parentsIds: Map<string, string>);

  constructor(uuid: string, Name: string) {
    this.Uuid = uuid;
    this.Name = Name;
  }

  public BaseToObject() {
    return {
      name: this.Name
    };
  }
}
