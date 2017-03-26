#define CODE_A_LC                97
#define CODE_Z_LC                122
#define CODE_A_UC                65
#define CODE_Z_UC                90
#define CODE_LT                  60
#define CODE_GT                  62
#define CODE_SPACE               32
#define CODE_HYPHEN              45
#define CODE_QUOT                34
#define CODE_APOS                39
#define CODE_SLASH               47
#define CODE_BACKSLASH           92
#define CODE_ASTERISK            42
#define CODE_NEWLINE             10
#define CODE_CR                  13
#define CODE_TAB                 9
#define CODE_COLON               58
#define CODE_0                   48
#define CODE_9                   57
#define CODE_BANG                33
#define CODE_EQUAL               61
#define CODE_LEFT_BRACKET        91
#define CODE_RIGHT_BRACKET       93
#define CODE_QUESTION            63
#define CODE_LEFT_PARENTHESIS    40
#define CODE_COMMA               44
#define CODE_SEMICOLON           59
#define CODE_AMP                 38
#define CODE_PIPE                124
#define CODE_LEFT_CURLY_BRACKET  123
#define CODE_RIGHT_CURLY_BRACKET 125

// // 97     'a'.charCodeAt(0)
// // 122    'z'.charCodeAt(0)
// // 65     'A'.charCodeAt(0)
// // 90     'Z'.charCodeAt(0)
// // 60     '<'.charCodeAt(0)
// // 62     '>'.charCodeAt(0)
// // 32     ' '.charCodeAt(0)
// // 45     '-'.charCodeAt(0)
// // 34     '"'.charCodeAt(0)
// // 39     "'".charCodeAt(0)
// // 47     '/'.charCodeAt(0)
// // 92     '\\'.charCodeAt(0)
// // 42     '*'.charCodeAt(0)
// // 10     '\n'.charCodeAt(0)
// // 13     '\r'.charCodeAt(0)
// // 9      '\t'.charCodeAt(0)
// // 58     ':'.charCodeAt(0)
// // 48     '0'.charCodeAt(0)
// // 57     '9'.charCodeAt(0)
// // 33     '!'.charCodeAt(0)
// // 61     '='.charCodeAt(0)
// // 91     '['.charCodeAt(0)
// // 93     ']'.charCodeAt(0)
// // 63     '?'.charCodeAt(0)
// // 40     '('.charCodeAt(0)
// // 44     ','.charCodeAt(0)
// // 59     ';'.charCodeAt(0)
// // 38     '&'.charCodeAt(0)
// // 124    '|'.charCodeAt(0)
// // 123    '{'.charCodeAt(0)
// // 125    '}'.charCodeAt(0)

// const CODE_A_LC = 'a'.charCodeAt(0);
// const CODE_Z_LC = 'z'.charCodeAt(0);
// const CODE_A_UC = 'A'.charCodeAt(0);
// const CODE_Z_UC = 'Z'.charCodeAt(0);
// const CODE_LT = '<'.charCodeAt(0);
// const CODE_GT = '>'.charCodeAt(0);
// const CODE_SPACE = ' '.charCodeAt(0);
// const CODE_HYPHEN = '-'.charCodeAt(0);
// const CODE_QUOT = '"'.charCodeAt(0);
// const CODE_APOS = "'".charCodeAt(0);
// const CODE_SLASH = '/'.charCodeAt(0);
// const CODE_BACKSLASH = '\\'.charCodeAt(0);
// const CODE_ASTERISK = '*'.charCodeAt(0);
// const CODE_NEWLINE = '\n'.charCodeAt(0);
// const CODE_CR = '\r'.charCodeAt(0);
// const CODE_TAB = '\t'.charCodeAt(0);
// const CODE_COLON = ':'.charCodeAt(0);
// const CODE_0 = '0'.charCodeAt(0);
// const CODE_9 = '9'.charCodeAt(0);
// const CODE_BANG = '!'.charCodeAt(0);
// const CODE_EQUAL = '='.charCodeAt(0);
// const CODE_LEFT_BRACKET = '['.charCodeAt(0);
// const CODE_RIGHT_BRACKET = ']'.charCodeAt(0);
// const CODE_QUESTION = '?'.charCodeAt(0);
// const CODE_LEFT_PARENTHESIS = '('.charCodeAt(0);
// const CODE_COMMA = ','.charCodeAt(0);
// const CODE_SEMICOLON = ';'.charCodeAt(0);
// const CODE_AMP = '&'.charCodeAt(0);
// const CODE_PIPE = '|'.charCodeAt(0);
// const CODE_LEFT_CURLY_BRACKET = '{'.charCodeAt(0);
// const CODE_RIGHT_CURLY_BRACKET = '}'.charCodeAt(0);


