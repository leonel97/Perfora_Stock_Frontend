export class EnumFormat {
  private _value:	string;
  private _key:	any;

  constructor(value: string, key: any) {
    this._value = value;
    this._key = key;
  }

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
  }

  get key(): any {
    return this._key;
  }

  set key(value: any) {
    this._key = value;
  }
}

