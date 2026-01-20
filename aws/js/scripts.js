(function () {
	const STORAGE_KEY = "klog_posts_v1";
	const SUB_KEY = "klog_subscribers_v1";
	const THEME_KEY = "klog_theme_v1";

	// ===== DOM REFERENCES =====
	const featuredEl = document.getElementById("featuredCards");
	const blogsListEl = document.getElementById("blogsList");
	const postSection = document.getElementById("post");
	const postTitleEl = document.getElementById("postTitle");
	const postAuthorEl = document.getElementById("postAuthor");
	const postDateEl = document.getElementById("postDate");
	const postContentEl = document.getElementById("postContent");

	const homeSection = document.getElementById("home");
	const blogsSection = document.getElementById("blogs");
	const addSection = document.getElementById("add");
	const aboutSection = document.getElementById("about");
	const contactSection = document.getElementById("contact");
	const tagsSection = document.getElementById("tags");
	const archiveSection = document.getElementById("archive");
	const authorsSection = document.getElementById("authors");

	const searchInput = document.getElementById("searchInput");
	const addForm = document.getElementById("addForm");
	const inputTitle = document.getElementById("inputTitle");
	const inputAuthor = document.getElementById("inputAuthor");
	const inputContent = document.getElementById("inputContent");
	const inputTags = document.getElementById("inputTags");
	const editingIdEl = document.getElementById("editingId");

	const navToggle = document.getElementById("navToggle");
	const navList = document.getElementById("navList");
	const themeToggle = document.getElementById("themeToggle");
	const subscribeForm = document.getElementById("subscribeForm");
	const subscribeEmail = document.getElementById("subscribeEmail");
	const subscribeMsg = document.getElementById("subscribeMsg");
	const subCountEl = document.getElementById("subCount");

	// ===== STATE =====
	let posts = [];

	const samplePosts = [
		{
			id: "p-" + Date.now(),
			title: "Getting started with small experiments",
			author: "Kshitiz",
			tags: ["experiments", "productivity"],
			content: "Start small. Ship fast. Learn more.",
			date: new Date().toISOString(),
		},
	];

	// ===== STORAGE =====
	function save() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
	}

	// subscribers storage
	function loadSubscribers() {
		const raw = localStorage.getItem(SUB_KEY);
		return raw ? JSON.parse(raw) : [];
	}

	function saveSubscribers(list) {
		localStorage.setItem(SUB_KEY, JSON.stringify(list));
	}

	function updateSubCount() {
		const list = loadSubscribers();
		if (subCountEl)
			subCountEl.textContent = list.length
				? `${list.length} subscriber${list.length > 1 ? "s" : ""}`
				: "";
	}

	function load() {
		const raw = localStorage.getItem(STORAGE_KEY);
		posts = raw ? JSON.parse(raw) : samplePosts;
	}

	// ===== ROUTING =====
	function showSection(section) {
		[
			homeSection,
			blogsSection,
			addSection,
			postSection,
			aboutSection,
			contactSection,
			tagsSection,
			archiveSection,
			authorsSection,
		].forEach((s) => s && (s.hidden = true));

		section && (section.hidden = false);
	}

	function handleRoute() {
		const hash = location.hash.replace("#/", "");
		if (!hash) {
			showSection(homeSection);
			renderFeatured();
			return;
		}
		if (hash.startsWith("post/")) {
			showSection(postSection);
			renderPost(hash.split("/")[1]);
		}
		if (hash === "blogs") {
			showSection(blogsSection);
			renderBlogsList();
		}
		if (hash === "add") showSection(addSection);
	}

	// ===== RENDER =====
	function renderFeatured() {
		featuredEl.innerHTML = "";
		posts.slice(0, 3).forEach((p) => featuredEl.appendChild(renderCard(p)));
	}

	function renderBlogsList(filter = "") {
		blogsListEl.innerHTML = "";
		posts.forEach((p) => blogsListEl.appendChild(renderCard(p)));
	}

	function renderCard(post) {
		const el = document.createElement("article");
		el.className = "card";
		el.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.author}</p>
      <a href="#/post/${post.id}">Read More</a>
    `;
		return el;
	}

	function renderPost(id) {
		const post = posts.find((p) => p.id === id);
		if (!post) return;
		postTitleEl.textContent = post.title;
		postAuthorEl.textContent = post.author;
		postDateEl.textContent = new Date(post.date).toLocaleString();
		postContentEl.textContent = post.content;
	}

	// ===== EVENTS =====
	addForm?.addEventListener("submit", (e) => {
		e.preventDefault();
		posts.unshift({
			id: "p-" + Date.now(),
			title: inputTitle.value,
			author: inputAuthor.value || "Anonymous",
			content: inputContent.value,
			tags: inputTags.value.split(","),
			date: new Date().toISOString(),
		});
		save();
		location.hash = "#/blogs";
	});

	themeToggle?.addEventListener("click", () => {
		const t =
			document.documentElement.dataset.theme === "light"
				? "dark"
				: "light";
		document.documentElement.dataset.theme = t;
		localStorage.setItem(THEME_KEY, t);
	});

	// newsletter subscribe handler
	subscribeForm?.addEventListener("submit", (e) => {
		e.preventDefault();
		const email = (subscribeEmail?.value || "").trim().toLowerCase();
		if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
			if (subscribeMsg) {
				subscribeMsg.textContent =
					"Please enter a valid email address.";
				subscribeMsg.classList.remove("subscribe-success");
				subscribeMsg.classList.add("subscribe-error");
			}
			return;
		}
		const list = loadSubscribers();
		if (list.includes(email)) {
			if (subscribeMsg) {
				subscribeMsg.textContent = "You're already subscribed.";
				subscribeMsg.classList.remove("subscribe-error");
				subscribeMsg.classList.add("subscribe-success");
			}
			return;
		}
		list.push(email);
		saveSubscribers(list);
		if (subscribeMsg) {
			subscribeMsg.textContent = "Thanks — you're subscribed!";
			subscribeMsg.classList.remove("subscribe-error");
			subscribeMsg.classList.add("subscribe-success");
		}
		subscribeEmail.value = "";
		updateSubCount();
		setTimeout(() => {
			if (subscribeMsg) {
				subscribeMsg.textContent = "";
				subscribeMsg.classList.remove(
					"subscribe-success",
					"subscribe-error",
				);
			}
		}, 4000);
	});

	window.addEventListener("hashchange", handleRoute);

	// ===== INIT =====
	function init() {
		// restore saved theme (if any)
		const savedTheme = localStorage.getItem(THEME_KEY);
		if (savedTheme) document.documentElement.dataset.theme = savedTheme;

		load();
		handleRoute();

		// subscriber count
		updateSubCount();

		// populate current year in footer
		const yearEl = document.getElementById("year");
		if (yearEl) yearEl.textContent = new Date().getFullYear();
	}

	document.addEventListener("DOMContentLoaded", init);
})();
