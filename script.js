const API_KEY = "39476557296347d8b4525ba46216bd81";
const url = "https://newsapi.org/v2/everything?q=";
// q = query field, e.g. politics, finance etc. 
// https://newsapi.org/v2/everything?q=cricket&from=2023-08-08&sortBy=publishedAt&apiKey=9a900d0ceccd495d8957305bb1ee7580
window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

// extracting data from apiKey
async function fetchNews(query) {
    console.log(url+query+API_KEY)
    const res = await fetch(url+query+"&apiKey="+API_KEY);
    const data = await res.json();
    // console.log(data)
    bindData(data.articles);
}
// binding all the data together and setting them in their proper sections/divs
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = ""; /*to avoid appending of prev_newsCards with ndw_newsCards on making newer calls  */

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true); /*all the divs and sections will be cloned using this cloneNode(true)*/
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// putting the data in cards and setting their value
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description; 

    // converting time to en-US version format
    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank"); /*_blank is used to open the article in new-tab*/
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});