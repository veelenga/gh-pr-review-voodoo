import { Context } from 'probot'

interface AppConfig {
  reviewGroups: { [key: string]: string[] }
}

export async function handlePullRequestLabeled(context : Context): Promise<void> {
  const config: AppConfig | null = await context.config<AppConfig | null>(
    'pr-review-voodoo.yml'
  )
  if (!config) {
    throw new Error('the configuration file failed to load')
  }

  console.log(context.payload.action)
  console.log(context.payload.label.name)
  console.log(context.payload.pull_request.requested_reviewers)

  const params = context.issue({ reviewers: ['super-reviewer'] })
  const result = await context.github.pullRequests.createReviewRequest(
    params
  )
}
