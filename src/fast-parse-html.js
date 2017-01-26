
const code_a = 'a'.charCodeAt(0);
const code_z = 'z'.charCodeAt(0);
const code_A = 'A'.charCodeAt(0);
const code_Z = 'Z'.charCodeAt(0);
const code_lt = '<'.charCodeAt(0);
const code_gt = '>'.charCodeAt(0);
const code_space = ' '.charCodeAt(0);
const code_hyphen = '-'.charCodeAt(0);
const code_quot = '"'.charCodeAt(0);
const code_apos = "'".charCodeAt(0);
const code_slash = '/'.charCodeAt(0);
const code_backslash = '\\'.charCodeAt(0);
const code_asterisk = '*'.charCodeAt(0);
const code_newline = '\n'.charCodeAt(0);
const code_cr = '\r'.charCodeAt(0);
const code_tab = '\t'.charCodeAt(0);
const code_colon = ':'.charCodeAt(0);
const code_0 = '0'.charCodeAt(0);
const code_9 = '9'.charCodeAt(0);
const code_bang = '!'.charCodeAt(0);
const code_equal = '='.charCodeAt(0);

const isSpace = c => (c == code_space || c == code_newline || c == code_cr || c == code_tab);
const isNotSpace = c => !isSpace(c);
const isAlpha = c => (code_a <= c  && c <= code_z) || (code_A <= c && c <= code_z);
const isNumber = c => (code_0 <= c && c <= code_9);
const isIdentificator = c => isAlpha(c) || isNumber(c)
   || (c == code_hyphen) || (c == code_colon);

const isNotTextSpecific = c => (c != code_lt && c != code_gt);
const isNotEndOfComment = c => (c != code_gt && c != code_hyphen);
const isNotStyleSpecific = c => (c != code_lt && c != code_quot && c != code_apos && c != code_slash);
const isNotScriptSpecific = c => (c != code_lt && c != code_quot && c != code_apos && c != code_slash);
const isNotCStyleCommentSpecific = c => (c != code_asterisk);
const isNotCPPStyleCommentSpecific = c => (c != code_newline);
const isNotStringSpecific = q => c => (c != q && c != code_backslash);


