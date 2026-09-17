import React, { useMemo, useState } from 'react';

const tenantsSeed = [
  { id: 't1', name: 'Enterprise Demo Tenant', domain: 'enterprise.com', region: 'India', plan: 'Enterprise', status: 'Active' },
  { id: 't2', name: 'Healthcare Sandbox', domain: 'health.example', region: 'EU', plan: 'Business', status: 'Trial' },
  { id: 't3', name: 'BFSI Secure Vault', domain: 'bfsi.example', region: 'India', plan: 'Enterprise', status: 'Active' },
];

const filesSeed = [
  {
    id: 'f1', tenantId: 't1', group: 'Legal', name: 'MSA_Contract.pdf', type: 'PDF', folder: 'Legal / Contracts', owner: 'Priya', modified: '2 min ago', size: '1.2 MB', shared: true, favorite: true, deleted: false,
    metadata: { DocumentType: 'Contract', Department: 'Legal', Sensitivity: 'Confidential', Retention: '7 years', RiskLevel: 'High' },
    summary: 'Master service agreement containing confidentiality, termination, liability, renewal, payment, and dispute clauses.',
    aiInsight: 'Termination requires 30 days notice. Immediate termination is possible for material breach or insolvency.'
  },
  {
    id: 'f2', tenantId: 't1', group: 'Finance', name: 'Q4_Review.xlsx', type: 'Excel', folder: 'Finance / Board Reports', owner: 'Arjun', modified: '10 min ago', size: '3.4 MB', shared: false, favorite: false, deleted: false,
    metadata: { DocumentType: 'Financial Report', Department: 'Finance', Sensitivity: 'Restricted', Retention: '10 years', RiskLevel: 'Medium' },
    summary: 'Quarterly review workbook with revenue, margin, churn, and region performance data.',
    aiInsight: 'Revenue increased 18% QoQ. Margin pressure is linked to discount variance.'
  },
  {
    id: 'f3', tenantId: 't1', group: 'Sales', name: 'Sales_Deck.pptx', type: 'PowerPoint', folder: 'Sales / Strategy', owner: 'Ravi', modified: '1 hour ago', size: '5.1 MB', shared: true, favorite: true, deleted: false,
    metadata: { DocumentType: 'Presentation', Department: 'Sales', Sensitivity: 'Internal', Retention: '3 years', RiskLevel: 'Low' },
    summary: 'Sales strategy presentation for enterprise AI adoption across regulated industries.',
    aiInsight: 'Deck recommends BFSI pilots, legal review, and partner-led GTM.'
  },
];

const usersSeed = [
  { id: 'u1', tenantId: 't1', name: 'Priya Nair', email: 'priya@enterprise.com', role: 'Legal Admin', group: 'Legal', status: 'Active' },
  { id: 'u2', tenantId: 't1', name: 'Arjun Mehta', email: 'arjun@enterprise.com', role: 'Finance Viewer', group: 'Finance', status: 'Active' },
  { id: 'u3', tenantId: 't1', name: 'External Partner', email: 'partner@example.com', role: 'External Viewer', group: 'External', status: 'Invited' },
  { id: 'u4', tenantId: 't2', name: 'Dr. Meera', email: 'meera@health.example', role: 'Clinical Viewer', group: 'Clinical', status: 'Active' },
];

const groupsSeed = [
  { id: 'g1', tenantId: 't1', name: 'Legal', description: 'Contracts and legal policy documents', defaultRole: 'Legal Admin', members: 12 },
  { id: 'g2', tenantId: 't1', name: 'Finance', description: 'Financial reports and invoices', defaultRole: 'Finance Viewer', members: 24 },
  { id: 'g3', tenantId: 't1', name: 'Sales', description: 'Sales decks and proposals', defaultRole: 'Sales Editor', members: 38 },
  { id: 'g4', tenantId: 't2', name: 'Clinical', description: 'Clinical documents', defaultRole: 'Clinical Viewer', members: 9 },
];

const rolesSeed = [
  { id: 'r1', tenantId: 't1', name: 'Tenant Admin', permissions: 'Full tenant administration', users: 2, system: true },
  { id: 'r2', tenantId: 't1', name: 'Legal Admin', permissions: 'Manage legal docs, metadata, sharing', users: 12, system: false },
  { id: 'r3', tenantId: 't1', name: 'Finance Viewer', permissions: 'View finance docs and ask AI', users: 24, system: false },
  { id: 'r4', tenantId: 't1', name: 'Sales Editor', permissions: 'Edit sales docs and share internally', users: 38, system: false },
  { id: 'r5', tenantId: 't2', name: 'Clinical Viewer', permissions: 'View clinical docs with PHI controls', users: 9, system: false },
];

