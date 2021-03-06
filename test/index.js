import assert from 'assert';
import {parseHTML} from '../build/index.js';
import {randomHTML, renderHTML} from 'random-html';

describe('parseHTML', () => {

  it('works with simple examples', () => {

    var roundTrip = html => {
      var html1 = html.replace(/[ \n]+/g, '');
      var result = parseHTML(html1)[0];
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


  it('permits mismatched tags', () => {
    var roundTrip = html => {
      var html1 = html.replace(/[ \n]+/g, '');
      var result = parseHTML(html1, {allowMismatchedTags: true})[0];
      assert.ok(!(result instanceof Error), result.message);
      assert.deepEqual(result, {'name': 'div', 'props': {}, 'children': ['foo']});
    }

    roundTrip(`<div>foo</p>`);
  });


  it('works with doctype', () => {

    var roundTrip = doctype => {
      var html = '<!DOCTYPE ' + doctype + '>';
      var result = parseHTML(html)[0];
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
      var result = parseHTML(html)[0];
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
      var result = parseHTML(html)[0];
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
      var result = parseHTML(html)[0];
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
      var result = parseHTML(html)[0];
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


  it('works with CDATA tags', () => {

    var roundTrip = (html, expected) => {
      var result = parseHTML(html, {allowCData: true})[0];
      assert.ok(undefined !== result, 'result is undefined');
      assert.ok(!(result instanceof Error), result.message);
      if (undefined !== expected) {
        assert.deepEqual(expected, result);
      }
    }

    roundTrip(`<textarea><![CDATA[<foo> && <bar> && </textarea>]]></textarea>`, {
      name: 'textarea'
    , props: {}
    , children: [{
        name: '!CDATA'
      , props: {}
      , children:['<foo> && <bar> && </textarea>']
      }
    ]});
  });


  it('works with IE-specific pseudo-tags', () => {

    var roundTrip = (html, expected) => {
      var result = parseHTML(html, {allowIETags: true})[0];
      assert.ok(undefined !== result, 'result is undefined');
      assert.ok(!(result instanceof Error), result.message);
      if (undefined !== expected) {
        assert.deepEqual(expected, result);
      }
    }

    roundTrip(`<![if !IE]>non-standard conditional tag<![endif]>`, {
      name: '!if'
    , props: {'args': '!IE'}
    , children: ['non-standard conditional tag']
    });

    roundTrip(`<![if gt IE 8]>non-standard conditional tag<![endif]>`, {
      name: '!if'
    , props: {'args': 'gt IE 8'}
    , children: ['non-standard conditional tag']
    });
  });


  it('works with XML declarations', () => {

    var roundTrip = (html, expected, strict) => {
      var result = parseHTML(html, {allowXMLDeclarations: true, allowSyntaxErrors: !strict})[0];
      assert.ok(undefined !== result, 'result is undefined');
      assert.ok(!(result instanceof Error), result.message);
      if (undefined !== expected) {
        assert.deepEqual(expected, result);
      }
    }

    roundTrip(`<?xml version="1.0" encoding="UTF-8"?>`, {
      name: '?xml'
      , props: {'version': '1.0', 'encoding': 'UTF-8'}
    , children: []
    }, true);

    roundTrip(`<?xml version="1.0" encoding="UTF-8"?>`, {
      name: '?xml'
      , props: {'version': '1.0', 'encoding': 'UTF-8'}
    , children: []
    }, false);

  });


  it('works with tricky/broken html snippets', () => {

    var roundTrip = (html, expected) => {
      var result = parseHTML(html, {allowSyntaxErrors: true})[0];
      assert.ok(undefined !== result, 'result is undefined');
      assert.ok(!(result instanceof Error), result.message);
      if (undefined !== expected) {
        assert.deepEqual(expected, result);
      }
    }

    roundTrip(`<img alt="foo 'bar' "baz""/>`);
    roundTrip(`<img alt="foo "bar" "baz""/>`);

    roundTrip(`<embed
      height=267
      type=application/x-shockwave-flash
      pluginspage=http://www.macromedia.com/go/getflashplayer width=400
    />`);

    roundTrip(`<ul><li>incorrect close tag</li></ul'>`);

    roundTrip(`<p><strong>a typo!<</strong></p>`);

    roundTrip(`<html><script><!-- html comment // js comment --></script></html>`);
    roundTrip(`< p> wrong position for spaces</ p>`);

    roundTrip(`<script>var s = '/*test'.replace(/\\/*/, '');</script>`, {
      name: 'script'
    , props: {}
    , children: [`var s = '/*test'.replace(/\\/*/, '');`]
    });
  });
});
