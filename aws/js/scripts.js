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

	window.addEventListener("hashchange", handleRoute);

	// ===== INIT =====
	function init() {
		load();
		handleRoute();
	}

	document.addEventListener("DOMContentLoaded", init);
})();
