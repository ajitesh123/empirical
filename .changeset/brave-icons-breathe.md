---
"web": patch
---

fix: replace tabs in sample card with dropdown selector


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
