import { Application } from 'probot' // eslint-disable-line no-unused-vars

export = (app: Application) => {
  app.on('pull_request.labeled', async (context) => {
    const params = context.issue({ reviewers: ['super-reviewer'] })
    const result = await context.github.pullRequests.createReviewRequest(
      params
    )
    context.log(result)
  })
}
