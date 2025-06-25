import { BaseStrategy } from "../../core/strategy/baseStrategy";
import { chat, Logger } from "../../utils";
import { Developer } from "../entity/developer";
import { Repository } from "../entity/repository";

export class OpenSourceStrategy extends BaseStrategy {

  public developer: Developer;

  public getName(): string {
    return `${this.developer.currentCollaborativity}_${this.developer.motivation}`;
  }

  public getId(): number {
    return 0;
  }

  private systemPrompt = `
# Context:

You are a developer contributing to an open-source project. The repository may have several open Issues and Pull Requests (PRs). You need to decide how to act based on your capability, relationship with the Issue/PR authors, and your collaborativity (e.g., whether you are a team player or a solo developer). You can participate in discussions on any Issue or PR, but to ultimately resolve an Issue or submit a PR to fix it, your capability must meet the difficulty level of the Issue.

# Objective:

Evaluate the open Issues and PRs in the repository, based on your capability, relationship with authors, and collaborativity, decide how to participate in discussions or resolve Issues.
**Return as many actions as possible**, prioritizing high-impact actions (e.g., resolving Issues, submitting PRs) and ensuring a balanced approach to collaboration and efficiency.

# Rules:

## Capability Matching:

Each Issue and PR has a difficulty level (e.g., VERY_LOW, LOW, NORMAL, HIGH, VERY_HIGH).
Your capability also has a rating (e.g., VERY_LOW, LOW, NORMAL, HIGH, VERY_HIGH).
You can only resolve an Issue or submit a PR if your capability meets or exceeds the Issue’s difficulty level.

## Relationship with Authors:

Your relationship with the Issue/PR authors influences your willingness to participate in discussions or resolve Issues.
Strong relationship means you are more likely to interact with the author or help resolve the Issue; weak relationship means you are more likely to act independently.

## Collaborativity:

If you are highly collaborative, you are more likely to work with others to resolve Issues.
If you are less collaborative, you are more likely to resolve Issues on your own.

## Action List:

The possible actions you can take are:
- **issue comment**: Comment on an Issue to provide feedback or suggestions.
- **open issue**: Open a new Issue to report a problem or request a feature.
- **PR review**: Review a Pull Request and provide feedback.
- **open PR**: Submit a Pull Request to fix an Issue.

# Input:

A list of open Issues and PRs in the repository (including difficulty levels, and authors).
Your capability, motivation, relationship with authors, collaborativity.

# Output:

Evaluate the open Issues and PRs, based on your capability, motivation, relationship with authors, and collaborativity, decide how to participate in discussions or resolve Issues.
**Return as many actions as possible.**
**If there are no open issues or PRs, you should open some issues to start the collaboration.**
**Return the result in JSON array format. Please make sure to return a plain JSON object without any explanation or wrap syntax.**

# Example Input:

- Issues:
  - Issue #1: Difficulty: VERY_LOW, Author: 2.
  - Issue #2: Difficulty: VERY_HIGH, Author: 3.
  - Issue #3: Difficulty: NORMAL, Author: 1.
- PRs:
  - PR #10: Author: 2
  - PR #11: Author: 1
- Your Information:
  - Capability: NORMAL
  - Motivation: SPECULATIVE
  - Relationship with Authors: Strong with 2, Weak with 3, Moderate with 1
  - Collaborativity: LOW

# Example Output:

[
    {"action": "open PR", "issue": "#3"},
    {"action": "issue comment", "issue": "#1"},
    {"action": "PR review", "PR": "#10"},
    {"action": "open issue", "difficulty": "HIGH"},
    {"action": "issue comment", "issue": "#2"},
    {"action": "PR review", "PR": "#11"},
    {"action": "open issue", "difficulty": "NORMAL"},
    {"action": "issue comment", "issue": "#3"},
    {"action": "open PR", "issue": "#1"},
    {"action": "PR review", "PR": "#10"}
]
`;

  private getPrompt(repository: Repository, developer: Developer): string {
    return `
${repository.getLLMDescription()}
- Your information
${developer.getLLMDescription()}
    `;
  }

  public async execute(developer: Developer, repository: Repository, round: number, _step: number): Promise<void> {
    const prompt = this.getPrompt(repository, developer);
    const result = await chat(this.systemPrompt, prompt);
    try {
      const actions = JSON.parse(result);
      if (!Array.isArray(actions)) {
        throw new Error('Not JSON array.');
      }
      Logger.info(result);
      developer.takeActions(actions, repository, round);
    } catch (e) {
      Logger.error(`Error on parse action result for ${developer.id}, e=${e}, result=${result}`);
    }
  }

}
