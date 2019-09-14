import { Application } from 'probot'
import { handlePullRequestLabelChange } from './handler'

export = (app: Application): void => {
  app.on('pull_request.labeled', handlePullRequestLabelChange)
}
