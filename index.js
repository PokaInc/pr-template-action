const core = require('@actions/core');
const github = require('@actions/github');
const {readdirSync, readFileSync} = require("fs");

async function run() {
    try {
        if (github.context.eventName !== 'pull_request') {
            core.info('[!] Commenting only works on pull_request event!');
            return;
        }

        // Get the PR context
        const issue = github.context.issue;
        const branch = github.context.payload.pull_request.head.ref;

        // Get the actions configs
        const mapping = core.getInput('mapping');
        const template_dir = core.getInput('template_dir');
        const default_template = core.getInput('default');
        const templates = readdirSync(template_dir);

        // Prepare the API client
        const token = core.getInput('token');
        const octokit = new github.GitHub(token);

        // Check if there's an existing comment already...
        let comments = (
            await octokit.issues.listComments({
                owner: issue.owner,
                repo: issue.repo,
                issue_number: issue.number,
            })
        ).data.filter(comment => comment.user.login === 'github-actions[bot]');

        if (comments.length !== 0) {
            core.info('[!] The bot has already commented on this PR!');
            return;
        }

        // Everything's good, comment on the PR!
        mapping.split(';').forEach(rule => {
            let [name, patterns] = rule.split('=');
            let filename = `${name}.md`;

            patterns.split(',').forEach(pattern => {
                if (branch.startsWith(pattern)) {
                    if (!templates.includes(filename)) {
                        core.setFailed(`Could not find template: ${filename}!`);
                        return;
                    }

                    create_comment(octokit, issue, template_dir, filename);

                    return;
                }
            });
        });

        // No pattern matched, let's check for the default template
        if (default_template) {
            let filename = `${default_template}.md`;

            if (!templates.includes(filename)) {
                core.setFailed(`Could not find template: ${filename}!`);
                return;
            }

            create_comment(octokit, issue, template_dir, filename);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

/**
 * Post a comment with the content of `filename` to a given GitHub issue.
 */
function create_comment(octokit, issue, template_dir, filename) {
    let file_content = readFileSync(`${template_dir}${filename}`, {encoding: "utf8"});

    octokit.issues.createComment({
        owner: issue.owner,
        repo: issue.repo,
        issue_number: issue.number,
        body: file_content,
    });
}

run()
