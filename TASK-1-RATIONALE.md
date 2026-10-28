# HNG15 Week 5 · Individual Task 1

> “This is not a visual task. It is an interaction design task.”
> “Reproduce Ziki faithfully. Keep the product's look. Change the flow.”

## WHO

The user is the workspace owner overseeing AI agents. The supplied signed-in screenshot identifies Mercy Gatwiri and the Zedu workspace. The owner perspective comes from the assignment brief; the screenshot alone does not establish the user's role or agent permissions.

## INTENT

“I want to decide whether an agent may merge this completed change.” The owner needs to spot the handoff and make that one decision without searching through agent activity.

## EMOTION

At this moment, the owner may feel interrupted or unsure whether the agent is asking for a routine check or a consequential decision. This is a design assumption, not a user-research finding.

## DECISION

Should the owner approve the illustrative merge request for issue #229 or ask the agent for changes?

## OLD UI

The reference dashboard shows a welcome heading, a New issue action, four account and issue overview cards, and an “Issues assigned to me” table. The visible table includes issue, priority, status, stage, votes, and reported date. The reference does not show an agent approval request or explain how an owner discovers one. It does not establish that the live product lacks notifications or other approval flows.

## CHANGE

Keep the reference dashboard structure and add one compact notice above the existing issue table when Product is selected: Nova is waiting for a decision about merging issue #229. “Review” opens a short inline explanation and lets the owner approve the merge or request changes. A small status message confirms the choice in this local demonstration; it does not perform a real merge.

The notice makes the human handoff visible where the related issue already appears. The inline detail keeps the reason next to the action and avoids sending the owner to a new dashboard, issue list, or separate workflow. The sample request and its connection to #229 are illustrative assumptions for this concept, not facts established by the reference screenshots.

## AI / HUMAN

The agent may handle routine work within its granted permissions, including implementing and checking the fix. It pauses when an action exceeds its authority or workspace policy reserves that consequential action for a person. Here, Nova may prepare the fix, but the human decides whether it can be merged.

## RETAINED AND REMOVED

Retained from the described reference: the light appearance, Ziki wordmark, workspace selector, project navigation, agent and account controls, points and notifications, welcome area, four overview cards, and assigned-issues table. Both `/` and `/dashboard` render the dashboard so the submission appears at the deployed root URL.

Removed from the previous concept: Owner’s Decision Desk; multi-request queue and detailed evidence/risk/recommendation cards; at-risk and factory-progress panels; agent work list; sample progress totals; filter and issue-creation interactions; issue quick-view; and explanatory panels below the landing-page hero. These additions were not needed for the single decision and made the dashboard busier than the reference.

## OBSERVATIONS AND ASSUMPTIONS

**Observed in the supplied reference, as described for this reproduction:** the signed-in Zedu dashboard has the structure listed above and uses a light appearance. The supplied screenshots are the visual source of truth. No screenshot files were present in the project directory when this revision was made, so detailed pixel measurements could not be independently checked here.

**Assumptions in this concept:** a workspace owner supervises agents; Nova prepared the sample fix; merging requires human approval; and a concise in-context prompt would make that handoff easier to recognize. These assumptions support the prototype interaction and are not claims about Ziki's production behavior.

## IMPLEMENTATION AND CHECKS

The existing React/Vite stack and Vercel rewrite are retained. The root route displays the dashboard on first load; `/dashboard` also resolves to it. Approval controls update local demonstration state only. The interface uses semantic buttons, headings, navigation labels, table headers, expanded-state attributes, and a status announcement. At narrow widths, the project navigation becomes a toggleable menu, the table becomes stacked rows, and the decision section wraps into a vertical layout. Reduced-motion preferences are respected.

Run `npm.cmd run build` to verify the production bundle. Manual browser and assistive-technology checks are still needed to confirm actual rendered behavior across browsers and devices.
