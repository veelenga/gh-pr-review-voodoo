import Voodoo, { AppConfig } from '../src/voodoo'

describe('Voodoo', () => {
  let config: AppConfig

  beforeEach(() => {
    config = {
      minAmountOfReviewers: 2,
      autoAssignToRequestor: false,
      reviewerGroupsByLabels: {
        label1: [ 'reviewer1', 'reviewer2' ],
        label2: [ 'reviewer3']
      }
    }
  })

  describe('throwBones', () => {
    test('it randomly selects min amount of reviewers for first label', async () => {
      let voodoo = new Voodoo(config, 'requester', 'label1', [])
      expect(voodoo.throwBones()).toMatchObject(['reviewer1', 'reviewer2'])
    })

    test('it randomly selects min amount of reviewers for second label', async () => {
      let voodoo = new Voodoo(config, 'requester', 'label2', [])
      expect(voodoo.throwBones()).toMatchObject(['reviewer3'])
    })

    test('it does not select reviewers which participate review', async () => {
      let voodoo = new Voodoo(config, 'requester', 'label1', ['reviewer1'])
      expect(voodoo.throwBones()).toMatchObject(['reviewer2'])
    })

    test('it can not find reviewers if all are already participate review', async () => {
      let voodoo = new Voodoo(config, 'requester', 'label1', ['reviewer1', 'reviewer2', 'reviewer3'])
      expect(voodoo.throwBones()).toMatchObject([])
    })

    test('it does not select requester as a reviewer', async () => {
      let voodoo = new Voodoo(config, 'reviewer1', 'label1', [])
      expect(voodoo.throwBones()).toMatchObject(['reviewer2'])
    })

    test('it tries to select at least one reviewer if a number of reviewers is enough', async () => {
      let voodoo = new Voodoo(config, 'requester', 'label1', ['reviewer1', 'reviewer3'])
      expect(voodoo.throwBones()).toMatchObject(['reviewer2'])
    })

    test('it does not select a new reviewer if a number of reviewers is enough no potentials', async () => {
      let voodoo = new Voodoo(config, 'requester', 'label1', ['reviewer1', 'reviewer2'])
      expect(voodoo.throwBones()).toMatchObject([])
    })
  })
})
