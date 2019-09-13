import { Context } from 'probot'
import ReviewVoodoo, {
  AppConfig
} from './review_voodoo'


export async function handlePullRequestLabelChange(context : Context): Promise<void> {
  let payload = context.payload
  let label = { name: payload.label.name, action: payload.action }
  let reviewers = (payload.pull_request.request_reviewers || []).map((user: any) => user.login)

  let voodoo = new ReviewVoodoo(await getConfig(context), label, reviewers);

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

async function getConfig(context : Context): Promise<AppConfig> {
  const config: AppConfig | null = await context.config<AppConfig | null>(
    'pr-review-voodoo.yml'
  )

  if (!config) {
    throw new Error('the configuration file failed to load')
  }

  config.minAmountOfReviewers = config.minAmountOfReviewers || 1
  config.maxAmountOfReviewers = config.maxAmountOfReviewers || 2
  return config
}
