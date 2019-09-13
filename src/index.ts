import { Application } from 'probot'
import { handlePullRequestLabeled } from './handler'

export = (app: Application): void => {
  app.on('pull_request.labeled', handlePullRequestLabeled);
  app.on('pull_request.unlabeled', handlePullRequestLabeled);
}