const schemaSeed = [
  { id: 'm1', tenantId: 't1', group: 'All Groups', field: 'DocumentType', type: 'Choice', required: true, values: 'Contract, Financial Report, Presentation', system: true },
  { id: 'm2', tenantId: 't1', group: 'All Groups', field: 'Sensitivity', type: 'Choice', required: true, values: 'Public, Internal, Confidential, Restricted', system: true },
  { id: 'm3', tenantId: 't1', group: 'Legal', field: 'Jurisdiction', type: 'Choice', required: false, values: 'India, EU, US', system: false },
  { id: 'm4', tenantId: 't1', group: 'Finance', field: 'FinancialYear', type: 'Choice', required: false, values: 'FY24, FY25, FY26', system: false },
  { id: 'm5', tenantId: 't2', group: 'Clinical', field: 'PHILevel', type: 'Choice', required: true, values: 'Low, Medium, High', system: false },
];

const userNav = [
  ['home','Home','🏠'], ['documents','Documents','📁'], ['shared','Shared','🔗'], ['favorites','Favorites','⭐'], ['ai','AI Workspace','🤖']
];
const adminNav = [
  ['adminOverview','Admin Overview','📊'], ['tenant','Tenants','🏢'], ['users','Users','👤'], ['groups','User Groups','👥'], ['roles','Roles & Permissions','🛡️'], ['policies','Security Policies','🔐'], ['metadata','Metadata Schema','🏷️'], ['kms','KMS / BYOK','🔑'], ['audit','Audit & Compliance','📜']
];

function Button({ children, onClick, variant='default', disabled=false }) {
  const cls = variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : variant === 'danger' ? 'border bg-white text-red-600 hover:bg-red-50' : 'border bg-white text-gray-800 hover:bg-gray-50';
  return <button onClick={onClick} disabled={disabled} className={`rounded px-3 py-1.5 text-sm disabled:opacity-40 ${cls}`}>{children}</button>;
}
function Pill({ children, tone='gray' }) {
  const tones = { gray:'bg-gray-100 text-gray-700 border-gray-200', blue:'bg-blue-50 text-blue-700 border-blue-200', green:'bg-green-50 text-green-700 border-green-200', amber:'bg-amber-50 text-amber-700 border-amber-200', red:'bg-red-50 text-red-700 border-red-200', purple:'bg-purple-50 text-purple-700 border-purple-200' };
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${tones[tone]}`}>{children}</span>;
}
function iconForType(type) { return type === 'Excel' ? '📊' : type === 'PowerPoint' ? '📽️' : '📄'; }

function DemoLanding({ onChoose }) {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-blue-700">Prototype — sample data only</div>
            <h1 className="mt-1 text-4xl font-semibold">CortexVault</h1>
            <p className="mt-3 max-w-2xl text-gray-600">Choose a demo path. Reviewers can test the end-user workspace or the SaaS admin console without needing setup.</p>
          </div>
          <a href="mailto:?subject=CortexVault%20prototype%20feedback" className="rounded border bg-white px-4 py-2 text-sm hover:bg-gray-50">Send Feedback</a>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <button onClick={() => onChoose('user')} className="rounded-xl border bg-white p-8 text-left shadow-sm hover:border-blue-300 hover:shadow">
            <div className="text-3xl">📁</div><h2 className="mt-4 text-2xl font-semibold">End User Workspace</h2>
            <p className="mt-2 text-gray-600">Review document browsing, file selection, Ask AI, secure sharing, favorites, and file metadata.</p>
            <div className="mt-5 text-sm font-medium text-blue-700">Suggested path: Documents → select file → Ask AI → Share</div>
          </button>
          <button onClick={() => onChoose('admin')} className="rounded-xl border bg-white p-8 text-left shadow-sm hover:border-blue-300 hover:shadow">
            <div className="text-3xl">🛡️</div><h2 className="mt-4 text-2xl font-semibold">Admin Console</h2>
            <p className="mt-2 text-gray-600">Review tenant administration, users, groups, roles, policies, metadata schema, KMS, and audit controls.</p>
            <div className="mt-5 text-sm font-medium text-blue-700">Suggested path: Tenants → Users → Groups → Roles → Metadata Schema</div>
          </button>
        </div>
      </div>
    </div>
  );
}

function Shell({ module, setModule, active, setActive, tenants, selectedTenantId, setSelectedTenantId, onExit, children }) {
  const nav = module === 'admin' ? adminNav : userNav;
  const tenant = tenants.find(t => t.id === selectedTenantId);
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex items-center justify-between border-b bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="grid h-9 w-9 place-items-center rounded bg-blue-600 font-semibold text-white">C</div>
          <div><h1 className="text-lg font-semibold leading-5">CortexVault</h1><p className="text-xs text-gray-500">{module === 'admin' ? 'SaaS Admin Console' : 'End User Workspace'}</p></div>
          <span className="rounded bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">Prototype · Sample Data</span>
          <input className="w-[360px] rounded border px-3 py-2 text-sm" placeholder={module === 'admin' ? 'Search tenants, users, groups, policies' : 'Search files, metadata, AI insights'} />
          {module === 'admin' && <select className="rounded border px-3 py-2 text-sm" value={selectedTenantId} onChange={e => setSelectedTenantId(e.target.value)}>{tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}</select>}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={() => { setModule('user'); setActive('home'); }} className={`rounded px-3 py-1.5 ${module === 'user' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>End User</button>
          <button onClick={() => { setModule('admin'); setActive('adminOverview'); }} className={`rounded px-3 py-1.5 ${module === 'admin' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}>Admin Console</button>
          <a href="mailto:?subject=CortexVault%20prototype%20feedback" className="rounded border bg-white px-3 py-1.5 hover:bg-gray-50">Send Feedback</a>
          <button onClick={onExit} className="rounded border bg-white px-3 py-1.5 hover:bg-gray-50">Demo Home</button>
          {module === 'admin' && <span className="text-xs text-gray-500">{tenant?.domain}</span>}
        </div>
      </header>
      <div className="flex">
        <aside className="min-h-screen w-64 border-r bg-white p-4">
          <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">{module === 'admin' ? 'Administration' : 'Workspace'}</div>
          <div className="space-y-1">{nav.map(([key,label,icon]) => <button key={key} onClick={() => setActive(key)} className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm ${active === key ? 'bg-blue-100 font-medium text-blue-700' : 'hover:bg-gray-100'}`}><span>{icon}</span><span>{label}</span></button>)}</div>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

