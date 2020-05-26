const list = document.getElementById('container').children;
let result = [];
for (let li of list) {
  if (li.getAttribute('data-tag').match(/css/g)) {
    result.push({
      name: li.children[1].innerText,
      url: li.children[1].children[0].href,
    });
  }
}

