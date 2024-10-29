export default class Payment {
  private _id: string;
  private _date: string;
  private _expirationDate: string;
  private _userId: string;
  private _planId: string;

  constructor(id: string, userId: string, planId: string, date: string, expirationDate: string) {
    this._id = id;
    this._date = date;
    this._expirationDate = expirationDate;
    this._userId = userId;
    this._planId = planId;
  }

  get id(): string {
    return this._id;
  }

  get date(): string {
    return this._date;
  }

  get expirationDate(): string {
    return this._expirationDate;
  }

  get userId(): string {
    return this._userId;
  }

  get planId(): string {
    return this._planId;
  }
}