function DocumentsPage({ rows, title }) {
  const [selected, setSelected] = useState(rows[0] || null);
  const [panel, setPanel] = useState(null);
  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-3">
        <div className="mb-4 flex items-center justify-between"><div><h2 className="text-xl font-semibold">{title}</h2><p className="text-sm text-gray-500">Select a file to use Ask AI or secure sharing.</p></div><span className="text-sm text-gray-500">{rows.length} items</span></div>
        <div className="mb-4 flex gap-2"><Button variant="primary">Upload</Button><Button disabled={!selected} onClick={() => setPanel('ai')}>Ask AI</Button><Button disabled={!selected} onClick={() => setPanel('share')}>Share</Button></div>
        <table className="w-full border bg-white text-sm"><thead className="bg-gray-100"><tr><th className="p-2 text-left">Name</th><th className="p-2 text-left">Folder</th><th className="p-2 text-left">Owner</th><th className="p-2 text-left">Group</th><th className="p-2 text-left">Sensitivity</th><th className="p-2 text-left">Status</th></tr></thead><tbody>{rows.map(file => <tr key={file.id} onClick={() => setSelected(file)} className={`cursor-pointer border-t hover:bg-gray-50 ${selected?.id === file.id ? 'bg-blue-50' : ''}`}><td className="p-2 font-medium">{iconForType(file.type)} {file.name}</td><td className="p-2 text-gray-500">{file.folder}</td><td className="p-2">{file.owner}</td><td className="p-2">{file.group}</td><td className="p-2"><Pill tone={file.metadata.Sensitivity === 'Restricted' ? 'red' : 'amber'}>{file.metadata.Sensitivity}</Pill></td><td className="p-2">{file.shared ? <Pill tone="green">Shared</Pill> : <Pill>Private</Pill>}</td></tr>)}</tbody></table>
      </div>
      <div className="space-y-4">
        <div className="border bg-white p-4"><h3 className="font-semibold">Details</h3>{selected ? <div className="mt-3 space-y-2 text-sm"><div className="rounded border bg-gray-50 p-5 text-center text-4xl">{iconForType(selected.type)}</div><p><b>{selected.name}</b></p><p>Owner: {selected.owner}</p><p>Group: {selected.group}</p><p className="text-gray-600">{selected.aiInsight}</p><div className="flex gap-2"><Button variant="primary" onClick={() => setPanel('ai')}>Ask AI</Button><Button onClick={() => setPanel('share')}>Share</Button></div></div> : <p className="mt-3 text-sm text-gray-500">Select a file</p>}</div>
        {panel === 'ai' && selected && <div className="border bg-white p-4"><h3 className="font-semibold">Ask AI</h3><p className="text-sm text-gray-500">Context: {selected.name}</p><textarea className="mt-3 w-full rounded border p-2 text-sm" defaultValue={`Summarize ${selected.name}`} /><div className="mt-3 rounded bg-blue-50 p-3 text-sm text-blue-900">{selected.aiInsight}</div></div>}
        {panel === 'share' && selected && <div className="border bg-white p-4"><h3 className="font-semibold">Secure Share</h3><input className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Recipient email" /><select className="mt-3 w-full rounded border px-3 py-2 text-sm"><option>Can view</option><option>Can edit</option></select><label className="mt-3 flex gap-2 text-sm"><input type="checkbox" defaultChecked /> Require expiry + audit logging</label><div className="mt-3"><Button variant="primary" onClick={() => alert('Secure share link created')}>Create Link</Button></div></div>}
      </div>
    </div>
  );
}

