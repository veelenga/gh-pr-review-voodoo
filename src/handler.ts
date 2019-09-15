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

  if (pullTitle.includes('voodoo') && pullTitle.includes('skip')) return

  let voodoo = new Voodoo(await getConfig(context), requestor, label, reviewers)

  voodoo.throwBones()

  context.log.debug(payload)
  context.log.info(`---> Request reviews: ${voodoo.reviewersToRequest}`)

  if (voodoo.reviewersToRequest.length > 0) {
    try {
      const params = context.issue({ reviewers: voodoo.reviewersToRequest })
      const result = await context.github.pullRequests.createReviewRequest(params)
      context.log.debug(context)
    } catch(error) {
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
