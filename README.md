# PR checklist Action

![](https://github.com/PokaInc/pr-template-action/workflows/Tests/badge.svg)

A Github Action that comments on PR with a given markdown template/checklist based on the branch name. You can have separate checklist for bugfixes, features and releases.


## Usage

Create a new workflow, e.g. `.github/workflows/checklist.yml`

```yml
on: [pull_request]

jobs:
  checklist_job:
    runs-on: ubuntu-latest
    name: Checklist job
    steps:
      - name: Checkout
        uses: actions/checkout@v1
      - name: Checklist
        uses: PokaInc/pr-template-action@v1.0.0
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          template_dir: '.the/path/to/your/templates/'
          mapping: 'feature=feature/,feat/;bugfix=bugfix/;release=release/'
```

- `token` is [the secret token provided by GitHub](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/authenticating-with-the-github_token#about-the-github_token-secret) used to make API calls on comment on PRs;
- `template_dir` is the path where to find your templates (make sure to leave a trailing slash);
- `mapping` is a list of template names matched to branch prefixes;
    - the key is the filename, without the `.md` extension, e.g. `feature.md -> feature`;
    - the value is a comma-separated list of branch prefixes, e.g. `feature/,feat/`;
    - each key-value pair is separated by a semi-comma: `;`.

Here's what a PR checklist template could look like (`feature.md`):

```md
## Feature Reminders

- [ ] do you need to add documentation?
- [ ] do I need to track new events for analytics?
- [ ] do I need to address backwards compatibility for old apps?
- [ ] do I need to optimize DB/Cache performance?
- [ ] do I need specific QA?
```