function UserHome({ files, setActive }) {
  const live = files.filter(f => !f.deleted);
  return <div className="space-y-6"><div className="border bg-white p-6"><h2 className="text-2xl font-semibold">CortexVault Workspace</h2><p className="mt-2 text-gray-600">Secure document storage with AI-assisted search, summaries, sharing, and metadata governance.</p></div><div className="grid grid-cols-4 gap-4">{[['Documents',live.length,'documents'],['Shared',live.filter(f=>f.shared).length,'shared'],['Favorites',live.filter(f=>f.favorite).length,'favorites'],['AI Workspace','Ask','ai']].map(([label,value,key]) => <button key={label} onClick={() => setActive(key)} className="border bg-white p-5 text-left hover:bg-gray-50"><div className="text-sm text-gray-500">{label}</div><div className="mt-2 text-3xl font-semibold">{value}</div></button>)}</div></div>;
}

function AIWorkspace({ files }) {
  const [question, setQuestion] = useState('Find risks across confidential documents');
  const [messages, setMessages] = useState([{ role:'assistant', text:'Ask across your authorized CortexVault files.' }]);
  const ask = () => { const target = files[0]; setMessages(prev => [...prev, { role:'user', text:question }, { role:'assistant', text: target ? `${target.name}: ${target.aiInsight}` : 'No accessible files found.' }]); setQuestion(''); };
  return <div className="grid grid-cols-4 gap-6"><div className="col-span-3 flex min-h-[560px] flex-col border bg-white"><div className="border-b p-4"><h2 className="text-xl font-semibold">AI Workspace</h2><p className="text-sm text-gray-500">Ask questions across authorized documents.</p></div><div className="flex-1 space-y-3 p-4">{messages.map((m,i)=><div key={i} className={`max-w-[80%] rounded p-3 text-sm ${m.role==='user'?'ml-auto bg-blue-600 text-white':'bg-gray-100'}`}>{m.text}</div>)}</div><div className="border-t p-4"><div className="flex gap-2"><input value={question} onChange={e=>setQuestion(e.target.value)} className="flex-1 rounded border px-3 py-2 text-sm" /><Button variant="primary" onClick={ask}>Ask AI</Button></div></div></div><div className="border bg-white p-4"><h3 className="font-semibold">Secure Processing</h3><ul className="mt-3 space-y-2 text-sm text-gray-600"><li>✓ Permission checked</li><li>✓ Temporary AI context</li><li>✓ Audit event recorded</li></ul></div></div>;
}

function AdminOverview({ tenants, users, groups, roles, files, selectedTenantId, setActive }) {
  return <div className="space-y-6"><div className="border bg-white p-6"><h2 className="text-2xl font-semibold">CortexVault Admin Console</h2><p className="mt-2 text-gray-600">Configure tenants, users, groups, roles, security policies, metadata schemas, encryption, and compliance.</p></div><div className="grid grid-cols-5 gap-4">{[['Tenants',tenants.length,'tenant'],['Users',users.filter(u=>u.tenantId===selectedTenantId).length,'users'],['Groups',groups.filter(g=>g.tenantId===selectedTenantId).length,'groups'],['Roles',roles.filter(r=>r.tenantId===selectedTenantId).length,'roles'],['Documents',files.filter(f=>f.tenantId===selectedTenantId).length,'adminOverview']].map(([label,value,key]) => <button key={label} onClick={()=>setActive(key)} className="border bg-white p-5 text-left hover:bg-gray-50"><div className="text-sm text-gray-500">{label}</div><div className="mt-2 text-3xl font-semibold">{value}</div></button>)}</div></div>;
}

