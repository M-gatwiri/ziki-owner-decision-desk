# HNG15 Week 5 · Individual Task 1

## Project summary

This independent React reproduction follows the Ziki screenshots supplied for the task: the dark public landing page and a signed-in Ziki dashboard. It adds a clearly labeled **Owner’s Decision Desk** proposal inside the dashboard. The proposal groups human approval requests, at-risk work, and overall agent progress. All workspace content beyond what is visible in the screenshots is illustrative and local to this demonstration.

## WHO

A project owner supervising multiple AI agents across projects. The dashboard screenshot shows the account name Mercy Gatwiri and a workspace selector labeled “Zedu”; this concept uses those labels to reflect the supplied screenshot. The screenshot does not establish whether the displayed profile is the intended target user, so the owner persona is based on the task brief.

## INTENT

“I want to know whether my agents are making progress, and I only want to intervene when my judgment or approval is needed.”

## EMOTION

The owner wants confidence and control without unnecessary monitoring or notification overload. A concise view of exceptions should help them stay informed without opening every issue or pull request.

## KEY DECISION

Is an agent’s proposed action within its authority and safe to approve, or should the agent wait, revise its plan, or continue within its existing permissions?

## EXISTING EXPERIENCE

The supplied screenshots show two surfaces:

1. **Ziki public landing page:** A navy page with a rounded top navigation, Ziki wordmark, links for How it works, AI agents, Developers, Points, API Spec, and Get started. The hero centers the message “Move every issue forward with your agents,” a short description of human + AI workflows, and a Get started free action. A fine vertical-line grid decorates the background.
2. **Signed-in Ziki dashboard, “Zedu” workspace:** A dark header shows the Ziki mark, workspace selector, Product/Marketing/Security navigation, Agents control, Mercy Gatwiri account menu, points, and notifications. The body has a welcome heading, New issue action, four overview cards, and an “Issues assigned to me” table with votes, issue, type, priority, status, stage, and reported date.

The second screenshot is identified as a Ziki dashboard because its header carries the Ziki mark and product navigation. “Zedu” is the selected workspace label in that screenshot, not the product name. The screenshots were supplied by the user and are the visual evidence used here. Direct access to `ziki.dev` was unavailable in the browser tool, so this document makes no claims about live pages beyond those screenshots or the product summary in the original brief. No private application screens or source code were inspected.

## PROBLEM

**Verified from the screenshots:** The dashboard provides account/issue summary cards and an assigned-issues table. The screenshots do not visibly show an owner-level summary of agent work, a queue of approval requests, an agent recommendation with evidence, or an explanation of what approval/rejection will cause.

**Hypothesis to evaluate:** An owner overseeing several agents may need to visit multiple issues or project areas to understand where work is progressing and where an approval boundary has been reached. The screenshots alone cannot establish how the live product handles agent requests, notifications, or multi-agent progress, so this is a design hypothesis, not a verified limitation of Ziki.

## PROPOSED CHANGE

Add an Owner’s Decision Desk below the familiar dashboard metrics. It surfaces only illustrative requests marked as requiring owner input, lets the owner select a request, and explains the responsible agent, project/issue, reason for pausing, recommendation, evidence, risk, and outcomes of approval or rejection. Beside the request queue, an at-risk panel explains the sample failure, prior attempts, next step, and whether the owner needs to act. A compact progress summary tracks active, completed, blocked, and awaiting-decision work.

The existing Ziki-like header, account overview cards, and assigned-issues table remain visible to anchor the concept in the supplied dashboard reference. The public landing page is also reproduced at the root route, with links to the local dashboard concept at `/dashboard`.

## HUMAN–AGENT BOUNDARY

Agents may perform routine work within permissions already granted, collect evidence, explain findings, and recommend actions. They should pause when an action exceeds their permissions or when workspace policy explicitly reserves it for human approval. Humans retain those consequential decisions and other high-risk actions reserved by policy. Routine work does not require approval by default.

