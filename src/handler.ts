import { Context } from 'probot'
import Voodoo, {
  AppConfig
} from './voodoo'

export async function handlePullRequestLabelChange (context : Context): Promise<void> {
  let payload = context.payload
  let label = payload.label.name
  let reviewers = (payload.pull_request.requested_reviewers || []).map((user: any) => user.login)

  let voodoo = new Voodoo(await getConfig(context), label, reviewers)

  voodoo.throwBones()

  context.log.info(`---> Request reviews: ${voodoo.reviewersToRequest}`)

  if (voodoo.reviewersToRequest.length !== 0) {
    const params = context.issue({ reviewers: voodoo.reviewersToRequest })
    const result = await context.github.pullRequests.createReviewRequest(params)
  }
}

async function getConfig (context : Context): Promise<AppConfig> {
  const config: AppConfig | null = await context.config<AppConfig | null>(
    'pr-review-voodoo.yml'
  )

  if (!config) {
    throw new Error('the configuration file failed to load')
  }

  if (!config.reviewerGroupsByLabels) {
    throw new Error('reviewer group by labels definition is missing')
  }

  config.minAmountOfReviewers = config.minAmountOfReviewers || 1
  return config
}