function TenantAdmin({ tenants, setTenants, selectedTenantId, setSelectedTenantId }) {
  const [draft,setDraft] = useState({ name:'', domain:'', region:'India', plan:'Business' });
  const create = () => { if (!draft.name.trim()) return; const t={ id:`t${Date.now()}`,...draft,status:'Trial' }; setTenants(prev=>[...prev,t]); setSelectedTenantId(t.id); setDraft({ name:'',domain:'',region:'India',plan:'Business' }); };
  return <div className="grid grid-cols-3 gap-6"><div className="col-span-2 border bg-white p-6"><h2 className="text-xl font-semibold">Tenants</h2><p className="mb-4 text-sm text-gray-500">Tenant switching and creation are restricted to Admin Console.</p><table className="w-full border text-sm"><thead className="bg-gray-100"><tr><th className="p-2 text-left">Tenant</th><th className="p-2 text-left">Domain</th><th className="p-2 text-left">Region</th><th className="p-2 text-left">Plan</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Action</th></tr></thead><tbody>{tenants.map(t=><tr key={t.id} className={`border-t ${selectedTenantId===t.id?'bg-blue-50':''}`}><td className="p-2 font-medium">{t.name}</td><td className="p-2">{t.domain}</td><td className="p-2">{t.region}</td><td className="p-2">{t.plan}</td><td className="p-2"><Pill tone={t.status==='Active'?'green':'amber'}>{t.status}</Pill></td><td className="p-2"><Button onClick={()=>setSelectedTenantId(t.id)}>Select</Button></td></tr>)}</tbody></table></div><div className="border bg-white p-4"><h3 className="font-semibold">Create Tenant</h3><input className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Tenant name" value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/><input className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Domain" value={draft.domain} onChange={e=>setDraft({...draft,domain:e.target.value})}/><select className="mt-3 w-full rounded border px-3 py-2 text-sm" value={draft.region} onChange={e=>setDraft({...draft,region:e.target.value})}><option>India</option><option>EU</option><option>United States</option></select><select className="mt-3 w-full rounded border px-3 py-2 text-sm" value={draft.plan} onChange={e=>setDraft({...draft,plan:e.target.value})}><option>Business</option><option>Enterprise</option></select><div className="mt-3"><Button variant="primary" onClick={create}>Create Tenant</Button></div></div></div>;
}

function UsersAdmin({ users,setUsers,groups,roles,selectedTenantId }) {
  const tenantUsers=users.filter(u=>u.tenantId===selectedTenantId), tenantGroups=groups.filter(g=>g.tenantId===selectedTenantId), tenantRoles=roles.filter(r=>r.tenantId===selectedTenantId);
  const blank={ name:'',email:'',role:tenantRoles[0]?.name||'Viewer',group:tenantGroups[0]?.name||'',status:'Invited' };
  const [draft,setDraft]=useState(blank), [editingId,setEditingId]=useState(null);
  const save=()=>{ if(!draft.email.trim())return; editingId?setUsers(prev=>prev.map(u=>u.id===editingId?{...u,...draft}:u)):setUsers(prev=>[...prev,{id:`u${Date.now()}`,tenantId:selectedTenantId,...draft}]); setDraft(blank); setEditingId(null); };
  return <CrudLayout title="Users" subtitle="Add, invite, edit, and delete users for the selected tenant." rows={tenantUsers.map(u=>({id:u.id,cells:[u.name,u.email,u.role,u.group,u.status],raw:u}))} headers={['Name','Email','Role','Group','Status']} onEdit={u=>{setEditingId(u.id);setDraft({name:u.name,email:u.email,role:u.role,group:u.group,status:u.status});}} onDelete={u=>setUsers(prev=>prev.filter(x=>x.id!==u.id))} form={<><input className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Name" value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/><input className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Email" value={draft.email} onChange={e=>setDraft({...draft,email:e.target.value})}/><select className="mt-3 w-full rounded border px-3 py-2 text-sm" value={draft.role} onChange={e=>setDraft({...draft,role:e.target.value})}>{tenantRoles.map(r=><option key={r.id}>{r.name}</option>)}</select><select className="mt-3 w-full rounded border px-3 py-2 text-sm" value={draft.group} onChange={e=>setDraft({...draft,group:e.target.value})}>{tenantGroups.map(g=><option key={g.id}>{g.name}</option>)}</select><select className="mt-3 w-full rounded border px-3 py-2 text-sm" value={draft.status} onChange={e=>setDraft({...draft,status:e.target.value})}><option>Invited</option><option>Active</option><option>Suspended</option></select><div className="mt-3"><Button variant="primary" onClick={save}>{editingId?'Save User':'Add / Invite'}</Button></div></>} />;
}

function CrudLayout({ title,subtitle,rows,headers,onEdit,onDelete,form }) {
  return <div className="grid grid-cols-3 gap-6"><div className="col-span-2 border bg-white p-6"><h2 className="text-xl font-semibold">{title}</h2><p className="mb-4 text-sm text-gray-500">{subtitle}</p><table className="w-full border text-sm"><thead className="bg-gray-100"><tr>{headers.map(h=><th key={h} className="p-2 text-left">{h}</th>)}<th className="p-2 text-left">Actions</th></tr></thead><tbody>{rows.map(row=><tr key={row.id} className="border-t">{row.cells.map((c,i)=><td key={i} className="p-2">{c}</td>)}<td className="p-2"><Button onClick={()=>onEdit(row.raw)}>Edit</Button> <Button variant="danger" onClick={()=>onDelete(row.raw)}>Delete</Button></td></tr>)}</tbody></table></div><div className="border bg-white p-4"><h3 className="font-semibold">Manage {title}</h3>{form}</div></div>;
}

