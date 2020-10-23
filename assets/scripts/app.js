const listElement = document.querySelector(".posts");
const postTemplate = document.getElementById("single-post");
const form = document.querySelector("#new-post form");
const fetchButton = document.querySelector("#available-posts button");
const postList = document.querySelector("ul");

function sendHttpRequest(method, url, data) {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        return response.json().then((errData) => {
          console.log(errData);
          throw new Error("Something went wrong - server side!!");
        });
      }
    })
    .catch((err) => {
      console.log(err);
      throw new Error("Something went wrong!!");
    });
}

async function fetchPosts() {
  try {
    const responseData = await sendHttpRequest(
      "GET",
      "https://jsonplaceholder.typicode.com/posts"
    );
    const listOfPosts = responseData;
    for (const post of listOfPosts) {
      const postEl = document.importNode(postTemplate.content, true);
      postEl.querySelector("h2").textContent = post.title.toUpperCase();
      postEl.querySelector("p").textContent = post.body;
      postEl.querySelector("li").id = post.id;
      listElement.append(postEl);
    }
  } catch (error) {
    alert(error.message);
  }
}

async function createPosts(title, content) {
  const userId = Math.random();
  const post = {
    title: title,
    body: content,
    userId: userId,
  };

  sendHttpRequest("POST", "https://jsonplaceholder.typicode.com/posts", post); //for POST request we need to append the body(metadata such as post here) also.
}

fetchButton.addEventListener("click", fetchPosts);
form.addEventListener("submit", (event) => {
  console.log(event);
  event.preventDefault();
  const enteredTitle = event.currentTarget.querySelector("#title").value;
  const enteredContent = event.currentTarget.querySelector("#content").value;

  createPosts(enteredTitle, enteredContent);
});

postList.addEventListener("click", (event) => {
  if ((event.target.tagName = "BUTTON")) {
    const postId = event.target.closest("li").id;
    console.log(postId);
    sendHttpRequest(
      "DELETE",
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
  }
});