The Approve and Reject buttons only update local React state. An approved example leaves the pending queue and increments the illustrative completed total. A rejected example leaves the pending queue and increments the illustrative blocked total. A notice explicitly says that no external action was taken. There are no API calls, repository integrations, production approvals, or agent connections.

## BEFORE AND AFTER

**Before, as shown:** A signed-in dashboard gives an overview of the owner’s points and issue counts, then shows assigned issues in a table. The public landing page describes Ziki’s human + AI workflow at a high level.

**After, proposed:** Keep the screenshot’s dashboard structure and add the decision queue, contextual decision detail, at-risk explanation, and agent progress summary. The owner can inspect evidence and consequences before using a demo-only control. The original issue table stays below the proposal as the familiar reference context.

## DESIGN DECISIONS

- Retain the screenshot’s navy background, blue actions and labels, rounded overview cards, compact header navigation, and issue table structure.
- Put the decision queue and detail beside each other on wider screens so the owner can compare requests without losing context; stack them on smaller screens.
- Separate requests that need approval from routine active work and from blocked work. A blocked item states whether intervention is needed.
- Explain risks and outcomes in words as well as with color-coded labels, so color is not the only status cue.
- Label the proposed interaction and illustrative data in place, and repeat the no-production-action boundary at the decision controls.
- Keep the screenshot’s points and issue summary patterns as visual context. Their sample values do not represent live Ziki data.

## LIMITATIONS

- This is an independent reproduction and concept, not Ziki source code or a Ziki deployment.
- The supplied reference images are the only visual source. Live `ziki.dev` could not be opened with the available browser tool.
- Header, dashboard cards, sample issue row, and table structure are recreated from visible screenshots. The public landing page hero and header are also recreated from the supplied screenshot; lower landing-page content is a short concept explanation, not a claim about an unobserved live section.
- Profile labels and visible dashboard counts follow the supplied signed-in screenshot. Agent names, decision requests, evidence, risks, activity, progress counts, dates beyond the screenshot’s visible example, and action outcomes are sample data.
- Navigation, account/agent/notification menus, issue creation, voting, issue quick view, and decision outcomes are local demonstrations. They do not imply equivalent live Ziki behavior.
- There is no backend, environment variable, or network data fetch. Vercel rewrites `/dashboard` to the single-page app entry so direct navigation works on static hosting. Because there are no asynchronous data requests, the interface does not need a network loading or network error screen. It has empty states for outstanding decisions and filtered issue views.

## EVALUATION PLAN

Use representative multi-agent delivery scenarios with project owners. Compare the current owner workflow with this concept. Measure how quickly participants identify the items that need them, how accurately they explain the recommendation and risk, time to reach a decision, issues/pages opened along the way, and missed or unnecessary interventions. Ask participants what they believe an approval will do before clicking, to check whether the consequences are clear. Follow up with interviews about confidence, monitoring effort, and whether the progress summary hides important detail. Test keyboard-only navigation and narrow-screen use. Do not treat the illustrative data as user research or analytics.

## EVIDENCE

- **Visual reference:** The two user-supplied screenshots: Ziki public landing page and signed-in dashboard in the “Zedu” workspace.
- **Implementation evidence:** `npm.cmd run build` passed. The Vite development server returned HTTP 200 for `/`, `/dashboard`, and the app entry. The built preview returned HTTP 200 for the HTML, JavaScript, and CSS assets. The responsive CSS breakpoint is included in the served stylesheet. No lint script is defined.
- **Interaction evidence to capture for submission:** a selected pending decision with its detail, an approved and a rejected demo state with changed counts, the no-pending empty state, the at-risk and progress panels, filtered issue empty state, and mobile-width screenshots.
- **Testing limits:** No browser automation tool was available in this session. Approval/rejection and empty-state logic were reviewed in source but not clicked in a browser; mobile overflow and screen-reader behavior were not browser-tested. A clean dependency install could not be completed because package registry access stalled. Build results and unexecuted checks must be reported separately; source review is not a substitute for browser or assistive-technology testing.
