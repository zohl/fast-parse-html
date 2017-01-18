
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
const code_back_slash = '\\'.charCodeAt(0);
const code_asterisk = '*'.charCodeAt(0);
const code_newline = '\n'.charCodeAt(0);

const isSpace = c => (c == code_space);
const isNotSpace = c => !isSpace(c);
const isAlpha = c => (code_a <= c  && c <= code_z) || (code_A <= c && c <= code_z);

const isNotTextSpecific = c => (c != code_lt && c != code_gt);
const isNotEndOfComment = c => (c != code_gt && c != code_hyphen);
const isNotStyleSpecific = c => (c != code_lt && c != code_quot && c != code_apos && c != code_slash);
const isNotScriptSpecific = c => (c != code_lt && c != code_quot && c != code_apos && c != code_slash);
const isNotCStyleCommentSpecific = c => (c != code_asterisk);
const isNotCPPStyleCommentSpecific = c => (c != code_newline);
const isNotStringSpecific = q => c => (c != q && c != code_back_slash);


/** Parse given HTML text using event-based approach.

   @arg {Object} $0 - callbacks.

   @arg {Function} $0.onOpenTag - called for each open tag being
   successfully parsed.

   @arg {Function} $0.onCloseTag - called for each close tag being
   successfully parsed.

   @arg {Function} $0.onText - called for each text element being parsed.

   @return {(void|Error)}
*/
const genericParseHTML = ({onOpenTag, onCloseTag, onText}) => s => {
  var pos = 0;
  var len = s.length;
  var error = null;

  const setError = (fname, message) => {
    error = new Error(fname + ' failed at position ' + pos + ', ' + message);
  };

  const hasInput = () => (pos < len);

  const skipWhile = p => {
    while (hasInput() && p(s.charCodeAt(pos))) {
      ++pos;
    }
  };

  const takeWhile = p => {
    var oldPos = pos;
    skipWhile(p);
    return s.substring(oldPos, pos);
  };


  const tryChar = c => {

    if (c == s.charAt(pos)) {
      ++pos;
      return true;
    }
    return false;
  };

  const tryString = t => {
    if (s.substring(pos).startsWith(t)) {
      pos += t.length;
      return true;
    }
    return false;
  };


  const readChar = () => s.charAt(pos++);

  const readProps = () => {
    var result = {};

    while (hasInput()) {
      skipWhile(isSpace);
      if (isAlpha(s.charCodeAt(pos))) {
        let name = takeWhile(isAlpha);
        skipWhile(isSpace);

        if (tryChar('=')) {
          skipWhile(isSpace);

          let c = s.charAt(pos);
          if (tryChar('"') || tryChar("'")) {

            let string = readString(c);
            if (null !== error) {
              return;
            }
            result[name] = string;
          }
          else {
            result[name] = takeWhile(isNotSpace);
          }
        }
        else {
          result[name] = true;
        }
        skipWhile(isSpace);
      }
      else {
        break;
      }
    }

    return result;
  };

  const readOpenTag = (tagName) => {

    var name = tagName || takeWhile(isAlpha);
    if (!name.length) {
      setError('readOpenTag', 'empty name');
      return;
    }

    var props = readProps();
    skipWhile(isSpace);

    if (!tryChar('>')) {
      setError('readOpenTag', 'unexpected end of the tag');
      return;
    }

    onOpenTag(name, props);
  };

  const readCloseTag = () => {

    var name = takeWhile(isAlpha);

    skipWhile(isSpace);
    if (!tryChar('>')) {
      setError('readCloseTag', 'unexpected end of the tag');
      return;
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

    if (!tryChar('>')) {
      setError('readDocType', 'expected end of the pseudo tag');
      return;
    }

    onOpenTag('!' + docTypeString, {});
    onText(contents);
    onCloseTag('!' + docTypeString);
  };


  const readComment = () => {
    if (!tryChar('-')) {
      setError('readComment', 'expected hyphen');
      return;
    }

    var contents = '';

    while (hasInput()) {
      contents += takeWhile(isNotEndOfComment);

      if (!hasInput()) {
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

    while (hasInput()) {
      result += takeWhile(isNotCStyleCommentSpecific);

      if (!hasInput()) {
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
    while (hasInput()) {
      result += takeWhile(isNotCPPStyleCommentSpecific);

      if (readChar('\n')) {
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

    while (hasInput()) {
      result += takeWhile(isNotStringSpecific(c.charCodeAt(0)));
      if (!hasInput()) {
        setError('readString', 'unexpected end of file');
        return;
      }

      if (tryChar(c)) {
        break;
      }

      if (tryChar('\\')) {
        result += '\\';
      }

      result += readChar();
    }

    return result;
  };

  const readStyle = () => {

    readOpenTag('style');

    var contents = '';

    while (hasInput()) {
      contents += takeWhile(isNotStyleSpecific);

      if (!hasInput()) {
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
        if (tryChar('"') || tryChar("'")) {

          let string = readString(c);
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

    while (hasInput()) {
      contents += takeWhile(isNotScriptSpecific);

      if (!hasInput()) {
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
        if (tryChar('"') || tryChar("'")) {

          let string = readString(c);
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

  while (hasInput()) {
    if (null !== error) {
      break;
    }

    if (prevPos == pos) {
      setError('main loop', 'got stuck');
      break;
    }

    prevPos = pos;

    if (tryChar('<')) {
      if (tryChar('/')) {
        readCloseTag();
      }
      else if (tryChar('!')) {
        if (tryChar('-')) {
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


const parseHTML = s => {
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


  var output = genericParseHTML({onOpenTag, onCloseTag, onText})(s);
  if (output instanceof Error) {
    return output;
  }

  return result[0];
};

export {genericParseHTML, parseHTML}
