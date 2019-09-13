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

  let reviewers = await context.github.pullRequests.listReviewRequests(context.issue())
  console.log(reviewers.data.users.map((user) => user.login))

  const params = context.issue({ reviewers: ['super-reviewer'] })
  const result = await context.github.pullRequests.createReviewRequest(
    params
  )
}
