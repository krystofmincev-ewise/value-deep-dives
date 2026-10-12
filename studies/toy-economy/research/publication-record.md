# Public delivery — 12 October 2026

The combined paper is published: [Who buys what AI makes?](https://krystofmincev.substack.com/p/who-buys-what-ai-makes).

- [Public source, experiments and results](https://github.com/krystofmincev-ewise/value-deep-dives/tree/main/studies/toy-economy).
- [Companion reading editions and simulation explorers](https://krystofmincev-ewise.github.io/value-deep-dives/).
- [Detailed appendix](https://krystofmincev-ewise.github.io/value-deep-dives/site/05-appendix.html).

## Review and release evidence

Two separate subagents reviewed the combined manuscript: [economics](combined-economics-review.md) and [readability](combined-readability-review.md). Their findings were addressed before publication. Both reports identify the final reviewed files:

- Main manuscript SHA-256: `c83b66e7fc3c1ba5e9ea93799c42114abd9d601894e4524c25c3a209ddcb0dab`.
- Appendix SHA-256: `bf4a7813167f43bb30277ef8fa6c3e88611e9ab16811eef3d8b88fb035aa14fe`.

The release passed 187 Python tests, seven animation-player tests, strict source type checking and Ruff checks. The three new publishing renderers also passed their scoped strict type checks. See [verification notes](combined-edition-verification.md).

The source release was merged in [PR #5](https://github.com/krystofmincev-ewise/value-deep-dives/pull/5), main commit `1c1e2b3934ad7e18042a85b389ff8d8cbd58b3cb`. Repository visibility was public and anonymous GitHub contents retrieval succeeded. GitHub Pages deployed successfully from `ewisenl/toy-economy-pages`, commit `e843b3bed24a9c9fb3771d9f29d67b1e428c5385`.

## Substack verification

Substack confirmed “Your post is live!” and the public article was opened and inspected. Its body matches the reviewed export after normalizing typographic quotes and whitespace. The public repository link is near the top. All 17 figures were imported into Substack image hosting; all were loaded in the prepublication preview. The live article retains all 17 figures and uses lazy loading below the viewport. Desktop and 375-pixel mobile previews were inspected; the mobile preview had no horizontal overflow.

Publication was immediate, available to everyone and web-only. No subscriber email, app notification or promotional Note was sent. The appendix, animated edition and explorers are linked from the article. Publication screenshots and operational notes are retained locally, outside the public repository.

This record adds delivery metadata only; it does not alter the reviewed manuscript, figures, model or results.