const isSpace = c => (c == CODE_SPACE || c == CODE_NEWLINE || c == CODE_CR || c == CODE_TAB);
const isNotSpace = c => !isSpace(c);
const isAlpha = c => (CODE_A_LC <= c  && c <= CODE_Z_LC) || (CODE_A_UC <= c && c <= CODE_Z_UC);
const isNumber = c => (CODE_0 <= c && c <= CODE_9);
const isIdentificator = c => isAlpha(c) || isNumber(c)
   || (c == CODE_HYPHEN) || (c == CODE_COLON);

const isNotTextSpecific = c => (c != CODE_LT && c != CODE_GT);
const isNotEndOfComment = c => (c != CODE_GT && c != CODE_HYPHEN && c != CODE_LT);
const isNotStyleSpecific = c => (c != CODE_LT && c != CODE_QUOT && c != CODE_APOS && c != CODE_SLASH);
const isNotScriptSpecific = c => (c != CODE_LT && c != CODE_QUOT && c != CODE_APOS && c != CODE_SLASH);
const isNotCStyleCommentSpecific = c => (c != CODE_ASTERISK);
const isNotCPPStyleCommentSpecific = c => (c != CODE_NEWLINE);
const isNotStringSpecific = q => c => (c != q && c != CODE_BACKSLASH);
const isNotCDATASpecific = c => (c != CODE_RIGHT_BRACKET);
const isRegexpCompatible = c =>
         c == CODE_LEFT_PARENTHESIS
      || c == CODE_COMMA
      || c == CODE_EQUAL
      || c == CODE_COLON
      || c == CODE_LEFT_BRACKET
      || c == CODE_BANG
      || c == CODE_AMP
      || c == CODE_PIPE
      || c == CODE_QUESTION
      || c == CODE_LEFT_CURLY_BRACKET
      || c == CODE_RIGHT_CURLY_BRACKET
      || c == CODE_SEMICOLON;


