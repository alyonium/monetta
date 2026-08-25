---
name: feature-json-implement-step
description: Implements a specific user story from feature.json. Requires the exact story number and an execution plan as input. Reads the PRD, feature spec, then implements and tests. Invoke manually or via feature-json-orchestrate.
---

## Your Task

1. Read `current-task/feature.json` and `current-task/progress.txt`
2. Read relatedSources in `current-task/feature.json`
3. Pick story specified by user. Work only on that story.
4. Implement that user story
5. Run the project's appropriate type check and linter check commands — both must pass with 0 errors. Use the project's package scripts, docs, or learnings to identify the correct commands instead of assuming fixed script names.
6. Update the PRD to set `passes: true` for the completed story

Progress Report Format
APPEND to progress.txt (never replace, always append, create file if missing):

## [Date/Time] - [Story ID]
- What was implemented
- **Learnings for future iterations:**
    - Patterns discovered (e.g., "this codebase uses X for Y")
    - Gotchas encountered (e.g., "don't forget to update Z when changing W")
    - Useful context (e.g., "the evaluation panel is in component X")
---
Keep is short. Small sentences. Bullet points.

## Quality Requirements

- Typecheck, lint, and test checks must pass with 0 errors.
- Do NOT commit broken code.
- Keep changes focused and minimal.
- Follow existing code patterns.

save `current-task/learnings.txt` if something will be needed for next stories

## Important

- Work only on story specified in the task.
- Do not create separate feature branches. Work directly in `master`.
- Do not commit anything.
- Keep CI green