class Posts {
  constructor() {
    this.endpoint = "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@gwtrev"
    this.render()
  }

  getMonth(postMonth) {
    const month = {}
    month[0] = "January"
    month[1] = "February"
    month[2] = "March"
    month[3] = "April"
    month[4] = "May"
    month[5] = "June"
    month[6] = "July"
    month[7] = "August"
    month[8] = "September"
    month[9] = "October"
    month[10] = "November"
    month[11] = "December"

    return month[postMonth]
  }

  render() {
    fetch(this.endpoint)
      .then(res => {
        if (res.ok) {
          return res.json()
        }

        throw new Error("Couldn't load posts. :(")
      })
      .then(data => {
        const cache = localStorage.getItem("posts")
        const fetchedPosts = JSON.stringify(data.items.filter(item => item.categories.length))

        if (!cache || cache !== fetchedPosts) {
          localStorage.setItem("posts", fetchedPosts)
        }

        this.renderToDOM()
      })
  }

  createPostNode(title, url, timestamp) {
    const year = new Date(timestamp).getFullYear(),
      day = new Date(timestamp).getDate(),
      month = this.getMonth(new Date(timestamp).getMonth()),
      datetimeAttribute = timestamp.split(" ")[0],
      visibleTime = `${month} ${day}, ${year}`,
      id = title.replace(/\s/g, "-")

    const post = document.createElement("li")
    post.className = "post"

    const header = document.createElement("h3")
    header.id = id

    const titleLink = document.createElement("a")
    titleLink.href = url
    titleLink.innerText = title

    const time = document.createElement("time")
    time.setAttribute("aria-labelledby", id)
    time.setAttribute("datetime", datetimeAttribute)
    time.innerText = visibleTime

    header.appendChild(titleLink)
    post.appendChild(header)
    post.appendChild(time)

    return post
  }

  renderToDOM() {
    const target = document.getElementById("posts")
    const posts = JSON.parse(localStorage.getItem("posts"))

    target.innerHTML = ""

    posts.forEach(post => {
      const postNode = this.createPostNode(post.title, post.link, post.pubDate)
      target.appendChild(postNode)
    })
  }
}

new Posts()
