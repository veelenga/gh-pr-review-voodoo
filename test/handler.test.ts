import { Context } from 'probot'
import { handlePullRequestLabelChange } from '../src/handler'

describe('handlePullRequestLabelChange', () => {
  let event: any
  let context: Context

  beforeEach(async() => {
    event = {
      id: '123',
      name: 'pull_request',
      payload: {
        action: 'labeled',
        number: 1,
        pull_request: {
          title: 'New Pull Request',
          user: {
            login: 'veelenga'
          },
          requested_reviewers: []
        },
        label: {
          name: 'front-end'
        },
        repository: {
          name: 'pr-review-voodoo',
          owner: {
            login: 'veelenga'
          }
        }
      }
    }

    context = new Context(event, {} as any, {} as any)
    context.config = jest.fn().mockImplementation(async () => {
      return {
        minAmountOfReviewers: 2,
        reviewerGroupsByLabels: {
          'front-end': [ 'reviewer1', 'reviewer2' ],
          'back-end': [ 'reviewer3' ]
        }
      }
    })

    context.log.debug = jest.fn() as any
    context.log.info = jest.fn() as any
    context.log.fatal = jest.fn() as any
  })

  test('responds with the error if the configuration file failed to load', async () => {
    try {
      context.config = jest.fn().mockImplementation(async () => {})
      await handlePullRequestLabelChange(context)
    } catch (error) {
      expect(error).toEqual(new Error('the configuration file failed to load'))
    }
  })

  test('exits the process if pull requests include skip words in the title', async () => {
    const spy = jest.spyOn(context.log, 'info')
    event.payload.pull_request.title = 'skip voodoo'
    await handlePullRequestLabelChange(context)
    expect(spy.mock.calls[0][0]).toEqual('skips adding reviewers')
  })

  test('it adds reviewers to the pull request if there are available reviewers', async() => {
    context.github.pullRequests = {
      createReviewRequest: jest.fn().mockImplementation(async () => {})
    } as any

    const createReviewRequestSpy = jest.spyOn(
      context.github.pullRequests,
      'createReviewRequest'
    )

    await handlePullRequestLabelChange(context)

    expect(createReviewRequestSpy.mock.calls[0][0].reviewers).toHaveLength(2)
    expect(createReviewRequestSpy.mock.calls[0][0].reviewers).toMatchObject(['reviewer1', 'reviewer2'])
  })

  test('it does not add reviewers to the pull if there are no available reviewers', async() => {
    context.github.pullRequests = {
      createReviewRequest: jest.fn().mockImplementation(async () => {})
    } as any

    const createReviewRequestSpy = jest.spyOn(
      context.github.pullRequests,
      'createReviewRequest'
    )
    event.payload.pull_request.requested_reviewers = [
      { login: 'reviewer1' },
      { login: 'reviewer2' }
    ]

    await handlePullRequestLabelChange(context)

    expect(createReviewRequestSpy.mock.calls[0]).toEqual(undefined)
  })
})
