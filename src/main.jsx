import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowRight, Bell, Check, CheckCheck, ChevronDown,
  Circle, Layers, Menu, MessageSquare, Plus, ShieldCheck, Sparkles, Trophy,
  Volume2, X
} from 'lucide-react';
import './styles.css';

const initialDecisions = [
  {
    id: 'ZD-229', title: 'Merge “Clear search input” fix', project: 'Product',
    issue: '#229 · Channel Directory Search Input Has No Clear (X)',
    agent: 'Nova', initials: 'N', kind: 'Merge approval',
    reason: 'The fix is ready, but merging is reserved for a human in this workspace.',
    recommendation: 'Approve the merge. The clear control now works with keyboard and pointer input.',
    evidence: ['12 of 12 checks passed', 'Adds a keyboard interaction check', 'No shared component or API changes'],
    risk: 'A missed edge case could leave the search field uncleared on smaller screens.',
    approve: 'The demo marks this request approved and counts it as completed work.',
    reject: 'The demo returns it for revision and counts it as blocked work.', status: 'pending'
  },
  {
    id: 'ZD-234', title: 'Add permission to update shared navigation', project: 'Product',
    issue: '#234 · Navigation active state', agent: 'Atlas', initials: 'A', kind: 'Permission request',
    reason: 'This change touches a shared component outside the agent’s current project scope.',
    recommendation: 'Grant temporary access for this issue only after reviewing the affected screens.',
    evidence: ['3 routes use the shared navigation', 'No files have been changed outside the issue branch', 'Agent asks before crossing the granted scope'],
    risk: 'A shared navigation change could affect Marketing and Security project pages.',
    approve: 'The demo records approval and moves the item into active work.',
    reject: 'The demo records the rejection and leaves the item waiting for a revised approach.', status: 'pending'
  }
];

const initialIssues = [{
  id: 229, title: 'Channel Directory Search Input Has No Clear (X)',
  votes: 11, type: 'Fix', priority: 'Medium', status: 'Open', stage: 'Ready',
  reported: 'Oct 18', project: 'Product', comments: 1, voted: false,
  createdByMe: true, assignedToMe: true
}];

const initialWork = [
  { id: 'w1', title: 'Add keyboard support to clear control', project: 'Product', agent: 'Nova', initials: 'N', state: 'Active', progress: 68 },
  { id: 'w2', title: 'Review shared navigation scope', project: 'Product', agent: 'Atlas', initials: 'A', state: 'Active', progress: 38 },
  { id: 'w3', title: 'Investigate flaky checkout check', project: 'Marketing', agent: 'Milo', initials: 'M', state: 'Blocked', progress: 44 },
  { id: 'w4', title: 'Check release workflow permissions', project: 'Security', agent: 'Orion', initials: 'O', state: 'Active', progress: 23 }
];

