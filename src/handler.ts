import { Context } from 'probot'
import Voodoo, {
  AppConfig
} from './voodoo'

export async function handlePullRequestLabelChange (context : Context): Promise<void> {
  let payload = context.payload
  let pullRequest = payload.pull_request
  let label = payload.label.name
  let reviewers = (pullRequest.requested_reviewers || []).map((user: any) => user.login)
  let pullTitle = pullRequest.title
  let requestor = pullRequest.user.login

  if (pullTitle.includes('voodoo') && pullTitle.includes('skip')) {
    context.log.info('skips adding reviewers')
    return
  }

  let voodoo = new Voodoo(await getConfig(context), requestor, label, reviewers)
  let reviewersToRequest = voodoo.throwBones()

  context.log.debug(payload)
  context.log.info(`---> Request reviews: ${reviewersToRequest}`)

  if (reviewersToRequest.length > 0) {
    try {
      const params = context.issue({ reviewers: reviewersToRequest })
      const result = await context.github.pullRequests.createReviewRequest(params)
      context.log.debug(context)
    } catch (error) {
      context.log.fatal(error)
    }
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
