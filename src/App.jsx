import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, MessageCircle, Sparkles } from 'lucide-react'
import './App.css'

function App() {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  if (isLoggedIn) {
    return <ChatSphereApp onLogout={() => setIsLoggedIn(false)} />
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-form-wrap">
          <div className="brand-lockup">
            <div className="brand-mark"><MessageCircle size={21} fill="currentColor" /></div>
            <span>ChatSphere</span>
          </div>
          <div className="auth-heading">
            <p className="eyebrow">Private conversations, thoughtfully designed</p>
            <h1>{mode === 'login' ? 'Welcome back.' : 'Create your space.'}</h1>
            <p>{mode === 'login' ? 'Sign in to pick up where you left off.' : 'Set up your ChatSphere account in a few seconds.'}</p>
          </div>
          <form className="auth-form" onSubmit={(event) => { event.preventDefault(); setIsLoggedIn(true) }}>
            {mode === 'register' && <label>Full name<input required placeholder="Alex Morgan" /></label>}
            <label>Email address<div className="input-with-icon"><Mail size={17} /><input type="email" required placeholder="you@example.com" /></div></label>
            <label>Password<div className="input-with-icon"><LockKeyhole size={17} /><input type={showPassword ? 'text' : 'password'} required placeholder="••••••••" /><button type="button" className="input-action" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
            {mode === 'login' ? <div className="form-row"><label className="check-label"><input type="checkbox" defaultChecked /> Remember me</label><button type="button" className="text-button">Forgot password?</button></div> : null}
            <button className="primary-button" type="submit">{mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={17} /></button>
          </form>
          <p className="auth-switch">{mode === 'login' ? "Don't have an account?" : 'Already have an account?'} <button className="text-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Create account' : 'Back to login'}</button></p>
        </div>
        <div className="auth-visual">
          <div className="visual-top"><span className="mini-logo"><MessageCircle size={15} fill="currentColor" /></span><span>Chats that feel close</span><Sparkles size={16} /></div>
          <div className="visual-copy"><p className="eyebrow">Your world, in one calm place</p><h2>Make room for the conversations that matter.</h2><p>Connect with your people through a focused, beautifully simple messaging experience.</p></div>
          <div className="visual-chat"><div className="visual-avatar">JM</div><div><strong>Jordan Mitchell</strong><span>That sounds perfect. See you soon!</span></div><small>10:42</small></div>
          <div className="floating-note"><span>✓✓</span> Message delivered</div>
        </div>
      </section>
    </main>
  )
}

function ChatSphereApp({ onLogout }) {
  const [activeChat, setActiveChat] = useState('maya')
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState(initialMessages)
  const [showProfile, setShowProfile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showNewChat, setShowNewChat] = useState(false)
  const [showNewGroup, setShowNewGroup] = useState(false)
  const [showAttachment, setShowAttachment] = useState(false)
  const [mobileList, setMobileList] = useState(true)
  const [filter, setFilter] = useState('All')

  const chat = chatList.find((item) => item.id === activeChat) || chatList[0]
  const visibleChats = chatList.filter((item) => {
    const matchesQuery = `${item.name} ${item.lastMessage}`.toLowerCase().includes(query.toLowerCase())
    const matchesFilter = filter === 'All' || (filter === 'Unread' && item.unread) || (filter === 'Groups' && item.group)
    return matchesQuery && matchesFilter
  })
  const chatMessages = messages.filter((item) => item.chatId === activeChat)

  const selectChat = (id) => { setActiveChat(id); setMobileList(false) }
  const sendMessage = () => {
    if (!message.trim()) return
    setMessages([...messages, { id: Date.now(), chatId: activeChat, direction: 'outgoing', type: 'text', text: message.trim(), time: 'now', status: 'read' }])
    setMessage('')
  }
  const addChat = (name) => { setActiveChat('new-contact'); setShowNewChat(false); setMobileList(false); setMessages([...messages, { id: Date.now(), chatId: 'new-contact', direction: 'incoming', type: 'text', text: `You started a conversation with ${name}.`, time: 'now' }]) }

  return <main className="app-shell">
    <aside className={`sidebar ${mobileList ? 'mobile-visible' : ''}`}>
      <div className="sidebar-head"><div className="brand-lockup"><div className="brand-mark"><MessageCircle size={19} fill="currentColor" /></div><span>ChatSphere</span></div><button className="icon-button" onClick={() => setShowSettings(true)} aria-label="Open settings"><SettingsIcon /></button></div>
      <button className="profile-summary" onClick={() => setShowProfile(true)}><div className="avatar avatar-user">AM<span className="status-dot" /></div><div><strong>Alex Morgan</strong><span>Available</span></div><ChevronIcon /></button>
      <div className="search-box"><SearchIcon size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conversations" /></div>
      <div className="filter-row">{['All', 'Unread', 'Groups'].map((item) => <button className={filter === item ? 'active' : ''} key={item} onClick={() => setFilter(item)}>{item}{item === 'Unread' && <span>3</span>}</button>)}</div>
      <div className="chat-list">{visibleChats.map((item) => <button className={`chat-list-item ${item.id === activeChat ? 'selected' : ''}`} key={item.id} onClick={() => selectChat(item.id)}><div className={`avatar ${item.color}`}>{item.initials}{item.online && <span className="status-dot" />}</div><div className="chat-preview"><div><strong>{item.name}</strong><time>{item.time}</time></div><div><span>{item.lastMessage}</span>{item.unread ? <b>{item.unread}</b> : item.muted ? <MuteIcon size={14} /> : null}</div></div></button>)}</div>
      <div className="sidebar-actions"><button onClick={() => setShowNewChat(true)}><PlusIcon size={17} /> New chat</button><button onClick={() => setShowNewGroup(true)}><UsersIcon size={17} /> New group</button></div>
    </aside>
    <section className={`conversation ${mobileList ? 'mobile-hidden' : ''}`}>
      <header className="chat-header"><button className="icon-button mobile-back" onClick={() => setMobileList(true)} aria-label="Back to chats"><BackIcon /></button><div className={`avatar ${chat.color}`}>{chat.initials}</div><div className="chat-header-copy"><strong>{chat.name}</strong><span>{chat.group ? `${chat.members} members` : chat.typing ? 'typing...' : chat.online ? 'Online' : 'Last seen today at 9:24 AM'}</span></div><div className="header-actions"><button className="icon-button" aria-label="Search messages"><SearchIcon /></button><button className="icon-button" onClick={() => setShowProfile(true)} aria-label="Open chat details"><MoreIcon /></button></div></header>
      <div className="message-area"><div className="date-separator"><span>Today</span></div>{chatMessages.map((item) => <Message key={item.id} item={item} onDelete={(id) => setMessages(messages.map((messageItem) => messageItem.id === id ? { ...messageItem, deleted: true } : messageItem))} />)}{chat.typing && <div className="typing"><span /><span /><span /></div>}</div>
      <div className="composer-wrap">{showAttachment && <AttachmentMenu />}{query && <div className="search-hint">Searching messages in <strong>{chat.name}</strong> for “{query}”</div>}<div className="composer"><button className="icon-button" aria-label="Emoji picker"><SmileIcon /></button><button className="icon-button" onClick={() => setShowAttachment(!showAttachment)} aria-label="Attach file"><PaperclipIcon /></button><input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendMessage()} placeholder="Write a message..." />{message ? <button className="send-button" onClick={sendMessage} aria-label="Send message"><SendIcon /></button> : <button className="icon-button" aria-label="Record voice message"><MicIcon /></button>}</div></div>
    </section>
    {showProfile && <ProfilePanel chat={chat} onClose={() => setShowProfile(false)} />}
    {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} onLogout={onLogout} />}
    {showNewChat && <NewChatModal onClose={() => setShowNewChat(false)} onStart={addChat} />}
    {showNewGroup && <NewGroupModal onClose={() => setShowNewGroup(false)} />}
  </main>
}

