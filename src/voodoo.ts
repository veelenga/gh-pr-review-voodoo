export interface AppConfig {
  minAmountOfReviewers: number
  reviewerGroupsByLabels: { [key: string]: string[] }
}

export default class Voodoo {
  private _config: AppConfig
  private _requester: string
  private _label: string
  private _reviewers: string[]

  public constructor (config: AppConfig, requester: string, label: string, reviewers: string[]) {
    this._config = config
    this._requester = requester
    this._label = label
    this._reviewers = reviewers
  }

  public throwBones (): string[] {
    let reviewersInGroup = this._config.reviewerGroupsByLabels[this._label] || []
    let potentialReviewers = reviewersInGroup.filter(
      (r: string) => !this._reviewers.includes(r) && r !== this._requester
    )

    let requiredAmountOfReviewersToAdd = Math.max(1, this._config.minAmountOfReviewers - this._reviewers.length)
    return this.randomReviewers(potentialReviewers, requiredAmountOfReviewersToAdd)
  }

  private randomReviewers (list: string[], amount: number): string[] {
    if (list.length <= amount) return list

    let reviewers = []

    while (reviewers.length < amount) {
      let index = list.length * Math.random() | 0
      let reviewer = list[index]
      reviewers.push(reviewer)
      list.splice(index, 1)
    }

    return reviewers
  }
}