/** Parse given HTML text using event-based approach.

   @arg {Object} $0 - callbacks.

   @arg {Function} $0.onOpenTag - called for each open tag being
   successfully parsed.

   @arg {Function} $0.onCloseTag - called for each close tag being
   successfully parsed.

   @arg {Function} $0.onText - called for each text element being parsed.

   @return {(void|Error)}
*/
const genericParseHTML = ({onOpenTag, onCloseTag, onText}, userOptions) => s => {
  const len = s.length;
  const options = userOptions || {};
  const strict = (undefined !== options.strict) ? options.strict : true;
  const cdata = (undefined !== options.cdata) ? options.cdata: false;
  const ieTags = (undefined !== options.ieTags) ? options.ieTags: false;
  const xmlDeclarations = (undefined !== options.xmlDeclarations) ? options.xmlDeclarations: false;

  var pos = 0;
  var error = null;

  const getPosition = p => {
    var s1 = s.substring(0, p);
    var line = 1 + (s1.match(/\n/g) || []).length;
    var s2 = s1.match(/[^\n]*$/)[0] || '';
    var column = s2.length;
    return '(' + line + ', ' + column + ')';
  };

  const setError = (fname, message) => {
    error = new Error(fname + ' failed at position ' + getPosition(pos) + ': ' + message);
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

        if (tryChar(CODE_EQUAL)) {
          skipWhile(isSpace);
          result[name] = '';

          let q = s.charCodeAt(pos);
          if (tryChar(CODE_QUOT) || tryChar(CODE_APOS)) {
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
          if ((CODE_SLASH == s.charCodeAt(pos) && CODE_GT == s.charCodeAt(pos + 1))
           || (CODE_GT == s.charCodeAt(pos))) {
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

    if (undefined === tagName && !strict) {
      skipWhile(isSpace);
    }

    var name = tagName || readChar(isAlpha) + takeWhile(isIdentificator);
    if (!name.length) {
      setError('readOpenTag', 'empty name');
      return;
    }

    var props;

    if (ieTags && CODE_BANG == name.charCodeAt(0)) {
      skipWhile(isSpace);

      props = {
        args: takeWhile(c => CODE_RIGHT_BRACKET != c)
      };

      if (!tryChar(CODE_RIGHT_BRACKET)) {
        setError('readOpenTag', 'unexpected end of the IE-specific tag');
        return;
      }
    }
    else {
      props = readProps();
    }

    skipWhile(isSpace);

    if (tryChar(CODE_GT)) {
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

  const readCloseTag = (tagName) => {

    if (undefined === tagName && !strict) {
      skipWhile(isSpace);
    }

    var name = tagName || readChar(isAlpha) + takeWhile(isIdentificator);

    var checkEnding = (ieTags && CODE_BANG == name.charCodeAt(0))
      ? () => tryString(']>')
      : () => tryChar(CODE_GT);

    skipWhile(isSpace);

    while (pos < len && !checkEnding()) {
      if (strict) {
        setError('readCloseTag', 'unexpected end of the tag');
        return;
      }
      readChar();
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

    if (!tryChar(CODE_GT)) {
      setError('readDocType', 'expected end of the pseudo tag');
      return;
    }

    onOpenTag('!' + docTypeString, {});
    onText(contents);
    onCloseTag('!' + docTypeString);
  };


  const readComment = (ending = '-->') => {
    if (!tryChar(CODE_HYPHEN)) {
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

      if (tryString(ending)) {
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

      if (tryChar(CODE_NEWLINE)) {
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
        setError('readString('+String.fromCharCode(c)+')', 'unexpected end of file');
        return;
      }

      if (tryChar(c)) {
        break;
      }

      if (tryChar(CODE_BACKSLASH)) {
        result += '\\';
      }

      result += readChar();
    }

    return result;
  };

  const readCDATA = () => {
    var result = '';
    while (pos < len) {
      result += takeWhile(isNotCDATASpecific);

      if (tryString(']]>')) {
        break;
      }
      else {
        result += readChar();
      }
    }
    onOpenTag('!CDATA', {});
    onText(result);
    onCloseTag('!CDATA');
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

      if (tryString('</style>') || tryString('</STYLE>')) {
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
        if (tryChar(CODE_QUOT) || tryChar(CODE_APOS)) {

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
    var pos1 = pos;
    var regexpCompatible = false;

    while (pos < len) {
      contents += takeWhile(isNotScriptSpecific);

      for (; pos1 < pos; ++pos1) {
        if (isSpace(s.charCodeAt(pos1))) {
          continue;
        }
        regexpCompatible = isRegexpCompatible(s.charCodeAt(pos1));
      }

      if (!(pos < len)) {
        setError('readScript', 'unexpected end of file');
        return;
      }

      if (tryString('</script>') || tryString('</SCRIPT>')) {
        break;
      }
      if (tryString('<!-')) {
        readComment();
      }
      else if (tryString('/*')) {
        let comment = readCStyleComment();
        if (null !== error) {
          return;
        }
        contents += '/*' + comment + '*/';
      }
      else if (tryString('//')) {
        contents += '//' + readCPPStyleComment() + '\n';
      }
      else if (regexpCompatible && CODE_SLASH == s.charCodeAt(pos)) {
        contents += readChar() + readString(CODE_SLASH) + '/';
      }
      else {
        let c = s.charAt(pos);
        if (tryChar(CODE_QUOT) || tryChar(CODE_APOS)) {

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


  const readXMLDeclaration = () => {
    if (!strict) {
      skipWhile(isSpace);
    }

    if (!tryString('xml')) {
      setError('readXMLDeclaration', 'not an XML declaration');
      return;
    }

    var props = readProps();

    if (!((strict && tryString('?>')) || tryString('>'))) {
      setError('readXMLDeclaration', 'unexpected end of the declaration');
      return;
    }

    onOpenTag('?xml', props);
    onCloseTag('?xml');
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

    if (!strict) {
      if (tryChar(CODE_GT)) {
        // do nothing
      }
    }

    if (tryChar(CODE_LT)) {
      if (!strict && CODE_LT == s.charCodeAt(pos)) {
        // do nothing
      }
      else if (xmlDeclarations && tryChar(CODE_QUESTION)) {
        readXMLDeclaration();
      }
      else if (tryChar(CODE_SLASH)) {
        readCloseTag();
      }
      else if (tryChar(CODE_BANG)) {
        if (tryChar(CODE_HYPHEN)) {
          readComment();
        }
        else if (tryChar(CODE_LEFT_BRACKET)) {
          if (cdata && tryString('CDATA[')) {
            readCDATA();
          }
          else if (ieTags) {
            if (tryString('if')) {
              readOpenTag('!if');
            }
            else if (tryString('endif')) {
              readCloseTag('!if');
            }
          }
        }
        else if (!strict && readChar(isSpace)) {
          // do nothing
        }
        else {
          readDocType();
        }
      }
      else {
        if (tryString('style') || tryString('STYLE')) {
          readStyle();
        }
        else if (tryString('script') || tryString('SCRIPT')) {
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
