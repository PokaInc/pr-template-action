
<p align="center">
  <a href="https://github.com/marcaube/pr-template-action/actions"><img alt="javscript-action status" src="https://github.com/marcaube/pr-template-action/workflows/units-test/badge.svg"></a>
</p>

# PR checklist Action

Comment on a PR with a given template/checklist based on the branch name. 

## Usage

```yaml
uses: poka/pr-template-action@v1
with:
  token: ${{ secrets.GITHUB_TOKEN }}
  template_dir: '.github/PULL_REQUEST_TEMPLATE/'
  mapping: 'feature=feature/,feat/;bugfix=fix/,bugfix/'
```