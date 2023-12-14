/** @format */

const API_KEY = "568bee3a37f0400aa040d0b91d3f2371";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

async function fetchNews(query) {
  const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
  const data = await res.json();
  console.log(data);
  bindData(data.articles);
}

function bindData(articles) {
  const cardContainer = document.getElementById("card-container");
  const newsCardTemplate = document.getElementById("templatenews"); // Fixed the variable name
  cardContainer.innerHTML = "";
  articles.forEach((article) => {
    if (!article.urlToImage) return; // Fixed the typo here
    const cardClone = newsCardTemplate.content.cloneNode(true); // Fixed the variable name
    fillDataIncard(cardClone, article);
    cardContainer.appendChild(cardClone);
  });
}

function fillDataIncard(cardClone, article) {
  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/jakarta",
  });
  const newsImage = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImage.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;
  newsSource.innerHTML = `${article.source.name} . ${date}`;
  // newsSource.innerHTML = `Published by: ${article.author || article.source.name}`;

  // for cliking a card
  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

let curSelectedNav = null;
function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);

  // remove a lod nav item and give selected item nav
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

//for searching
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("article");
  curSelectedNav = null;
});

// Pagination
// Add these variables at the top of your script
const pageSize = 12; // Number of articles per page
let currentPage = 1; // Current page, initialized to 1

// Modify the fetchNews function to include pagination
async function fetchNews(query, page = 1) {
  const res = await fetch(
    `${url}${query}&apiKey=${API_KEY}&page=${page}&pageSize=${pageSize}`
  );
  const data = await res.json();
  console.log(data);
  bindData(data.articles);
}

// Add these functions for pagination
function nextPage() {
  currentPage++;
  fetchNews(curSelectedNav.id, currentPage);
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchNews(curSelectedNav.id, currentPage);
  }
}
