# Empirical

[![npm](https://img.shields.io/npm/v/@empiricalrun/cli)](https://npmjs.com/package/@empiricalrun/cli)
[![Discord](https://img.shields.io/badge/discord-empirical.run-blue?logo=discord&logoColor=white&color=5d68e8)](https://discord.gg/NeR6jj8dw9)

Empirical is the fastest way to test different LLMs, prompts and other model configurations, across all the scenarios
that matter for your application.


<This is new piece which should relfect in incremental commit>
  async def get_new_pr_changes(self, pr_number: int) -> Dict[str, Any]:
    if not self.github_installation_id:
        raise HTTPException(status_code=404, detail={
            "success": False,
            "msg": "You haven't installed ArchieAI's GitHub App",
        })

    access_token = await self.get_access_token()
    headers = {"Authorization": f"Bearer {access_token}"}

    base_url = f"{os.environ['GITHUB_API_BASE_URL']}/repos/{self.repo_namespace_without_origin}"
    pr_url = f"{base_url}/pulls/{pr_number}"

    # Fetch PR details, comments, and commits concurrently
    pr_coro = self._make_github_request('GET', pr_url, headers=headers)
    comments_coro = self._make_github_request('GET', f"{pr_url.replace('/pulls/', '/issues/')}/comments", headers=headers)
    commits_coro = self._make_github_request('GET', f"{pr_url}/commits", headers=headers)

    pr_response, comments_response, commits_response = await asyncio.gather(
        pr_coro, comments_coro, commits_coro
    )

    pr_data = pr_response.json()
    comments_data = comments_response.json()
    commits_data = commits_response.json()
</This>This is new piece which should relfect in incremental commit>

With Empirical, you can:

- Run your test datasets locally against off-the-shelf models
- Test your own custom models and RAG applications (see [how-to](https://docs.empirical.run/models/custom))
- Reports to view, compare, analyze outputs on a web UI
- Score your outputs with [scoring functions](https://docs.empirical.run/scoring/basics)
- Run [tests on CI/CD](https://docs.empirical.run/running-in-ci)

[Watch demo video](https://www.loom.com/share/5992fdf0edc443e282f44936e6c32672) | [See all docs](https://docs.empirical.run)


## Usage

[See quick start on docs →](https://docs.empirical.run/quickstart)

Empirical bundles together a CLI and a We - web app. The CLI handles running tests and
the web app visualizes results.

Everything runs locally, with a JSON configuration file, `empiricalrc.json`.

> Required: [Node.js](https://nodejs.org/en) 20+ needs to be installed on your system.

### Start with a basic example

In this example, we will ask an LLM to parse user messages to extract entities and
give us a structured JSON output. For example, "I'm Alice from Maryland" will
become `"{name: 'Alice', location: 'Maryland'}"`.

Our test will succeed if the model outputs valid JSON.

1. Use the CLI to create a sample configuration file called `empiricalrc.json`.

    ```sh
    npx @empiricalrun/cli init
    cat empiricalrc.json
    ```

2. Run the test samples against the models with the `run` command. This step requires
   the `OPENAI_API_KEY` environment variable to authenticate with OpenAI. This
   execution will cost $0.0026, based on the selected models.

    ```sh
    npx @empiricalrun/cli run
    ```

3. Use the `ui` command to open the reporter web app and see side-by-side results.

    ```sh
    npx @empiricalrun/cli ui
    ```

### Make it yours

Edit the `empiricalrc.json` file to make Empirical work for your use-case.

- Configure which [models to use](https://docs.empirical.run/models/basics)
- Configure [your test dataset](https://docs.empirical.run/dataset/basics)
- Configure [scoring functions](https://docs.empirical.run/scoring/basics) to grade output quality


## Contribution guide

See [development docs](development/README.md).