function App() {
  const [screen, setScreen] = useState(window.location.pathname === '/dashboard' ? 'dashboard' : 'landing');
  const [project, setProject] = useState('Product');
  const [decisions, setDecisions] = useState(initialDecisions);
  const [selectedDecision, setSelectedDecision] = useState(initialDecisions[0].id);
  const [issues, setIssues] = useState(initialIssues);
  const [issueFilter, setIssueFilter] = useState('assigned');
  const [showAllWork, setShowAllWork] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [newIssueTitle, setNewIssueTitle] = useState('');
  const [expandedIssue, setExpandedIssue] = useState(null);
  const [popover, setPopover] = useState('');
  const [notice, setNotice] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onPopState = () => setScreen(window.location.pathname === '/dashboard' ? 'dashboard' : 'landing');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setScreen(path === '/dashboard' ? 'dashboard' : 'landing');
    window.scrollTo(0, 0);
  };

  const pending = useMemo(() => decisions.filter((decision) => decision.status === 'pending'), [decisions]);
  const currentDecision = decisions.find((decision) => decision.id === selectedDecision) || null;
  const completedCount = 5 + decisions.filter((decision) => decision.status === 'approved').length;
  const blockedCount = initialWork.filter((item) => item.state === 'Blocked').length + decisions.filter((decision) => decision.status === 'rejected').length;
  const activeCount = initialWork.filter((item) => item.state === 'Active').length;

  const announce = (message) => {
    setNotice(message);
    window.clearTimeout(announce.timer);
    announce.timer = window.setTimeout(() => setNotice(''), 3600);
  };

  const decide = (id, result) => {
    const decision = decisions.find((item) => item.id === id);
    if (!decision || decision.status !== 'pending') return;
    setDecisions((list) => list.map((item) => item.id === id ? { ...item, status: result } : item));
    announce(`${result === 'approved' ? 'Approved' : 'Rejected'} in this demonstration · ${decision.id}. No external action was taken.`);
  };

  const createIssue = (event) => {
    event.preventDefault();
    const title = newIssueTitle.trim();
    if (!title) return;
    const id = Math.max(229, ...issues.map((issue) => issue.id)) + 1;
    setIssues((list) => [{ id, title, votes: 0, type: 'Fix', priority: 'Medium', status: 'Open', stage: 'New', reported: 'Today', project, comments: 0, voted: false, createdByMe: true, assignedToMe: true }, ...list]);
    setIssueFilter('all');
    setNewIssueTitle('');
    setShowIssueForm(false);
    announce(`Issue #${id} added to this local demonstration.`);
  };

  const visibleIssues = issues.filter((issue) => {
    const matchesProject = issue.project === project;
    if (!matchesProject) return false;
    if (issueFilter === 'resolved') return issue.status === 'Resolved';
    if (issueFilter === 'created') return issue.createdByMe;
    if (issueFilter === 'assigned') return issue.assignedToMe !== false && issue.status !== 'Resolved';
    return true;
  });

  const filteredWork = (showAllWork ? initialWork : initialWork.slice(0, 3));

  if (screen === 'landing') return <LandingPage navigate={navigate}/>;

  return <div className="ziki-app">
    <header className="global-header">
      <button className="mobile-nav-toggle icon-button" aria-label="Toggle project navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Menu size={19}/></button>
      <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }} aria-label="Ziki home"><span className="brand-symbol" aria-hidden="true"><i/><b/></span><span>ziki</span></a>
      <div className="header-divider"/>
      <button className="workspace-select" onClick={() => announce('Zedu is the illustrative workspace shown in the reference screenshot.')} aria-label="Current workspace: Zedu">Zedu <ChevronDown size={15}/></button>
      <nav className={`project-nav ${menuOpen ? 'open' : ''}`} aria-label="Projects">
        {['Product', 'Marketing', 'Security'].map((name, index) => <button key={name} className={project === name ? 'project-active' : ''} onClick={() => { setProject(name); setMenuOpen(false); }}><span className="project-nav-icon">{index === 0 ? <Circle size={17}/> : index === 1 ? <Volume2 size={17}/> : <ShieldCheck size={17}/>}</span>{name}</button>)}
      </nav>
      <div className="header-spacer"/>
      <div className="header-popover-wrap"><button className="header-pill agents-pill" aria-expanded={popover === 'agents'} onClick={() => setPopover(popover === 'agents' ? '' : 'agents')}><span className="robot-icon">▣</span>Agents <ChevronDown size={15}/></button>{popover === 'agents' && <div className="header-popover"><b>Workspace agents</b><span><i className="online-dot"/>Nova · working on #229</span><span><i className="online-dot"/>Atlas · awaiting your decision</span><span><i className="idle-dot"/>Milo · investigating a failed check</span></div>}</div>
      <div className="header-popover-wrap"><button className="header-pill account-pill" aria-expanded={popover === 'account'} onClick={() => setPopover(popover === 'account' ? '' : 'account')}><span className="profile-avatar">MG</span><span className="account-name">Mercy Gatwiri</span><ChevronDown size={14}/></button>{popover === 'account' && <div className="header-popover account-popover"><b>Mercy Gatwiri</b><span>Workspace owner</span><span className="popover-hint">Profile menu · concept preview</span></div>}</div>
      <button className="points-pill" onClick={() => { setIssueFilter('all'); document.getElementById('issues-heading')?.scrollIntoView({ behavior: 'smooth' }); }} aria-label="2875 points"><Trophy size={16}/>2875 <span>pts</span></button>
      <div className="header-popover-wrap"><button className="notification-button icon-button" aria-label="Notifications, 4 unread" aria-expanded={popover === 'notifications'} onClick={() => setPopover(popover === 'notifications' ? '' : 'notifications')}><Bell size={21}/><span className="notification-count">4</span></button>{popover === 'notifications' && <div className="header-popover notification-popover"><b>Notifications · demo</b><span>Nova requested merge approval.</span><span>Checkout check needs investigation.</span><span>2 more illustrative updates.</span></div>}</div>
    </header>

    <main id="top" className="dashboard-main">
      <div className="welcome-row"><div><h1>Welcome back, Mercy</h1><p>Issues, votes and your points for Ziki at a glance.</p></div><button className="new-issue-button" onClick={() => setShowIssueForm(true)}><Plus size={19}/> New issue</button></div>
      {showIssueForm && <form className="issue-create" onSubmit={createIssue}><div><b>Create an issue</b><span>This adds an illustrative row to the local demo only.</span></div><label className="sr-only" htmlFor="issue-title">Issue title</label><input id="issue-title" autoFocus value={newIssueTitle} onChange={(event) => setNewIssueTitle(event.target.value)} placeholder="Describe the issue" required/><button type="submit" className="create-button">Add issue</button><button type="button" className="cancel-button" onClick={() => setShowIssueForm(false)}>Cancel</button></form>}

      <section className="metric-grid" aria-label="Account overview">
        <MetricCard title="Points" value="2875" chip="500 to go" caption="500 required this week" onClick={() => announce('Points are illustrative and cannot be redeemed in this concept.')}/>
        <MetricCard title="Created by me" value={issues.filter((issue) => issue.createdByMe).length || 1} chip="+1" caption="in the last 30 days" chipKind="positive" onClick={() => { setIssueFilter('created'); document.getElementById('issues-heading')?.scrollIntoView({ behavior: 'smooth' }); }}/>
        <MetricCard title="Assigned to me" value={issues.filter((issue) => issue.assignedToMe !== false && issue.status !== 'Resolved').length} chip="0" caption="high priority" chipKind="neutral" onClick={() => { setIssueFilter('assigned'); document.getElementById('issues-heading')?.scrollIntoView({ behavior: 'smooth' }); }}/>
        <MetricCard title="Resolved issues" value={issues.filter((issue) => issue.status === 'Resolved').length} chip={issues.length ? `${Math.round((issues.filter((issue) => issue.status === 'Resolved').length / issues.length) * 100)}%` : '0%'} caption="of issues assigned to me" chipKind="neutral" onClick={() => { setIssueFilter('resolved'); document.getElementById('issues-heading')?.scrollIntoView({ behavior: 'smooth' }); }}/>
      </section>

      <section className="owner-desk" aria-labelledby="desk-heading">
        <div className="desk-header"><div><span className="concept-label"><Sparkles size={13}/> PROPOSED INTERACTION</span><h2 id="desk-heading">Owner’s Decision Desk</h2><p>Work keeps moving. Step in only when your judgment is needed.</p></div><div className="authority-badge"><ShieldCheck size={16}/><span>Human approval stays in your hands</span></div></div>
        <div className="authority-note"><span className="authority-mark"><ShieldCheck size={16}/></span><p><b>Agents work within the permissions you grant.</b> They collect evidence and recommend next steps, then pause when an action exceeds that scope or your policy requires approval.</p><button onClick={() => announce('Agents may act within granted permissions. Approval is simulated in this concept.')}>Authority boundary <ArrowRight size={14}/></button></div>
        <div className="desk-layout">
          <div className="desk-main-column">
            <div className="desk-section-head"><div><h3><span className="section-signal decision-signal"/>Needs your decision <span className="decision-count">{pending.length}</span></h3><p>Only requests that need your judgment.</p></div><span className="illustrative-label">ILLUSTRATIVE DATA</span></div>
            {pending.length === 0 ? <div className="decision-empty"><div className="empty-check"><CheckCheck size={19}/></div><div><b>You’re all caught up</b><span>New requests will appear here when an agent reaches an approval boundary.</span></div></div> : <div className="decision-workspace">
              <div className="decision-queue" aria-label="Outstanding decisions">{pending.map((decision) => <button key={decision.id} className={`decision-queue-item ${selectedDecision === decision.id ? 'selected' : ''}`} onClick={() => setSelectedDecision(decision.id)} aria-pressed={selectedDecision === decision.id}><span className="queue-top"><span className="queue-type">{decision.kind}</span><span className="queue-id">{decision.id}</span></span><b>{decision.title}</b><span className="queue-project">{decision.project} <span>·</span> {decision.issue}</span><span className="queue-agent"><span className={`agent-initial ${decision.initials === 'A' ? 'agent-a' : ''}`}>{decision.initials}</span>{decision.agent}<span className="needs-review">Needs review</span></span></button>)}</div>
              <DecisionDetail decision={currentDecision} onDecide={decide} onReturn={() => setSelectedDecision(pending[0]?.id || null)}/>
            </div>}
          </div>
          <aside className="desk-aside">
            <section className="at-risk-box"><div className="aside-section-title"><div><span className="section-signal risk-signal"/><h3>At risk</h3></div><span className="risk-total">{blockedCount}</span></div><p className="aside-subtitle">A check is holding up delivery.</p><b className="risk-work-title">Checkout check is failing intermittently</b><div className="risk-meta"><span className="agent-initial agent-m">M</span>Milo <span>·</span> Marketing <span>·</span> 23 min</div><div className="risk-explanation"><b>What happened</b><span>3 retries ended in a timeout on the checkout flow.</span><b>Next useful action</b><span>Milo is isolating the flaky step. No owner action is needed yet.</span></div><button className="risk-view-button" onClick={() => announce('Milo’s diagnosis is sample data; this concept is not connected to an agent.')}>View blocked work <ArrowRight size={14}/></button></section>
            <section className="progress-box"><div className="aside-section-title"><div><span className="section-signal progress-signal"/><h3>Factory progress</h3></div><span className="today-label">TODAY</span></div><div className="progress-summary"><ProgressMetric label="Active" value={activeCount}/><ProgressMetric label="Completed" value={completedCount}/><ProgressMetric label="Blocked" value={blockedCount}/><ProgressMetric label="Needs you" value={pending.length}/></div><div className="mini-work-list"><div className="mini-work-heading">ACTIVE WORK <button onClick={() => setShowAllWork(!showAllWork)}>{showAllWork ? 'Less' : 'All'} <ArrowRight size={12}/></button></div>{filteredWork.map((item) => <div className="mini-work-item" key={item.id}><span className={`agent-initial ${item.initials === 'A' ? 'agent-a' : item.initials === 'M' ? 'agent-m' : ''}`}>{item.initials}</span><div><b>{item.title}</b><span>{item.agent} · {item.project}</span></div><span className={`work-state ${item.state.toLowerCase()}`}>{item.state}</span></div>)}</div></section>
          </aside>
        </div>
        <p className="demo-footnote"><ShieldCheck size={13}/> Demonstration only · Approval and rejection update this page’s sample data; no real agent or production action is triggered.</p>
      </section>

      <section className="issues-panel" aria-labelledby="issues-heading" id="issues-heading">
        <div className="issues-heading"><div><div className="issues-title-row"><h2>Issues assigned to me</h2><span className="issue-subcount">{visibleIssues.length} {visibleIssues.length === 1 ? 'issue' : 'issues'} · sorted by top votes</span></div><span className="current-filter">{project} project <span>·</span> {filterLabel(issueFilter)}</span></div><button className="view-issues-button" onClick={() => setIssueFilter(issueFilter === 'all' ? 'assigned' : 'all')}>{issueFilter === 'all' ? 'Assigned to me' : 'View all issues'}</button></div>
        {visibleIssues.length === 0 ? <div className="issues-empty"><Layers size={22}/><b>No {filterLabel(issueFilter).toLowerCase()} issues in {project}</b><span>Try another project or view all issues.</span><button onClick={() => setIssueFilter('all')}>View all issues <ArrowRight size={14}/></button></div> : <div className="issues-table-wrap"><table className="issues-table"><thead><tr><th scope="col">Votes</th><th scope="col">Issue</th><th scope="col">Type</th><th scope="col">Priority</th><th scope="col">Status</th><th scope="col">Stage</th><th scope="col">Reported</th></tr></thead><tbody>{visibleIssues.map((issue) => <React.Fragment key={issue.id}><tr><td data-label="Votes"><button className={`vote-button ${issue.voted ? 'voted' : ''}`} onClick={() => setIssues((list) => list.map((item) => item.id === issue.id ? { ...item, voted: !item.voted, votes: item.votes + (item.voted ? -1 : 1) } : item))} aria-label={`${issue.voted ? 'Remove vote from' : 'Vote for'} issue ${issue.id}, ${issue.votes} votes`} aria-pressed={issue.voted}><span aria-hidden="true">⌃</span>{issue.votes}</button></td><td data-label="Issue"><div className="issue-cell"><span className="issue-type-icon"><Layers size={17}/></span><div><button className="issue-title-button" onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)} aria-expanded={expandedIssue === issue.id}>{issue.title}</button><span className="issue-meta">#{issue.id} <span>·</span> <MessageSquare size={12}/> {issue.comments} {issue.comments === 1 ? 'comment' : 'comments'}</span></div></div></td><td data-label="Type">{issue.type}</td><td data-label="Priority"><span className="priority-badge">{issue.priority}</span></td><td data-label="Status"><span className={`status-badge ${issue.status.toLowerCase()}`}><i/>{issue.status}</span></td><td data-label="Stage"><span className={`stage-badge ${issue.stage.toLowerCase()}`}><i/>{issue.stage}</span></td><td data-label="Reported">{issue.reported}</td></tr>{expandedIssue === issue.id && <tr className="issue-detail-row"><td colSpan="7"><div className="issue-detail-content"><b>Issue quick view · demo</b><span>This is an illustrative issue in the {issue.project} project. The agent activity and review controls above are not linked to this issue or to Ziki.</span><button onClick={() => { setSelectedDecision('ZD-229'); document.getElementById('desk-heading')?.scrollIntoView({ behavior: 'smooth' }); }}>See related decision <ArrowRight size={13}/></button></div></td></tr>}</React.Fragment>)}</tbody></table></div>}
      </section>
      <footer className="page-footer"><span><i/>All figures and agent activity are illustrative.</span><span>Independent Ziki interface concept · No live system connection</span></footer>
    </main>
    {notice && <div className="toast" role="status"><Check size={16}/><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss notification"><X size={14}/></button></div>}
  </div>;
}

function LandingPage({ navigate }) {
  return <div className="landing-page">
    <header className="landing-header" style={{ gridTemplateColumns: 'auto 1fr auto auto' }}>
      <a className="landing-brand" href="/" aria-label="Ziki home"><span className="brand-symbol" aria-hidden="true"><i/><b/></span><span>ziki</span></a>
      <nav aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#agents">AI agents</a><a href="#developers">Developers</a><a href="#points">Points</a><a href="#api">API Spec (llms.txt)</a></nav>
      <button className="landing-get-started" onClick={() => navigate('/dashboard')}>Get started <ArrowRight size={19}/></button>
      <span className="landing-theme" aria-hidden="true"><span>☼</span></span>
    </header>
    <main>
      <section className="landing-hero" aria-labelledby="landing-headline">
        <div className="landing-grid" aria-hidden="true"/>
        <span className="landing-side-label">HUMAN + AI WORKFLOWS</span>
        <a className="explore-product" href="/dashboard" onClick={(event) => { event.preventDefault(); navigate('/dashboard'); }}>Explore the product <span>↗</span></a>
        <span className="landing-tick tick-left" aria-hidden="true"/><span className="landing-tick tick-right" aria-hidden="true"/><span className="landing-tick tick-bottom" aria-hidden="true"/>
        <div className="landing-hero-content">
          <div className="landing-kicker">COLLABORATIVE SOFTWARE DELIVERY</div>
          <h1 id="landing-headline"><span className="headline-small">Move every issue</span><span className="headline-forward">f<span className="hero-switch" aria-hidden="true"><i/></span>rward<span className="hero-launch" aria-hidden="true">↗</span></span><span className="headline-small headline-last">with your agents</span></h1>
          <p>Agents discover issues, propose a plan, deliver fixes, and validate work on behalf of your team. Every action is permissioned, attributable, and under human control.</p>
          <button className="landing-cta" onClick={() => navigate('/dashboard')}>Get started free <ArrowRight size={20}/></button>
          <button className="landing-concept-link" onClick={() => navigate('/dashboard')}>View the Owner’s Decision Desk concept</button>
          <span className="landing-demo-note">Prototype navigation only · no Ziki account is created</span>
        </div>
      </section>
      <section className="landing-next" id="how-it-works"><div className="landing-next-kicker">THE OWNER STAYS IN CONTROL</div><h2>Work moves forward.<br/>People keep the final say.</h2><p>The dashboard concept brings agent progress, risks, and approval requests into one place. It is an independent demonstration using illustrative data.</p><button onClick={() => navigate('/dashboard')}>Open dashboard concept <ArrowRight size={16}/></button><div className="landing-anchor-links"><span id="agents">AI agents</span><span id="developers">Developers</span><span id="points">Points</span><span id="api">API spec</span></div></section>
    </main>
  </div>;
}

function MetricCard({ title, value, chip, caption, chipKind = '', onClick }) {
  return <button className="metric-card" onClick={onClick}><span className="metric-card-title">{title}<span className="metric-arrow" aria-hidden="true">↗</span></span><b className="metric-value">{value}</b><span className="metric-caption"><span className={`metric-chip ${chipKind}`}>{chip}</span>{caption}</span></button>;
}

function DecisionDetail({ decision, onDecide, onReturn }) {
  if (!decision) return <div className="detail-empty"><div className="empty-check"><CheckCheck size={19}/></div><b>No outstanding requests</b><span>Choose an item from the queue when one needs your attention.</span></div>;
  return <article className="decision-detail" aria-live="polite"><div className="detail-overline"><span>{decision.id}</span><span>·</span><span>{decision.kind}</span><span className="detail-agent"><span className={`agent-initial ${decision.initials === 'A' ? 'agent-a' : ''}`}>{decision.initials}</span>{decision.agent}</span></div><h4>{decision.title}</h4><p className="detail-issue">{decision.issue}</p><div className="recommendation-box"><span className="recommendation-icon"><Sparkles size={15}/></span><div><b>{decision.agent} recommends</b><p>{decision.recommendation}</p></div></div><div className="detail-info"><b>Why your decision is needed</b><p>{decision.reason}</p></div><div className="detail-info detail-risk"><b><span>!</span> Risk to consider</b><p>{decision.risk}</p></div><div className="detail-info evidence-list"><b>Evidence collected</b>{decision.evidence.map((item) => <span key={item}><Check size={13}/>{item}</span>)}</div><div className="outcome-grid"><div><b>IF APPROVED</b><span>{decision.approve}</span></div><div><b>IF REJECTED</b><span>{decision.reject}</span></div></div>{decision.status === 'pending' ? <div className="decision-actions"><button className="reject-action" onClick={() => onDecide(decision.id, 'rejected')}>Reject</button><button className="approve-action" onClick={() => onDecide(decision.id, 'approved')}>Approve <ArrowRight size={15}/></button></div> : <div className={`decision-complete ${decision.status}`}><Check size={15}/><span>Demo request {decision.status}. No external action was taken.</span><button onClick={onReturn}>Return to outstanding decisions</button></div>}<span className="detail-demo-note"><ShieldCheck size={12}/> Demo control · no production action</span></article>;
}

function ProgressMetric({ label, value }) { return <div className="progress-metric"><b>{value}</b><span>{label}</span></div>; }

function filterLabel(filter) { return ({ assigned: 'Assigned to me', created: 'Created by me', resolved: 'Resolved', all: 'All issues' })[filter] || 'All issues'; }

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);
