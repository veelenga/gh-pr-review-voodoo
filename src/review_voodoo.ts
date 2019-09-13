export interface AppConfig {
  reviewGroups: { [key: string]: string[] }
}

export default class ReviewVoodoo {
  private _config: AppConfig
  private _label: {name: string, action: string}
  private _reviewers: string[]
  private _reviewersToDelete: string[]
  private _reviewersToCreate: string[]

  public constructor(
    config: AppConfig,
    label: { name: string, action: string },
    reviewers: string[]
  ) {
    this._config = config
    this._label = label
    this._reviewers = reviewers
    this._reviewersToDelete = [];
    this._reviewersToCreate = [];
  }

  public execute(): void {
    // TODO:
    this._reviewersToCreate.push('super-reviewer')
  }

  get reviewersToDelete(): string[] {
    return this._reviewersToDelete;
  }

  get reviewersToCreate(): string[] {
    return this._reviewersToCreate;
  }
}
