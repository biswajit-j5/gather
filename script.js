const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const seedPosts = [
  {id:1,name:"Maya Chen",handle:"mayamakes",avatar:"https://i.pravatar.cc/100?img=12",verified:true,time:"12 min ago",circle:"Design folks",text:"A little reminder that your first version doesn't have to be your final version. Make it, learn from it, make it better. That's the whole thing. 🌱\n\nWhat are you working on this week? #BuildInPublic #CreativeProcess",likes:128,comments:18,shares:7,liked:false,saved:false},
  {id:2,name:"Jordan Lee",handle:"jordansketches",avatar:"https://i.pravatar.cc/100?img=32",verified:false,time:"38 min ago",circle:"Design folks",text:"Collected a few colors on my morning walk. Nature really does have the best palette. 🍂 #DailyUI #DesignInspiration",image:"https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1100&q=85",likes:86,comments:12,shares:4,liked:false,saved:false},
  {id:3,name:"Priya Shah",handle:"priyashah",avatar:"https://i.pravatar.cc/100?img=5",verified:true,time:"1 hr ago",circle:"Slow living",text:"Sunday's tiny joys: a slow coffee, a book with dog-eared pages, and absolutely nowhere to be. Trying to bring a little of that energy into every day. ☕",likes:204,comments:32,shares:15,liked:true,saved:false},
  {id:4,name:"Sam Rivera",handle:"sam.builds",avatar:"https://i.pravatar.cc/100?img=60",verified:false,time:"2 hrs ago",circle:"Indie makers",text:"Shipped a tiny feature today that took me three tries and a lot of tea. Not every win has to be a launch day. Sometimes progress is just getting unstuck. 🚀 #BuildInPublic",likes:63,comments:9,shares:3,liked:false,saved:true},
  {id:5,name:"Noah Kim",handle:"noahkim",avatar:"https://i.pravatar.cc/100?img=44",verified:false,time:"3 hrs ago",circle:"Slow living",text:"Question for the community: what's one small habit that made your life noticeably better? Mine is leaving my phone in another room while I read.",likes:47,comments:26,shares:2,liked:false,saved:false},
  {id:6,name:"Lena Ortiz",handle:"lenawrites",avatar:"https://i.pravatar.cc/100?img=48",verified:true,time:"4 hrs ago",circle:"Indie makers",text:"A note to anyone building something quietly: people don't see the drafts, the doubts, or the tiny decisions. Keep going anyway. Your pace is allowed to be your own. ✨",likes:172,comments:21,shares:11,liked:false,saved:false}
];
let posts = seedPosts.map(p => ({...p}));
let nextId = 7;
let currentView = "feed";
let currentFilter = "Latest";
let currentCircle = "";
let selectedImage = "";
let mobileNav;
let toastTimer;

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function formatText(text) {
  return escapeHTML(text).replace(/(^|\s)(#[a-zA-Z0-9_]+)/g, '$1<span class="hashtag">$2</span>');
}
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}
function showModal(title, message, action = "Sounds good") {
  $("#modalTitle").textContent = title;
  $("#modalText").textContent = message;
  $("#modalAction").textContent = action;
  $("#modalBackdrop").hidden = false;
}
function closeModal() { $("#modalBackdrop").hidden = true; }

function postTemplate(post) {
  const likeCount = post.likes + (post.liked ? 1 : 0);
  return `<article class="post-card" data-id="${post.id}">
    <header class="post-header">
      <img class="post-avatar" src="${escapeHTML(post.avatar)}" alt="${escapeHTML(post.name)}" loading="lazy">
      <div class="post-author"><strong>${escapeHTML(post.name)} ${post.verified ? '<span class="verified" title="Verified">✓</span>' : ''}</strong><small>@${escapeHTML(post.handle)} · ${escapeHTML(post.time)}</small></div>
      <button class="post-menu" data-action="menu" aria-label="Post options">···</button>
    </header>
    <p class="post-copy">${formatText(post.text)}</p>
    ${post.image ? `<img class="post-image" src="${escapeHTML(post.image)}" alt="Image shared by ${escapeHTML(post.name)}" loading="lazy">` : ""}
    <div class="post-meta"><span class="reaction-stack"><span class="reaction-icons">💚 ✨</span>${likeCount} people found this lovely</span><span>${post.comments} comments</span></div>
    <div class="post-actions">
      <button class="post-action ${post.liked ? "liked" : ""}" data-action="like" aria-pressed="${post.liked}"><span class="action-icon">${post.liked ? "♥" : "♡"}</span> Like</button>
      <button class="post-action" data-action="comment"><span class="action-icon">▢</span> Comment</button>
      <button class="post-action share" data-action="share"><span class="action-icon">↗</span> Share</button>
      <button class="post-action ${post.saved ? "saved" : ""}" data-action="save" aria-pressed="${post.saved}" aria-label="${post.saved ? "Unsave" : "Save"} post"><span class="action-icon">${post.saved ? "▣" : "▢"}</span></button>
    </div>
  </article>`;
}
function getVisiblePosts() {
  let visible = [...posts];
  if (currentView === "saved") visible = visible.filter(p => p.saved);
  if (currentView === "explore") visible = visible.sort((a,b) => b.likes - a.likes);
  if (currentView === "messages") return [];
  if (currentCircle) visible = visible.filter(p => p.circle === currentCircle);
  const query = $("#searchInput").value.trim().toLowerCase();
  if (query) visible = visible.filter(p => [p.name,p.handle,p.text,p.circle].some(s => s.toLowerCase().includes(query)));
  if (currentFilter === "Following") visible = visible.filter(p => ["Maya Chen","Priya Shah","Sam Rivera","Lena Ortiz"].includes(p.name));
  return visible;
}
function renderPosts() {
  const list = $("#postList");
  const visible = getVisiblePosts();
  $("#postCount").textContent = visible.length;
  list.innerHTML = visible.length ? visible.map(postTemplate).join("") :
    `<div class="empty-state"><strong>${currentView === "messages" ? "Your conversations live here" : currentView === "saved" ? "No saved posts yet" : "Nothing to see just yet"}</strong><p>${currentView === "messages" ? "Messaging is a demo feature in this frontend-only project." : currentView === "saved" ? "Save a post with the bookmark icon and it will show up here." : "Try a different search or share something new with your community."}</p></div>`;
  $("#feedHeading").textContent = currentView === "saved" ? "Saved posts" : currentView === "explore" ? "Explore community" : currentView === "messages" ? "Messages" : currentCircle || "Your feed";
}
function setView(view, circle = "") {
  currentView = view;
  currentCircle = circle;
  $$(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  if (mobileNav) {
    mobileNav.querySelectorAll("button").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
  }
  $("#pageTitle").textContent = circle || ({feed:"Your feed",explore:"Explore",saved:"Saved posts",messages:"Messages"})[view] || "Your feed";
  renderPosts();
  if (view === "messages") showToast("Messaging is a visual demo — no backend is connected.");
}
function openComposer() {
  $("#composerEditor").hidden = false;
  $("#postText").focus();
  $("#composer").scrollIntoView({behavior:"smooth",block:"center"});
}
function addPost() {
  const text = $("#postText").value.trim();
  if (!text && !selectedImage) { showToast("Write something or add a photo first."); return; }
  posts.unshift({id:nextId++,name:"Alex Morgan",handle:"alexmorgan",avatar:"https://i.pravatar.cc/100?img=47",verified:false,time:"Just now",circle:"Your circle",text:text || "Sharing a moment with my community. ✨",image:selectedImage,likes:0,comments:0,shares:0,liked:false,saved:false});
  $("#postText").value = "";
  $("#charCount").textContent = "0 / 500";
  $("#composerEditor").hidden = true;
  $("#postBtn").disabled = true;
  selectedImage = "";
  $("#imageUpload").value = "";
  setView("feed");
  showToast("Your post is live in this demo!");
  window.scrollTo({top:0,behavior:"smooth"});
}
$("#postText").addEventListener("input", e => {
  if (e.target.value.length > 500) e.target.value = e.target.value.slice(0,500);
  $("#charCount").textContent = `${e.target.value.length} / 500`;
  $("#postBtn").disabled = !e.target.value.trim() && !selectedImage;
});
$("#postBtn").addEventListener("click", addPost);
$("#composerInput").addEventListener("click", openComposer);
$("#jumpComposer").addEventListener("click", openComposer);
$("#postList").addEventListener("click", async e => {
  const button = e.target.closest("[data-action]");
  if (!button) return;
  const card = button.closest(".post-card");
  const post = posts.find(p => p.id === Number(card.dataset.id));
  if (!post) return;
  const action = button.dataset.action;
  if (action === "like") { post.liked = !post.liked; renderPosts(); }
  if (action === "save") { post.saved = !post.saved; renderPosts(); showToast(post.saved ? "Post saved for later." : "Removed from saved posts."); }
  if (action === "comment") showModal("Join the conversation", "Comments are represented in this frontend demo. Connect a backend to store and publish replies.", "Got it");
  if (action === "menu") showModal("Post options", "This is a community demo. You can save posts, like them, or share a link.", "Okay");
  if (action === "share") {
    try { await navigator.clipboard.writeText(`${location.href.split("#")[0]}#post-${post.id}`); showToast("Post link copied!"); }
    catch { showModal("Share this post", `Copy this post reference: ${post.name} — ${post.text.slice(0,90)}`, "Close"); }
  }
});
$("#searchInput").addEventListener("input", renderPosts);
$$(".nav-item").forEach(btn => btn.addEventListener("click", () => setView(btn.dataset.view)));
$$(".circle-link").forEach(btn => btn.addEventListener("click", () => {
  $$(".filter-btn").forEach(filter => filter.classList.toggle("selected", filter.dataset.filter === "Latest"));
  currentFilter = "Latest";
  setView("feed", btn.dataset.circle);
}));
$$(".filter-btn").forEach(btn => btn.addEventListener("click", () => {
  currentFilter = btn.dataset.filter;
  $$(".filter-btn").forEach(b => b.classList.toggle("selected", b === btn));
  renderPosts();
}));
$("#photoOption").addEventListener("click", () => $("#imageUpload").click());
$("#imageUpload").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { showToast("Please choose an image file."); return; }
  if (file.size > 5 * 1024 * 1024) { showToast("Please choose an image under 5 MB."); return; }
  const reader = new FileReader();
  reader.onload = () => {
    selectedImage = reader.result;
    $("#composerEditor").hidden = false;
    $("#postBtn").disabled = false;
    $("#editorHint").textContent = "Photo ready to share";
    showToast("Photo added to your draft.");
  };
  reader.readAsDataURL(file);
});
$("#moodOption").addEventListener("click", () => {
  const moods = ["😊 feeling good","☕ taking it slow","✨ feeling inspired","🌱 growing every day"];
  const text = $("#postText");
  $("#composerEditor").hidden = false;
  text.value = `${text.value}${text.value ? " " : ""}${moods[Math.floor(Math.random()*moods.length)]}`;
  text.dispatchEvent(new Event("input"));
  text.focus();
});
$("#circleOption").addEventListener("click", () => showModal("Choose your circle", "Your post will be shared with your community feed in this demo. Circle-specific publishing can be connected to a backend later.", "Got it"));
$("#addStory").addEventListener("click", () => showModal("Your story", "Stories are a visual placeholder in this frontend-only clone. Add a backend to publish stories that expire after 24 hours.", "Sounds good"));
$$("[data-story]").forEach(btn => btn.addEventListener("click", () => {
  showModal(`${btn.dataset.story}'s story`, "Stories are a visual placeholder in this frontend-only clone.", "Close");
}));
$("#allStories").addEventListener("click", () => showToast("You're viewing all available stories."));
$("#addCircle").addEventListener("click", () => showModal("Create a circle", "Circles help people gather around shared interests. Circle creation is a demo interaction and is not persisted.", "Nice"));
$("#inviteBtn").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(location.href); showToast("Demo link copied — invite a friend!"); }
  catch { showModal("Invite a friend", "Copy this page's URL from your browser to share the demo.", "Okay"); }
});
$("#profileBtn").addEventListener("click", () => showModal("Alex Morgan", "This is the demo profile. Sign-in, profile editing, and account data are not connected to a server.", "Close"));
$("#homeLink").addEventListener("click", e => { e.preventDefault(); setView("feed"); window.scrollTo({top:0,behavior:"smooth"}); });
$("#notificationsBtn").addEventListener("click", () => showModal("Notifications", "You're all caught up in this demo.", "Close"));
$("#trendingOptions").addEventListener("click", () => showModal("Trending today", "Explore the topics your community is talking about.", "Close"));
$("#exploreTrends").addEventListener("click", () => { setView("explore"); window.scrollTo({top:0,behavior:"smooth"}); });
$("#seePeople").addEventListener("click", () => showModal("People to know", "Follow suggestions are sample profiles. Follow buttons work locally in this demo.", "Got it"));
$$(".follow-btn").forEach(btn => btn.addEventListener("click", () => {
  const following = btn.classList.toggle("following");
  btn.textContent = following ? "Following" : "Follow";
  showToast(following ? "You're now following this creator." : "Unfollowed this creator.");
}));
$("#privacyLink").addEventListener("click", e => { e.preventDefault(); showModal("Privacy in this demo", "This project runs in your browser. Posts and reactions are kept in page memory only and reset when you reload. Uploaded photos are not sent to a server.", "Understood"); });
$("#modalClose").addEventListener("click", closeModal);
$("#modalAction").addEventListener("click", closeModal);
$("#modalBackdrop").addEventListener("click", e => { if (e.target === $("#modalBackdrop")) closeModal(); });
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); $("#searchInput").focus(); }
});
mobileNav = document.createElement("nav");
mobileNav.className = "mobile-nav";
mobileNav.setAttribute("aria-label","Mobile navigation");
mobileNav.innerHTML = `<button class="active" data-view="feed" aria-label="Home">⌂</button><button data-view="explore" aria-label="Explore">⌕</button><button data-view="saved" aria-label="Saved posts">♡</button><button data-view="messages" aria-label="Messages">✉</button>`;
document.body.appendChild(mobileNav);
mobileNav.querySelectorAll("button").forEach(btn => btn.addEventListener("click", () => {
  setView(btn.dataset.view);
}));
renderPosts();
