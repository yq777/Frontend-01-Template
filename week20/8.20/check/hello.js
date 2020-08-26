var page = require('webpage').create();
page.open('https://baidu.com/', function (status) {
  console.log('Status: ' + status);
  var title = page.evaluate(function() {
    return document.title;
  });
  console.log('Page title is ' + title);
  if (status === 'success') {
    page.render('./baidu.png');
  }
  phantom.exit();
});