function GroupsAdmin({ groups,setGroups,roles,selectedTenantId }) {
  const tenantGroups=groups.filter(g=>g.tenantId===selectedTenantId), tenantRoles=roles.filter(r=>r.tenantId===selectedTenantId);
  const [draft,setDraft]=useState({name:'',description:'',defaultRole:tenantRoles[0]?.name||'Viewer',members:0}), [editingId,setEditingId]=useState(null);
  const save=()=>{ if(!draft.name.trim())return; const clean={...draft,members:Number(draft.members)||0}; editingId?setGroups(prev=>prev.map(g=>g.id===editingId?{...g,...clean}:g)):setGroups(prev=>[...prev,{id:`g${Date.now()}`,tenantId:selectedTenantId,...clean}]); setDraft({name:'',description:'',defaultRole:tenantRoles[0]?.name||'Viewer',members:0});setEditingId(null); };
  return <CrudLayout title="User Groups" subtitle="Create, edit, and delete groups. Metadata schemas can be scoped to groups." rows={tenantGroups.map(g=>({id:g.id,cells:[g.name,g.description,g.defaultRole,g.members],raw:g}))} headers={['Group','Description','Default Role','Members']} onEdit={g=>{setEditingId(g.id);setDraft({name:g.name,description:g.description,defaultRole:g.defaultRole,members:g.members});}} onDelete={g=>setGroups(prev=>prev.filter(x=>x.id!==g.id))} form={<><input className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Group name" value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/><textarea className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Description" value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})}/><select className="mt-3 w-full rounded border px-3 py-2 text-sm" value={draft.defaultRole} onChange={e=>setDraft({...draft,defaultRole:e.target.value})}>{tenantRoles.map(r=><option key={r.id}>{r.name}</option>)}</select><input className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Members" value={draft.members} onChange={e=>setDraft({...draft,members:e.target.value})}/><div className="mt-3"><Button variant="primary" onClick={save}>{editingId?'Save Group':'Create Group'}</Button></div></>} />;
}

