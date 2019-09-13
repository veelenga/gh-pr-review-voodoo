import { Context } from 'probot'
import ReviewVoodoo, {
  AppConfig
} from './review_voodoo'


export async function handlePullRequestLabelChange(context : Context): Promise<void> {
  const config: AppConfig | null = await context.config<AppConfig | null>(
    'pr-review-voodoo.yml'
  )
  if (!config) {
    throw new Error('the configuration file failed to load')
  }

  let payload = context.payload
  let label = { name: payload.label.name, action: payload.action }
  let reviewers = (payload.pull_request.request_reviewers || []).map((user: any) => user.login)

  let voodoo = new ReviewVoodoo(config, label, reviewers);

  voodoo.execute()

  if (voodoo.reviewersToDelete.length !== 0) {
    const params = context.issue({ reviewers: voodoo.reviewersToDelete })
    const result = await context.github.pullRequests.deleteReviewRequest(params)
  }

  if (voodoo.reviewersToCreate.length !== 0) {
    const params = context.issue({ reviewers: voodoo.reviewersToCreate })
    const result = await context.github.pullRequests.createReviewRequest(params)
  }
}
