# GitHub PR Review Voodoo

> A GitHub App built with [Probot](https://github.com/probot/probot) that A Probot app

A GitHub bot to improve PR review workflow. It is able to:

- [x] request PR reviews based on selected labels
- [ ] assign PR to requestor or specific people
- [ ] add/remove labels when PR is opened or reviewed

## Setup

```sh
# Install dependencies
yarn install

# Run the bot
yarn run dev
```

## Config

```yml
# .github/pr-review-voodoo.yml

# Reviews will be requested from desired people once PR is labeled.

reviewerGroupsByLabels:
  front-end:            # label name
    - reviewer1         # user github login
    - reviewer2
    - reviewer3

  back-end:
    - reviewer4
    - reviewer5

  fullstack:
    - reviewer3
    - reviewer4

minAmountOfReviewers: 2 # a minimum amount of reviewers to be added to PR

```

## Contributing

If you have suggestions for how gh-pr-review-voodoo could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2019 Vitalii Elenhaupt <velenhaupt@gmail.com>