function RolesAdmin({ roles,setRoles,selectedTenantId }) {
  const tenantRoles=roles.filter(r=>r.tenantId===selectedTenantId);
  const [draft,setDraft]=useState({name:'',permissions:'',users:0}), [editingId,setEditingId]=useState(null);
  const save=()=>{ if(!draft.name.trim())return; const clean={...draft,users:Number(draft.users)||0}; editingId?setRoles(prev=>prev.map(r=>r.id===editingId?{...r,...clean}:r)):setRoles(prev=>[...prev,{id:`r${Date.now()}`,tenantId:selectedTenantId,...clean,system:false}]);setDraft({name:'',permissions:'',users:0});setEditingId(null); };
  return <CrudLayout title="Roles & Permissions" subtitle="Create, edit, and delete tenant roles." rows={tenantRoles.map(r=>({id:r.id,cells:[r.name,r.permissions,r.users,r.system?'System':'Custom'],raw:r}))} headers={['Role','Permissions','Users','Status']} onEdit={r=>{setEditingId(r.id);setDraft({name:r.name,permissions:r.permissions,users:r.users});}} onDelete={r=>{if(!r.system)setRoles(prev=>prev.filter(x=>x.id!==r.id));}} form={<><input className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Role name" value={draft.name} onChange={e=>setDraft({...draft,name:e.target.value})}/><textarea className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Permissions" value={draft.permissions} onChange={e=>setDraft({...draft,permissions:e.target.value})}/><input className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Users" value={draft.users} onChange={e=>setDraft({...draft,users:e.target.value})}/><div className="mt-3"><Button variant="primary" onClick={save}>{editingId?'Save Role':'Create Role'}</Button></div></>} />;
}

function PoliciesAdmin(){return <div className="grid grid-cols-3 gap-6"><div className="col-span-2 border bg-white p-6"><h2 className="text-xl font-semibold">Security Policies</h2><p className="mb-4 text-sm text-gray-500">Configure tenant security and sharing guardrails.</p><div className="space-y-4 text-sm">{['Block public anonymous links','Require expiry for external shares','Disable downloads for Restricted files','Add watermark for Confidential files','Enforce metadata before sharing','Log every AI operation'].map(x=><label key={x} className="flex items-center gap-2"><input type="checkbox" defaultChecked/> {x}</label>)}<Button variant="primary">Save Policies</Button></div></div><div className="border bg-white p-4"><h3 className="font-semibold">Policy Impact</h3><p className="mt-3 text-sm text-gray-600">These rules apply to file preview, external sharing, Ask AI, downloads, and audit reporting.</p></div></div>}

function MetadataSchemaAdmin({ schemas,setSchemas,groups,selectedTenantId }) {
  const tenantGroups=groups.filter(g=>g.tenantId===selectedTenantId), tenantSchemas=schemas.filter(s=>s.tenantId===selectedTenantId);
  const [scope,setScope]=useState('All Groups'), [draft,setDraft]=useState({field:'',type:'Text',values:'',required:false}), [deleteTarget,setDeleteTarget]=useState(null);
  const visible=tenantSchemas.filter(s=>scope==='All Groups'?true:s.group===scope||s.group==='All Groups');
  const add=()=>{ if(!draft.field.trim())return;setSchemas(prev=>[...prev,{id:`m${Date.now()}`,tenantId:selectedTenantId,group:scope,...draft,system:false}]);setDraft({field:'',type:'Text',values:'',required:false}); };
  const remove=()=>{if(!deleteTarget||deleteTarget.system||deleteTarget.required)return;setSchemas(prev=>prev.filter(s=>s.id!==deleteTarget.id));setDeleteTarget(null)};
  return <div className="grid grid-cols-3 gap-6"><div className="col-span-2 border bg-white p-6"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-xl font-semibold">Metadata Schema</h2><p className="text-sm text-gray-500">Schemas are tenant-scoped and can apply to all groups or specific groups.</p></div><select className="rounded border px-3 py-2 text-sm" value={scope} onChange={e=>setScope(e.target.value)}><option>All Groups</option>{tenantGroups.map(g=><option key={g.id}>{g.name}</option>)}</select></div><table className="w-full border text-sm"><thead className="bg-gray-100"><tr><th className="p-2 text-left">Group Scope</th><th className="p-2 text-left">Field</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Required</th><th className="p-2 text-left">Values</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Action</th></tr></thead><tbody>{visible.map(s=><tr key={s.id} className="border-t"><td className="p-2"><Pill tone={s.group==='All Groups'?'blue':'purple'}>{s.group}</Pill></td><td className="p-2 font-medium">{s.field}</td><td className="p-2">{s.type}</td><td className="p-2">{s.required?'Yes':'No'}</td><td className="p-2 text-gray-500">{s.values||'-'}</td><td className="p-2">{s.system?<Pill tone="blue">System</Pill>:<Pill>Custom</Pill>}</td><td className="p-2"><button className={`text-xs ${s.system||s.required?'text-gray-400':'text-red-600'}`} onClick={()=>setDeleteTarget(s)}>Delete</button></td></tr>)}</tbody></table>{deleteTarget&&<div className="mt-4 rounded border bg-gray-50 p-4 text-sm">{deleteTarget.system||deleteTarget.required?<><p className="font-medium text-red-700">Cannot delete protected field</p><p className="mt-1 text-gray-600">{deleteTarget.field} is required or system-protected.</p><div className="mt-3"><Button onClick={()=>setDeleteTarget(null)}>Close</Button></div></>:<><p className="font-medium">Delete metadata field?</p><p className="mt-1 text-gray-600">This removes <b>{deleteTarget.field}</b>.</p><div className="mt-3 flex gap-2"><Button variant="danger" onClick={remove}>Confirm Delete</Button><Button onClick={()=>setDeleteTarget(null)}>Cancel</Button></div></>}</div>}</div><div className="border bg-white p-4"><h3 className="font-semibold">Add Schema Field</h3><label className="mt-3 block text-sm">Group Scope<select className="mt-1 w-full rounded border px-3 py-2 text-sm" value={scope} onChange={e=>setScope(e.target.value)}><option>All Groups</option>{tenantGroups.map(g=><option key={g.id}>{g.name}</option>)}</select></label><input className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Field name" value={draft.field} onChange={e=>setDraft({...draft,field:e.target.value})}/><select className="mt-3 w-full rounded border px-3 py-2 text-sm" value={draft.type} onChange={e=>setDraft({...draft,type:e.target.value})}><option>Text</option><option>Choice</option><option>Date</option><option>Number</option><option>User</option></select><textarea className="mt-3 w-full rounded border px-3 py-2 text-sm" placeholder="Allowed values" value={draft.values} onChange={e=>setDraft({...draft,values:e.target.value})}/><label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.required} onChange={e=>setDraft({...draft,required:e.target.checked})}/> Required field</label><div className="mt-3"><Button variant="primary" onClick={add}>Add Schema Field</Button></div></div></div>;
}

