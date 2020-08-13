import { parseHTML, EOF } from '../src/parser.js';
let assert = require('assert');

it('parse a single element', () => {
  let doc = parseHTML('<div></div>');
  let div = doc.children[0];
  assert.equal(div.tagName, 'div');
  assert.equal(div.children.length, 0);
  assert.equal(div.type, 'element');
  assert.equal(div.attributes.length, 2);
});

it('parse a single element with test content', () => {
  let doc = parseHTML('<div>hello</div>');
  let text = doc.children[0].children[0];
  assert.equal(text.type, 'text');
  assert.equal(text.content, 'hello');
});

it('tab mismatch', () => {
  try {
    let doc = parseHTML('<div></vid>');
  } catch (e) {
    assert.equal(e.message, "Tag start end doesn't match!");
  }
});

it('text with <', () => {
  let doc = parseHTML('<div>a < b</div>');
  let text = doc.children[0].children[0];

  assert.equal(text.type, 'text');
  assert.equal(text.content, 'a < b');
});

it('with property', () => {
  let doc = parseHTML('<div id=a class=\'cls\' data="abc" ></div>');
  let div = doc.children[0];
  let count = 0;

  for (let attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, 'a');
    }
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, 'cls');
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, 'abc');
    }
  }

  assert.ok(count === 3);
});

it('with property 2', () => {
  let doc = parseHTML('<div id=a class=\'cls\' data="abc"></div>');
  let div = doc.children[0];
  let count = 0;

  for (let attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, 'a');
    }
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, 'cls');
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, 'abc');
    }
  }

  assert.ok(count === 3);
});

it('with property 3', () => {
  let doc = parseHTML('<div id=a class=\'cls\' data="abc" />');
  let div = doc.children[0];
  let count = 0;

  for (let attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, 'a');
    }
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, 'cls');
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, 'abc');
    }
  }

  assert.ok(count === 3);
});

it('script', () => {
  let content = `
  <div>abcd</div>
  <span>x</span>
  /script>
  <script
  <
  </
  </s
  </sc
  </scr
  </scri
  </scrip
  </script `;
  let doc = parseHTML(`<script>${content}</script>`);
  let text = doc.children[0].children[0];
  assert.equal(text.type, 'text');
  assert.equal(text.content, content);
});

it('attrbute with no value', () => {
  let doc = parseHTML('<div class />');
});

it('attrbute with no value 1', () => {
  let doc = parseHTML('<div class id/>');
});

it('selfCloseTag', () => {
  let doc = parseHTML('<div/>');
  let div = doc.children[0];
  assert.equal(div.tagName, 'div');
});

it('upperCase TagName', () => {
  let doc = parseHTML('<DIV/>');
  let div = doc.children[0];
  assert.equal(div.tagName, 'DIV');
});

it('beforeAttributeName has \n\t\f', () => {
  let doc = parseHTML(`<div 
  class id/>`);
  let div = doc.children[0];
  assert.equal(div.tagName, 'div');
});

it('beforeAttributeValue has \n\t\f', () => {
  let doc = parseHTML(`<div class=
  'ba'/>`);
  let div = doc.children[0];
  assert.equal(div.tagName, 'div');
});

it('UnquotedAttributeValue /', () => {
  let doc = parseHTML(`<div class=a/>`);
  let div = doc.children[0];
  assert.equal(div.tagName, 'div');
});

it('afterQuotedAttributeValue', () => {
  let doc = parseHTML(`<div class="a"a/>`);
  let div = doc.children[0];
  assert.equal(div.tagName, 'div');
});


it('endTagOpen', () => {
  let doc = parseHTML(`<div class=a></>`);
  let div = doc.children[0];
  assert.equal(div.tagName, 'div');
});