/** Parse given HTML text using event-based approach.

   @arg {Object} $0 - callbacks.

   @arg {Function} $0.onOpenTag - called for each open tag being
   successfully parsed.

   @arg {Function} $0.onCloseTag - called for each close tag being
   successfully parsed.

   @arg {Function} $0.onText - called for each text element being parsed.

   @return {(void|Error)}
*/
const genericParseHTML = ({onOpenTag, onCloseTag, onText}, options) => s => {
  const len = s.length;
  const strict = (options && undefined !== options.strict) ? options.strict : true;

  var pos = 0;
  var error = null;

  const setError = (fname, message) => {
    var s1 = s.substring(0, pos);
    var line = (s1.match(/\n/g) || []).length;
    var column = (s1.match(/[^\n]*$/)[0] || '').length;
    error = new Error(
      fname + ' failed at position (' + line + ', ' + column + '): '
    + message
    + '\n\n\n' + s.substring(pos - 100, pos-1) + '||||' + s.substring(pos, pos + 100));
  };

  const skipWhile = p => {
    while ((pos < len) && p(s.charCodeAt(pos))) {
      ++pos;
    }
  };

  const takeWhile = p => {

    var oldPos = pos;
    while ((pos < len) && p(s.charCodeAt(pos))) {
      ++pos;
    }
    return s.substring(oldPos, pos);
  };


  const tryChar = c => {

    if (c == s.charCodeAt(pos)) {
      ++pos;
      return true;
    }
    return false;
  };

  const tryString = t => {
    for (let q = 0; q < t.length; ++q) {
      if (s.charCodeAt(pos + q) != t.charCodeAt(q)) {
        return false;
      }
    }
    pos += t.length;
    return true;
  };


  const readChar = p => (!p || p(s.charCodeAt(pos))) ? s.charAt(pos++) : '';

  const readProps = () => {
    var result = {};

    while (pos < len) {
      skipWhile(isSpace);
      if (isAlpha(s.charCodeAt(pos))) {
        let name = takeWhile(isIdentificator);
        skipWhile(isSpace);

        if (tryChar(code_equal)) {
          skipWhile(isSpace);
          result[name] = '';

          let q = s.charCodeAt(pos);
          if (tryChar(code_quot) || tryChar(code_apos)) {
            let string = readString(q);
            if (null !== error) {
              return;
            }
            result[name] = string;
          }
          else {
            result[name] += takeWhile(isAlpha);
          }
        }
        else {
          result[name] = true;
        }
        skipWhile(isSpace);
      }
      else {
        if (strict) {
          break;
        }
        else {
          if ((code_slash == s.charCodeAt(pos) && code_gt == s.charCodeAt(pos + 1))
           || (code_gt == s.charCodeAt(pos))) {
            break;
          }
          else {
            readChar();
          }
        }
      }
    }

    return result;
  };

  const readOpenTag = (tagName) => {

    var name = tagName || readChar(isAlpha) + takeWhile(isIdentificator);
    if (!name.length) {
      setError('readOpenTag', 'empty name');
      return;
    }

    var props = readProps();
    skipWhile(isSpace);

    if (tryChar(code_gt)) {
      onOpenTag(name, props);
    }
    else if (tryString('/>')) {
      onOpenTag(name, props);
      onCloseTag(name);
    }
    else {
      setError('readOpenTag', 'unexpected end of the tag');
      return;
    }
  };

  const readCloseTag = () => {

    var name = readChar(isAlpha) + takeWhile(isIdentificator);

    skipWhile(isSpace);
    if (strict) {
      if (!tryChar(code_gt)) {
        setError('readCloseTag', 'unexpected end of the tag');
        return;
      }
    }
    else {
      while (pos < len && !tryChar(code_gt)) {
        readChar();
      }
    }
    onCloseTag(name);
  };


  const readText = () => {

    var text = takeWhile(isNotTextSpecific);
    if (!text.length) {
      return;
    }
    onText(text);
  };


  const readDocType = () => {

    var docTypeString = takeWhile(isNotSpace);

    if (docTypeString.toLowerCase() != 'doctype') {
      setError('readDocType', 'expected doctype keyword, got "' + docTypeString + '"');
      return;
    }
    skipWhile(isSpace);

    var contents = takeWhile(isNotTextSpecific);
    skipWhile(isSpace);

    if (!tryChar(code_gt)) {
      setError('readDocType', 'expected end of the pseudo tag');
      return;
    }

    onOpenTag('!' + docTypeString, {});
    onText(contents);
    onCloseTag('!' + docTypeString);
  };


  const readComment = () => {
    if (!tryChar(code_hyphen)) {
      setError('readComment', 'expected hyphen');
      return;
    }

    var contents = '';

    while (pos < len) {
      contents += takeWhile(isNotEndOfComment);

      if (!(pos < len)) {
        setError('readComment', 'unexpected end of file');
        return;
      }

      if (tryString('-->')) {
        break;
      }

      contents += readChar();
    }

    onOpenTag('!--', {});
    onText(contents);
    onCloseTag('!--');
  };


  const readCStyleComment = () => {
    var result = '';

    while (pos < len) {
      result += takeWhile(isNotCStyleCommentSpecific);

      if (!(pos < len)) {
        setError('readCStyleComment', 'unexpected end of file');
        return;
      }

      if (tryString('*/')) {
        break;
      }

      result += readChar();
    }

    return result;
  };


  const readCPPStyleComment = () => {
    var result = '';
    while (pos < len) {
      result += takeWhile(isNotCPPStyleCommentSpecific);

      if (tryChar(code_newline)) {
        break;
      }
      else {
        result += readChar();
      }
    }

    return result;
  };


  const readString = c => {
    var result = '';

    while (pos < len) {
      result += takeWhile(isNotStringSpecific(c));
      if (!(pos < len)) {
        setError('readString', 'unexpected end of file');
        return;
      }

      if (tryChar(c)) {
        break;
      }

      if (tryChar(code_backslash)) {
        result += '\\';
      }

      result += readChar();
    }

    return result;
  };

  const readStyle = () => {

    readOpenTag('style');

    var contents = '';

    while (pos < len) {
      contents += takeWhile(isNotStyleSpecific);

      if (!(pos < len)) {
        setError('readStyle', 'unexpected end of file');
        return;
      }

      if (tryString('</style>')) {
        break;
      }

      if (tryString('/*')) {
        let comment = readCStyleComment();
        if (null !== error) {
          return;
        }
        contents += '/*' + comment + '*/';
      }
      else {
        let c = s.charAt(pos);
        if (tryChar(code_quot) || tryChar(code_apos)) {

          let string = readString(c.charCodeAt(0));
          if (null !== error) {
            return;
          }

          contents += c + string + c;
        }
        else {
          contents += readChar();
        }
      }
    }

    onText(contents);
    onCloseTag('style');
  };


  const readScript = () => {

    readOpenTag('script');

    var contents = '';

    while (pos < len) {
      contents += takeWhile(isNotScriptSpecific);

      if (!(pos < len)) {
        setError('readScript', 'unexpected end of file');
        return;
      }

      if (tryString('</script>')) {
        break;
      }

      if (tryString('/*')) {
        let comment = readCStyleComment();
        if (null !== error) {
          return;
        }
        contents += '/*' + comment + '*/';
      }
      else if (tryString('//')) {
        contents += '//' + readCPPStyleComment() + '\n';
      }
      else {
        let c = s.charAt(pos);
        if (tryChar(code_quot) || tryChar(code_apos)) {

          let string = readString(c.charCodeAt(0));
          if (null !== error) {
            return;
          }

          contents += c + string + c;
        }
        else {
          contents += readChar();
        }
      }
    }

    onText(contents);
    onCloseTag('script');
  };


  var prevPos = -1;

  while (pos < len) {
    if (null !== error) {
      break;
    }

    if (prevPos == pos) {
      setError('main loop', 'got stuck');
      break;
    }

    prevPos = pos;

    if (tryChar(code_lt)) {
      if (tryChar(code_slash)) {
        readCloseTag();
      }
      else if (tryChar(code_bang)) {
        if (tryChar(code_hyphen)) {
          readComment();
        }
        else {
          readDocType();
        }
      }
      else {
        if (tryString('style')) {
          readStyle();
        }
        else if (tryString('script')) {
          readScript();
        }
        else {
          readOpenTag();
        }
      }
    }
    else {
      readText();
    }
  }

  if (null !== error) {
    return error;
  }
}


/** Parse given HTML text into ready-to-consume structure.

   @arg {string} s - HTML text.

   @return {Object}
*/


const parseHTML = (s, options) => {
  var result = [];
  var stack = [];
  var node = null;

  var onOpenTag = (name, props) => {

    if (null != node) {
      stack.push(node);
    }
    else {
      // TODO optional check for nested tags
    }
    node = {
      name: name
    , props: props
    , children: []
    };
  };

  var onCloseTag = name => {

    if (null != node) {
      if (stack.length) {
        let parent = stack.pop();
        parent.children.push(node);
        node = parent;
      }
      else {
        result.push(node);
        node = null;
      }
    }
    else {
      // TODO optional exception
    }
  };

  var onText = text => {

    if (null != node) {
      node.children.push(text);
    }
    else {
      // TODO optional text node
      result.push(text);
    }
  };


  var output = genericParseHTML({onOpenTag, onCloseTag, onText}, options)(s);
  if (output instanceof Error) {
    return output;
  }

  return result[0];
};

export {genericParseHTML, parseHTML}
