import { Context } from 'probot'
import Voodoo, {
  AppConfig
} from './voodoo'

export async function handlePullRequestLabelChange (context : Context): Promise<void> {
  let payload = context.payload
  let pullRequest = payload.pull_request
  let label = payload.label.name
  let requestReviewers = (pullRequest.requested_reviewers || []).map((user: any) => user.login)
  let pullTitle = pullRequest.title
  let requestor = pullRequest.user.login
  let pullNumber = pullRequest.number

  if (skipTitle(pullTitle)) {
    context.log.info('skips adding reviewers')
    return
  }

  let config = await getConfig(context)
  let listReviews = (await context.github.pulls.listReviews(context.pullRequest())).data
  let reviewers = requestReviewers.concat(listReviews.map((entry: any) => entry.user.login))

  let voodoo = new Voodoo(config, requestor, label, reviewers)
  let reviewersToRequest = voodoo.throwBones()

  context.log.debug(payload)
  context.log.info(`---> Request reviews: ${reviewersToRequest}`)

  if (reviewersToRequest.length > 0) {
    try {
      const params = context.pullRequest({ reviewers: reviewersToRequest })
      const result = await context.github.pulls.requestReviewers(params)
      context.log.debug(result)
    } catch (error) {
      context.log.fatal(error)
    }
  }
}

export async function handlePullRequestOpened (context : Context): Promise<void> {
  let pullRequest = context.payload.pull_request
  let pullTitle = pullRequest.title
  let requestor = pullRequest.user.login

  if (skipTitle(pullTitle)) {
    context.log.info('skips assigning reviewers')
    return
  }

  const config = await getConfig(context);
  if (config.autoAssignToRequestor) {
    const assignees = (pullRequest.assignees || []).map((user : any) => user.login);
    if (assignees.includes(requestor)) return

    const params = context.issue({ assignees: [requestor] });
    try {
      const result = await context.github.issues.addAssignees(params)
      context.log.debug(result);
    } catch (error) {
      context.log.fatal(error);
    }
  }
}

function skipTitle(pullTitle : String) {
  return pullTitle.includes('voodoo') && pullTitle.includes('skip');
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
