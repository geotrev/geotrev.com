"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Posts = function () {
  function Posts() {
    _classCallCheck(this, Posts);

    this.endpoint = "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@gwtrev";
    this.render();
  }

  _createClass(Posts, [{
    key: "getMonth",
    value: function getMonth(postMonth) {
      var month = {};
      month[0] = "January";
      month[1] = "February";
      month[2] = "March";
      month[3] = "April";
      month[4] = "May";
      month[5] = "June";
      month[6] = "July";
      month[7] = "August";
      month[8] = "September";
      month[9] = "October";
      month[10] = "November";
      month[11] = "December";
      return month[postMonth];
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      fetch(this.endpoint).then(function (res) {
        if (res.ok) {
          return res.json();
        }

        throw new Error("Couldn't load posts. :(");
      }).then(function (data) {
        var cache = localStorage.getItem("posts");
        var fetchedPosts = JSON.stringify(data.items.filter(function (item) {
          return item.categories.length;
        }));

        if (!cache || cache !== fetchedPosts) {
          localStorage.setItem("posts", fetchedPosts);
        }

        _this.renderDom();
      });
    }
  }, {
    key: "createPostNode",
    value: function createPostNode(title, url, timestamp) {
      var year = new Date(timestamp).getFullYear(),
          day = new Date(timestamp).getDay(),
          month = this.getMonth(new Date(timestamp).getMonth()),
          datetimeAttribute = timestamp.split(" ")[0],
          visibleTime = "".concat(month, " ").concat(day, ", ").concat(year),
          id = title.replace(/\s/g, "-");
      var post = document.createElement("li");
      post.className = "post";
      var header = document.createElement("h3");
      header.id = id;
      var titleLink = document.createElement("a");
      titleLink.href = url;
      titleLink.innerText = title;
      var time = document.createElement("time");
      time.setAttribute("aria-labelledby", id);
      time.setAttribute("datetime", datetimeAttribute);
      time.innerText = visibleTime;
      header.appendChild(titleLink);
      post.appendChild(header);
      post.appendChild(time);
      return post;
    }
  }, {
    key: "renderDom",
    value: function renderDom() {
      var _this2 = this;

      var target = document.getElementById("posts");
      var posts = JSON.parse(localStorage.getItem("posts"));
      target.innerHTML = "";
      posts.forEach(function (post) {
        var postNode = _this2.createPostNode(post.title, post.link, post.pubDate);

        target.appendChild(postNode);
      });
    }
  }]);

  return Posts;
}();

new Posts();
