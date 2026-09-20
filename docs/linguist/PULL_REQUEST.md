# Pull Request Description — Add Nova language

> Fill in every placeholder marked `<...>` before submitting.
> Linguist's PR template **must** be used and fully completed — maintainers
> will not review a PR where the template is missing or left blank.

---

## Description

Hello, and thank you for maintaining Linguist. 👋

This pull request adds support for **Nova**, a small general-purpose programming
language that runs on Node.js and uses the `.nova` file extension.

Nova has a hand-written lexer, a recursive-descent parser producing an AST, and a
tree-walking interpreter, all distributed as a single npm package with a `nova`
CLI entry point. The extension `.nova` is used exclusively by this language and,
to the best of my knowledge, does not collide with any language currently listed
in `languages.yml`, so no disambiguation heuristic should be required.

Reference implementation: <https://github.com/<user>/nova>
Language documentation: <https://github.com/<user>/nova#readme>
TextMate grammar (`source.nova`): <https://github.com/<user>/nova-tmlanguage>

### Language metadata

| Field | Value |
| --- | --- |
| Name | Nova |
| Type | `programming` |
| Extension | `.nova` |
| Interpreter | `nova` |
| Color | `#ff5722` |
| TextMate scope | `source.nova` |
| Ace mode | `text` |

The color `#ff5722` was chosen to match the project's existing branding
(documentation, logo, and the VS Code extension icon) and is not currently in use
by another language in `languages.yml`.

## Checklist

- [ ] I am adding a new language.
- [ ] The extension `.nova` is not currently associated with any other language.
- [ ] I have added an entry to `lib/linguist/languages.yml` in the correct
      alphabetical position, with `language_id` generated via `script/update-ids`.
- [ ] I have added the syntax highlighting grammar with
      `script/add-grammar https://github.com/<user>/nova-tmlanguage`.
      The grammar is released under the MIT license, which is on the list of
      licenses accepted by Linguist.
- [ ] I have added samples under `samples/Nova/`.
- [ ] `bundle exec rake test` passes locally.

## Sample licensing

The sample file `samples/Nova/billing.nova` was written specifically for this
pull request. It is real, executable Nova code — not a tutorial snippet — and
exercises the constructs a typical Nova program uses: variable bindings with
`let`, string/integer/float/boolean values, arithmetic and comparison operators,
chained `if / else if / else` branching, single-line and block comments, and
string concatenation in `print` output. I am happy for it to be included under
the MIT license that covers Linguist.

<!--
  If you later add samples taken from existing repositories instead, replace the
  paragraph above with the original source link and its license.
-->

## Usage evidence

Search query used (forks excluded, restricted to the extension):

```
NOT is:fork path:*.nova
```

<https://github.com/search?type=code&q=NOT+is%3Afork+path%3A*.nova>

- Files indexed in the last year: **<number shown at the top of the search results>**
- Distribution across unique `:user/:repo` combinations: **<summary of what you observed>**
- Repositories not owned by me that use `.nova`: **<list a representative selection>**

<!--
  Please be aware of the usage requirements in CONTRIBUTING.md before
  submitting: at least 2000 indexed files for an extension expected to appear
  more than once per repository, excluding forks, with a reasonable spread
  across distinct user/repo combinations. Files concentrated under the language
  author's own account are filtered out of the assessment.
-->

Thank you for taking the time to look at this. I'm happy to make any changes you
suggest — whether to the grammar, the sample, or the metadata — and equally happy
to hold the PR open, or close and resubmit later, if you'd prefer to wait for
broader adoption before Nova is added.