function Message({ item, onDelete }) {
  if (item.deleted) return <div className={`message-row ${item.direction}`}><div className="message-bubble deleted"><em>↗ This message was deleted</em><time>{item.time}</time></div></div>
  return <div className={`message-row ${item.direction}`}><div className="message-bubble">{item.sender && <strong className="sender-name">{item.sender}</strong>}{item.type === 'image' ? <div className="media-card"><div className="mock-image"><ImageIcon size={28} /><span>Weekend<br />light</span></div><div><strong>weekend-light.jpg</strong><small>1.8 MB <DownloadIcon size={13} /></small></div></div> : item.type === 'document' ? <div className="document-card"><div className="file-icon"><FileTextIcon size={19} /></div><div><strong>Project-notes.pdf</strong><small>PDF · 2.4 MB</small></div><DownloadIcon size={16} /></div> : item.type === 'voice' ? <VoiceMessage /> : <p>{item.text}</p>}<div className="message-meta"><time>{item.time}</time>{item.direction === 'outgoing' && <span className={`checks ${item.status}`}>✓✓</span>} {item.direction === 'outgoing' && <button onClick={() => onDelete(item.id)} className="delete-message">Delete</button>}</div></div></div>
}

function VoiceMessage() { return <div className="voice-message"><button className="play-button"><PlayIcon size={14} fill="currentColor" /></button><div className="waveform">{Array.from({ length: 26 }).map((_, index) => <i key={index} style={{ height: `${8 + ((index * 13) % 18)}px` }} />)}</div><span>0:18</span></div> }
function AttachmentMenu() { return <div className="attachment-menu">{[[ImageIcon, 'Photos'], [FileTextIcon, 'Documents'], [CameraIcon, 'Camera'], [MicIcon, 'Voice message']].map(([Icon, label]) => <button key={label}><span><Icon size={18} /></span>{label}</button>)}</div> }
function ProfilePanel({ chat, onClose }) { return <div className="side-panel"><div className="panel-header"><button className="icon-button" onClick={onClose}><CloseIcon /></button><strong>{chat.group ? 'Group info' : 'Contact info'}</strong></div><div className="profile-cover"><div className={`avatar profile-avatar ${chat.color}`}>{chat.initials}</div><h2>{chat.name}</h2><span>{chat.group ? `${chat.members} members` : 'Online'}</span></div><div className="info-section"><label>About</label><p>{chat.group ? 'Ideas, updates and everything in between.' : 'Making space for good conversations.'}</p></div><div className="info-section"><label>Email</label><p>{chat.email || 'maya.chen@example.com'}</p></div><button className="outline-button">Edit profile</button></div> }
function SettingsPanel({ onClose, onLogout }) { return <div className="side-panel settings-panel"><div className="panel-header"><button className="icon-button" onClick={onClose}><CloseIcon /></button><strong>Settings</strong></div><div className="settings-user"><div className="avatar avatar-user">AM</div><div><strong>Alex Morgan</strong><span>alex.morgan@example.com</span></div></div>{['Account', 'Privacy', 'Notifications', 'Appearance', 'Chat settings', 'About ChatSphere'].map((item, index) => <button className="settings-row" key={item}><span className={`setting-icon setting-${index}`}><SettingsGlyph index={index} /></span>{item}<ChevronIcon size={16} /></button>)}<button className="logout-row" onClick={onLogout}><LogoutIcon size={18} /> Log out</button></div> }
function NewChatModal({ onClose, onStart }) { return <Modal title="New conversation" onClose={onClose}><div className="search-box modal-search"><SearchIcon size={17} /><input autoFocus placeholder="Search people" /></div><div className="contact-list">{users.slice(0, 5).map((user) => <button key={user.name} onClick={() => onStart(user.name)}><div className={`avatar ${user.color}`}>{user.initials}</div><div><strong>{user.name}</strong><span>{user.about}</span></div><ArrowRight size={16} /></button>)}</div></Modal> }
function NewGroupModal({ onClose }) { const [name, setName] = useState(''); return <Modal title="Create a group" onClose={onClose}><label>Group name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Weekend plans" /></label><div className="group-picture"><div><CameraIcon size={19} /></div><span>Add group picture</span></div><label>Select members</label><div className="member-pills">{users.slice(0, 4).map((user) => <button key={user.name}><span className={`avatar tiny ${user.color}`}>{user.initials}</span>{user.name.split(' ')[0]}</button>)}</div><button className="primary-button" onClick={onClose}>Create group <ArrowRight size={17} /></button></Modal> }
function Modal({ title, onClose, children }) { return <div className="modal-backdrop"><div className="modal"><div className="panel-header"><strong>{title}</strong><button className="icon-button" onClick={onClose}><CloseIcon /></button></div>{children}</div></div> }

const initialMessages = [{ id: 1, chatId: 'maya', direction: 'incoming', type: 'text', text: 'Hey Alex! How are you doing?', time: '10:36 AM' }, { id: 2, chatId: 'maya', direction: 'outgoing', type: 'text', text: 'Hey Maya! I’m good, just wrapping up a few things.', time: '10:37 AM', status: 'read' }, { id: 3, chatId: 'maya', direction: 'incoming', type: 'image', time: '10:38 AM' }, { id: 4, chatId: 'maya', direction: 'outgoing', type: 'voice', time: '10:39 AM', status: 'read' }, { id: 5, chatId: 'maya', direction: 'incoming', type: 'text', text: 'That sounds perfect. See you soon!', time: '10:42 AM' }, { id: 6, chatId: 'design', direction: 'incoming', sender: 'Nora Patel', type: 'text', text: 'I’ve shared the updated moodboard in the thread.', time: '9:14 AM' }, { id: 7, chatId: 'design', direction: 'outgoing', type: 'document', time: '9:18 AM', status: 'delivered' }, { id: 8, chatId: 'family', direction: 'incoming', sender: 'Mum', type: 'text', text: 'Dinner is at seven, don’t be late!', time: 'Yesterday' }]
const chatList = [{ id: 'maya', name: 'Maya Chen', initials: 'MC', color: 'avatar-coral', lastMessage: 'That sounds perfect. See you soon!', time: '10:42 AM', unread: 2, online: true, typing: true, email: 'maya.chen@example.com' }, { id: 'design', name: 'Design crew', initials: 'DC', color: 'avatar-indigo', lastMessage: 'Nora: updated moodboard', time: '9:18 AM', unread: 4, group: true, members: 8 }, { id: 'jordan', name: 'Jordan Mitchell', initials: 'JM', color: 'avatar-yellow', lastMessage: 'Are we still on for lunch?', time: 'Yesterday', online: true }, { id: 'family', name: 'Family circle', initials: 'FC', color: 'avatar-green', lastMessage: 'Dinner is at seven', time: 'Yesterday', group: true, members: 6, muted: true }, { id: 'sophia', name: 'Sophia Williams', initials: 'SW', color: 'avatar-purple', lastMessage: 'Shared a document', time: 'Mon', online: true }, { id: 'leo', name: 'Leo Anderson', initials: 'LA', color: 'avatar-blue', lastMessage: 'Voice message', time: 'Sun', muted: true }]
const users = [{ name: 'Jordan Mitchell', initials: 'JM', color: 'avatar-yellow', about: 'Always up for a good coffee.' }, { name: 'Sophia Williams', initials: 'SW', color: 'avatar-purple', about: 'Building things that matter.' }, { name: 'Leo Anderson', initials: 'LA', color: 'avatar-blue', about: 'Available' }, { name: 'Nora Patel', initials: 'NP', color: 'avatar-coral', about: 'In a meeting' }, { name: 'Maya Chen', initials: 'MC', color: 'avatar-coral', about: 'Online now' }]

const SearchIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
const SettingsIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="m19.4 15 .1.1a2 2 0 0 1-2.8 2.8l-.1-.1a2 2 0 0 0-3.4 1.4v.3a2 2 0 0 1-4 0v-.2a2 2 0 0 0-3.4-1.5l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a2 2 0 0 0-1.5-3.4h-.2a2 2 0 0 1 0-4h.2A2 2 0 0 0 2.9 4.3l-.1-.1A2 2 0 0 1 5.6 1.4l.1.1A2 2 0 0 0 9.1 0h.2a2 2 0 0 1 4 0v.2a2 2 0 0 0 3.4 1.5l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a2 2 0 0 0 1.5 3.4h.2a2 2 0 0 1 0 4H21a2 2 0 0 0-1.6 3.1Z" /></svg>
const ChevronIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
const MoreIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>
const BackIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
const CloseIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 6 12 12M18 6 6 18" /></svg>
const PlusIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
const UsersIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
const MuteIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5 6 9H2v6h4l5 4V5ZM23 9l-6 6M17 9l6 6" /></svg>
const SmileIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg>
const PaperclipIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m20.5 11.5-8.9 8.9a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 0 1 5.7 5.7l-9.2 9.2a2 2 0 0 1-2.8-2.8l8.5-8.5" /></svg>
const SendIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="m3 20 18-8L3 4v6l12 2-12 2v6Z" /></svg>
const MicIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 17v5M8 22h8" /></svg>
const ImageIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>
const FileTextIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6M8 13h8M8 17h6" /></svg>
const DownloadIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>
const PlayIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 9 6-9 6V6Z" /></svg>
const CameraIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L8 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3l-1.5-2Z" /><circle cx="12" cy="13" r="3" /></svg>
const LogoutIcon = (props) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6" /></svg>
function SettingsGlyph({ index }) { return index === 0 ? <LockKeyhole size={18} /> : index === 1 ? <Sparkles size={18} /> : index === 2 ? <MessageCircle size={18} /> : <SettingsIcon size={18} /> }

export default App
