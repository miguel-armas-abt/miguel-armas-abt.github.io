export function filterRepos(repos, term) {
    return repos.filter(r =>
        r.name.toLowerCase().includes(term) ||
        (r.description && r.description.toLowerCase().includes(term))
    );
}
