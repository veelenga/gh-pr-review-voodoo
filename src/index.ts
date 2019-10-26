import { Application } from 'probot'
import {
  handlePullRequestLabelChange,
  handlePullRequestOpened
} from './handler'

export = (app: Application): void => {
  app.on('pull_request.labeled', handlePullRequestLabelChange)
  app.on('pull_request.opened', handlePullRequestOpened)
}
