import assert from 'assert';
import {parseHTML} from '../src/index.js';
import {randomHTML, renderHTML} from 'random-html';

describe('parseHTML', () => {

  it('works with simple examples', () => {

    var roundTrip = html => {
      var html1 = html.replace(/[ \n]+/g, '');
      var result = parseHTML(html1);
      assert.ok(!(result instanceof Error), result.message);
      assert.equal(html1, renderHTML(false)(result));
    }

    roundTrip(`<div>foo</div>`);

    roundTrip(`
      <div>
        <p>foo</p>
      </div>
    `);

    roundTrip(`
      <div>
        <p>foo</p>
        <p>bar</p>
        <p>baz</p>
      </div>
    `);
  });

  it('works with doctype', () => {

    var roundTrip = doctype => {
      var html = '<!DOCTYPE ' + doctype + '>';
      var result = parseHTML(html);
      assert.ok(!(result instanceof Error), result.message);
      assert.equal(html, renderHTML(false)(result));
    };

    [ 'html'
    , 'HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"'
    , 'html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"'
    , 'html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"'
    , 'html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd"']
      .map(roundTrip);
  });


  it('works with comments', () => {

    var roundTrip = comment => {
      var html = '<!--' + comment + '-->';
      var result = parseHTML(html);
      assert.ok(!(result instanceof Error), result.message);
      assert.deepEqual({name: '!--', props: {}, children: [comment]}, result);
      assert.equal(html, renderHTML(false)(result));
    };

    [ 'foo bar baz'
    , 'qux > corge - grault>'
    , '<p> this is a comment </p>'
    , '']
      .map(roundTrip);
  });


  it('works with style tags', () => {
    var roundTrip = style => {
      var html = '<style>' + style + '</style>';
      var result = parseHTML(html);
      assert.ok(!(result instanceof Error), result.message);
      assert.deepEqual({name: 'style', props: {}, children: [style]}, result);
      assert.equal(html, renderHTML(false)(result));
    };

    [ `
      .foo {
        border: #000 1px solid;
      }`
    , `
      .bar {
        /* <p>this is a comment</p> */
      }`
    , `
      .baz {
        /* </style> still being a comment */
      }`
    , `
      .qux::before{
        content: '</style>';
      }`
    , `
      .qux::after{
        content: "</style>";
      }`
    , `
      .quux::before{
        content: '\\\'</style>\\\'';
      }`]
    .map(roundTrip);
  });


  it('works with script tags', () => {
    var roundTrip = script => {
      var html = '<script>' + script + '</script>';
      var result = parseHTML(html);
      assert.ok(!(result instanceof Error), result.message);
      assert.deepEqual({name: 'script', props: {}, children: [script]}, result);
      assert.equal(html, renderHTML(false)(result));
    };

    [ `
      var foo = 123;
      `
    , `
        /* <p>this is a comment</p> */
      `
    , `
        /* </script> still being a comment */
      `
    , `
        // </script> still being a comment
      `
    , `
      var bar = '</script>';
      `
    , `
      var baz = "</script>";
      `]
    .map(roundTrip);
  });


  it('works with props', () => {
    var roundTrip = (html, props) => {
      var result = parseHTML(html);
      assert.ok(!(result instanceof Error), result.message);
      assert.deepEqual(result.props, props);
    };

    roundTrip(`<div foo = '42' bar = "bar" baz = qux></div>`, {
      foo: '42', bar: 'bar', baz: 'qux'
    });

    roundTrip(`<input type = "checkbox" checked></div>`, {
      type: "checkbox"
    , checked: true
    });

    roundTrip(`<style type = "text/css"></style>`, {
      type: "text/css"
    });

    roundTrip(`<script type = "text/javascript"></script>`, {
      type: "text/javascript"
    });
  });


  it('works with tricky/broken html snippets', () => {

    var roundTrip = html => {
      var result = parseHTML(html, {strict: false});
      assert.ok(!(result instanceof Error), result.message);
    }

    roundTrip(`<img alt="foo 'bar' "baz""/>`);
    roundTrip(`<img alt="foo "bar" "baz""/>`);

    roundTrip(`<embed height=267 type=application/x-shockwave-flash pluginspage=http://www.macromedia.com/go/getflashplayer width=400/>`);

    roundTrip(`<ul><li>foobar</li></ul'>`);
  });
});