function KMSAdmin(){return <div className="grid grid-cols-3 gap-6"><div className="col-span-2 border bg-white p-6"><h2 className="text-xl font-semibold">KMS / BYOK</h2><p className="mb-4 text-sm text-gray-500">Configure encryption keys and just-in-time unwrap controls.</p><div className="grid grid-cols-3 gap-4"><div className="rounded border p-4"><p className="text-sm text-gray-500">Provider</p><p className="text-lg font-semibold">AWS KMS</p></div><div className="rounded border p-4"><p className="text-sm text-gray-500">Rotation</p><p className="text-lg font-semibold">90 days</p></div><div className="rounded border p-4"><p className="text-sm text-gray-500">Status</p><p className="text-lg font-semibold">Active</p></div></div></div><div className="border bg-white p-4"><h3 className="font-semibold">Key Usage</h3><p className="mt-3 text-sm text-gray-600">517 unwrap requests today. 8 denied by policy.</p></div></div>}
function AuditAdmin({files}){return <div className="border bg-white p-6"><div className="mb-4 flex justify-between"><h2 className="text-xl font-semibold">Audit & Compliance</h2><Button>Export CSV</Button></div><table className="w-full border text-sm"><thead className="bg-gray-100"><tr><th className="p-2 text-left">Event</th><th className="p-2 text-left">File</th><th className="p-2 text-left">Sensitivity</th><th className="p-2 text-left">Result</th></tr></thead><tbody>{files.flatMap(f=>['File viewed','AI query','Policy check'].map(event=>({file:f,event}))).map((e,i)=><tr key={i} className="border-t"><td className="p-2">{e.event}</td><td className="p-2">{e.file.name}</td><td className="p-2">{e.file.metadata.Sensitivity}</td><td className="p-2"><Pill tone="green">Allowed</Pill></td></tr>)}</tbody></table></div>}

export default function App(){
  const [landing,setLanding]=useState(true), [module,setModule]=useState('user'), [active,setActive]=useState('home');
  const [tenants,setTenants]=useState(tenantsSeed), [selectedTenantId,setSelectedTenantId]=useState('t1');
  const [files]=useState(filesSeed), [users,setUsers]=useState(usersSeed), [groups,setGroups]=useState(groupsSeed), [roles,setRoles]=useState(rolesSeed), [schemas,setSchemas]=useState(schemaSeed);
  const tenantFiles=files.filter(f=>f.tenantId===selectedTenantId), liveFiles=tenantFiles.filter(f=>!f.deleted);
  const choose=(m)=>{setModule(m);setActive(m==='admin'?'adminOverview':'home');setLanding(false)};
  const userScreen=useMemo(()=>{ if(active==='documents')return <DocumentsPage rows={liveFiles} title="Documents"/>; if(active==='shared')return <DocumentsPage rows={liveFiles.filter(f=>f.shared)} title="Shared"/>; if(active==='favorites')return <DocumentsPage rows={liveFiles.filter(f=>f.favorite)} title="Favorites"/>; if(active==='ai')return <AIWorkspace files={liveFiles}/>; return <UserHome files={tenantFiles} setActive={setActive}/>; },[active,files,selectedTenantId]);
  const adminScreen=useMemo(()=>{ switch(active){ case 'tenant':return <TenantAdmin tenants={tenants} setTenants={setTenants} selectedTenantId={selectedTenantId} setSelectedTenantId={setSelectedTenantId}/>; case 'users':return <UsersAdmin users={users} setUsers={setUsers} groups={groups} roles={roles} selectedTenantId={selectedTenantId}/>; case 'groups':return <GroupsAdmin groups={groups} setGroups={setGroups} roles={roles} selectedTenantId={selectedTenantId}/>; case 'roles':return <RolesAdmin roles={roles} setRoles={setRoles} selectedTenantId={selectedTenantId}/>; case 'policies':return <PoliciesAdmin/>; case 'metadata':return <MetadataSchemaAdmin schemas={schemas} setSchemas={setSchemas} groups={groups} selectedTenantId={selectedTenantId}/>; case 'kms':return <KMSAdmin/>; case 'audit':return <AuditAdmin files={tenantFiles}/>; default:return <AdminOverview tenants={tenants} users={users} groups={groups} roles={roles} files={files} selectedTenantId={selectedTenantId} setActive={setActive}/>;} },[active,tenants,users,groups,roles,schemas,selectedTenantId,files]);
  if(landing)return <DemoLanding onChoose={choose}/>;
  return <Shell module={module} setModule={setModule} active={active} setActive={setActive} tenants={tenants} selectedTenantId={selectedTenantId} setSelectedTenantId={setSelectedTenantId} onExit={()=>setLanding(true)}>{module==='admin'?adminScreen:userScreen}</Shell>;
}
