export interface AppConfig {
  reviewGroups: { [key: string]: string[] }
}

export default class ReviewVoodoo {
  private config: AppConfig
  private label: {name: string, action: string}
  private reviewers: string[]

  public constructor(
    config: AppConfig,
    label: { name: string, action: string },
    reviewers: string[]
  ) {
    this.config = config
    this.label = label
    this.reviewers = reviewers
  }

  public reviewersToDelete(): string[] {
    return []
  }

  public reviewersToCreate(): string[] {
    return []
  }
}
