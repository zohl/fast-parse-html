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



#define CURRENT_CHAR (s.charCodeAt(pos))
#define HAS_INPUT (pos < len)
#define NEXT_CHAR (++pos)

#define START_SELECTION (_sel_begin = pos)
#define STOP_SELECTION (_sel_end = pos)
#define GET_SELECTION (s.substring(_sel_begin, _sel_end))
#define GET_SELECTION_INT(l,r) (s.substring(_sel_begin + (l), _sel_end + (r)))
#define GET_SELECTION_LENGTH (_sel_end - _sel_begin)


#define SKIP_WHILE(_E) while ((HAS_INPUT) && _E) NEXT_CHAR
#define SELECT_WHILE(_i,_E) START_SELECTION; SKIP_WHILE(_E); STOP_SELECTION;

#define TRY_CHAR(_c) ((_c == CURRENT_CHAR) ? NEXT_CHAR : false)
#define READ_CHAR(_E) (_E ? s.charAt(pos++) : '')
#define READ_ANY_CHAR (s.charAt(pos++))

#define IS_SPACE(_c) (_c == CODE_SPACE || _c == CODE_NEWLINE || _c == CODE_CR || _c == CODE_TAB)
#define IS_NUMBER(_c) (CODE_0 <= _c && _c <= CODE_9)
#define IS_ALPHA(_c) ((CODE_A_LC <= _c && _c <= CODE_Z_LC) || (CODE_A_UC <= _c && _c <= CODE_Z_UC))
#define IS_IDENTIFICATOR(_c) (IS_ALPHA(_c) || IS_NUMBER(_c) || _c == CODE_HYPHEN || _c == CODE_COLON)

#define IS_NOT_STRING_SPECIFIC(_q,_c) (_q != _c && _c != CODE_BACKSLASH)
#define IS_NOT_TEXT_SPECIFIC(_c) (_c != CODE_LT && _c != CODE_GT)
#define IS_NOT_COMMENT_SPECIFIC(_c) (_c != CODE_GT && _c != CODE_HYPHEN && _c != CODE_LT)


#define IS_NOT_STYLE_SPECIFIC(_c) (_c != CODE_LT && _c != CODE_QUOT && _c != CODE_APOS && _c != CODE_SLASH)
#define IS_NOT_SCRIPT_SPECIFIC(_c) (_c != CODE_LT && _c != CODE_QUOT && _c != CODE_APOS && _c != CODE_SLASH)
#define IS_NOT_CSTYLE_COMMENT_SPECIFIC(_c) (_c != CODE_ASTERISK)
#define IS_NOT_CPPSTYLE_COMMENT_SPECIFIC(_c) (_c != CODE_NEWLINE)
#define IS_NOT_CDATA_SPECIFIC(_c) (_c != CODE_RIGHT_BRACKET)

#define IS_REGEXP_COMPATIBLE(_c) (_c == CODE_LEFT_PARENTHESIS || _c == CODE_COMMA || _c == CODE_EQUAL || _c == CODE_COLON || _c == CODE_LEFT_BRACKET || _c == CODE_BANG || _c == CODE_AMP || _c == CODE_PIPE || _c == CODE_QUESTION || _c == CODE_LEFT_CURLY_BRACKET || _c == CODE_RIGHT_CURLY_BRACKET || _c == CODE_SEMICOLON)

#define COMMENT_ENDING '-->'

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

  var _sel_begin = 0;
  var _sel_end = 0;

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


  const tryString = t => {
    for (let q = 0; q < t.length; ++q) {
      if (s.charCodeAt(pos + q) != t.charCodeAt(q)) {
        return false;
      }
    }
    pos += t.length;
    return true;
  };


  const readProps = () => {
    var result = {};

    while (HAS_INPUT) {
      SKIP_WHILE(IS_SPACE(CURRENT_CHAR));
      if (IS_ALPHA(CURRENT_CHAR)) {

        SELECT_WHILE(0, IS_ALPHA(CURRENT_CHAR));
        let name = GET_SELECTION;

        SKIP_WHILE(IS_SPACE(CURRENT_CHAR));

        if (TRY_CHAR(CODE_EQUAL)) {
          SKIP_WHILE(IS_SPACE(CURRENT_CHAR));
          result[name] = '';

          let q = s.charCodeAt(pos);
          if (TRY_CHAR(CODE_QUOT)
           || TRY_CHAR(CODE_APOS)) {
            START_SELECTION;
            if (!readString(q)) {
              return;
            }
            STOP_SELECTION;
            result[name] = GET_SELECTION_INT(0,-1);
          }
          else {
            SELECT_WHILE(0, IS_ALPHA(CURRENT_CHAR));
            result[name] += GET_SELECTION;
          }
        }
        else {
          result[name] = true;
        }
        SKIP_WHILE(IS_SPACE(CURRENT_CHAR));
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
            NEXT_CHAR;
          }
        }
      }
    }

    return result;
  };

  const readOpenTag = (tagName) => {

    if (undefined === tagName && !strict) {
      SKIP_WHILE(IS_SPACE(CURRENT_CHAR));
    }

    var name;

    if (undefined !== tagName) {
      name = tagName;
    }
    else {
      name = READ_CHAR(IS_ALPHA(CURRENT_CHAR));
      SELECT_WHILE(0, IS_IDENTIFICATOR(CURRENT_CHAR));
      name += GET_SELECTION;
    }

    if (!name.length) {
      return setError('readOpenTag', 'empty name');
    }

    var props;

    if (ieTags && CODE_BANG == name.charCodeAt(0)) {
      SKIP_WHILE(IS_SPACE(CURRENT_CHAR));
      SELECT_WHILE(0, CODE_RIGHT_BRACKET != CURRENT_CHAR);
      props = {
        args: GET_SELECTION
      };

      if (!TRY_CHAR(CODE_RIGHT_BRACKET)) {
        return setError('readOpenTag', 'unexpected end of the IE-specific tag');
      }
    }
    else {
      props = readProps();
    }

    SKIP_WHILE(IS_SPACE(CURRENT_CHAR));

    if (TRY_CHAR(CODE_GT)) {
      onOpenTag(name, props);
    }
    else if (tryString('/>')) {
      onOpenTag(name, props);
      onCloseTag(name);
    }
    else {
      return setError('readOpenTag', 'unexpected end of the tag');
    }
  };

  const readCloseTag = (tagName) => {

    if (undefined === tagName && !strict) {
      SKIP_WHILE(IS_SPACE(CURRENT_CHAR));
    }

    var name;

    if (undefined !== tagName) {
      name = tagName;
    }
    else {
      name = READ_CHAR(IS_ALPHA(CURRENT_CHAR));
      SELECT_WHILE(0, IS_IDENTIFICATOR(CURRENT_CHAR));
      name += GET_SELECTION;
    }

    var checkEnding = (ieTags && CODE_BANG == name.charCodeAt(0))
      ? () => tryString(']>')
      : () => TRY_CHAR(CODE_GT);

    SKIP_WHILE(IS_SPACE(CURRENT_CHAR));

    while (HAS_INPUT && !checkEnding()) {
      if (strict) {
        return setError('readCloseTag', 'unexpected end of the tag');
      }
      NEXT_CHAR;
    }

    onCloseTag(name);
  };


  const readText = () => {
    SELECT_WHILE(0, IS_NOT_TEXT_SPECIFIC(CURRENT_CHAR));
    if (GET_SELECTION_LENGTH) {
      onText(GET_SELECTION);
    }
  };


  const readDocType = () => {

    SELECT_WHILE(0, !IS_SPACE(CURRENT_CHAR));
    var docTypeString = GET_SELECTION;

    if (docTypeString.toLowerCase() != 'doctype') {
      return setError('readDocType', 'expected doctype keyword, got "' + docTypeString + '"');
    }
    SKIP_WHILE(IS_SPACE(CURRENT_CHAR));
    SELECT_WHILE(0, (IS_NOT_TEXT_SPECIFIC(CURRENT_CHAR)));
    var contents = GET_SELECTION;
    SKIP_WHILE(IS_SPACE(CURRENT_CHAR));

    if (!TRY_CHAR(CODE_GT)) {
      return setError('readDocType', 'expected end of the pseudo tag');
    }

    onOpenTag('!' + docTypeString, {});
    onText(contents);
    onCloseTag('!' + docTypeString);
  };


  const readComment = () => {
    if (!TRY_CHAR(CODE_HYPHEN)) {
      setError('readComment', 'expected hyphen');
      return false;
    }

    while (HAS_INPUT) {
      SKIP_WHILE(IS_NOT_COMMENT_SPECIFIC(CURRENT_CHAR));

      if (tryString(COMMENT_ENDING)) {
        return true;
      }
      NEXT_CHAR;
    }

    setError('readComment', 'unexpected end of file');
    return false;
  };

  const readCStyleComment = () => {

    while (HAS_INPUT) {
      SKIP_WHILE(IS_NOT_CSTYLE_COMMENT_SPECIFIC(CURRENT_CHAR));

      if (tryString('*/')) {
        return true;
      }
      NEXT_CHAR;
    }

    setError('readCStyleComment', 'unexpected end of file');
    return false;
  };

  const readCPPStyleComment = () => {

    while (HAS_INPUT) {
      SKIP_WHILE(IS_NOT_CPPSTYLE_COMMENT_SPECIFIC(CURRENT_CHAR));

      if (TRY_CHAR(CODE_NEWLINE)) {
        return true;
      }
      else {
        NEXT_CHAR;
      }
    }

    return true;
  };


  const readString = c => {

    while (HAS_INPUT) {
      SKIP_WHILE(IS_NOT_STRING_SPECIFIC(c, CURRENT_CHAR));

      if (TRY_CHAR(c)) {
        return true;
      }

      TRY_CHAR(CODE_BACKSLASH);
      NEXT_CHAR;
    }

    setError('readString('+String.fromCharCode(c)+')', 'unexpected end of file');
    return false;
  };


  const readCDATA = () => {

    START_SELECTION;
    while (HAS_INPUT) {
      SKIP_WHILE(IS_NOT_CDATA_SPECIFIC(CURRENT_CHAR));

      STOP_SELECTION;
      if (tryString(']]>')) {
        onOpenTag('!CDATA', {});
        onText(GET_SELECTION);
        onCloseTag('!CDATA');
        return;
      }
      else {
        NEXT_CHAR;
      }
    }

    setError('readCDATA', 'unexpected end of file');
  };


  const readStyle = () => {

    readOpenTag('style');

    START_SELECTION;
    while (HAS_INPUT) {
      SKIP_WHILE(IS_NOT_STYLE_SPECIFIC(CURRENT_CHAR));

      STOP_SELECTION;
      if (tryString('</style>') || tryString('</STYLE>')) {
        onText(GET_SELECTION);
        onCloseTag('style');
        return;
      }

      if (tryString('/*')) {
        if(!readCStyleComment()) {
          return;
        }
      }
      else {
        let c = s.charCodeAt(pos);
        if (TRY_CHAR(CODE_QUOT)
         || TRY_CHAR(CODE_APOS)) {

          if (!readString(c)) {
            return;
          }
        }
        else {
          NEXT_CHAR;
        }
      }
    }

    if (!HAS_INPUT) {
      return setError('readStyle', 'unexpected end of file');
    }
  };

  const readScript = () => {

    readOpenTag('script');

    var pos1 = pos;
    var regexpCompatible = false;

    START_SELECTION;
    while (HAS_INPUT) {
      SKIP_WHILE(IS_NOT_SCRIPT_SPECIFIC(CURRENT_CHAR));

      for (; pos1 < pos; ++pos1) {
        if (IS_SPACE(s.charCodeAt(pos1))) {
          continue;
        }
        else {
          regexpCompatible = IS_REGEXP_COMPATIBLE(s.charCodeAt(pos1));
        }
      }

      STOP_SELECTION;
      if (tryString('</script>') || tryString('</SCRIPT>')) {
        onText(GET_SELECTION);
        onCloseTag('script');
        return;
      }

      if (tryString('<!-')) {
        if (!readComment()) {
          return;
        }
      }
      else if (tryString('/*')) {
        if (!readCStyleComment()) {
          return;
        }
      }
      else if (tryString('//')) {
        readCPPStyleComment();
      }
      else if (regexpCompatible && CODE_SLASH == CURRENT_CHAR) {
        NEXT_CHAR;
        if (!readString(CODE_SLASH)) {
          return;
        }
      }
      else {
        let c = s.charCodeAt(pos);
        if (TRY_CHAR(CODE_QUOT)
         || TRY_CHAR(CODE_APOS)) {

          if (!readString(c)) {
            return;
          }
        }
        else {
          NEXT_CHAR;
        }
      }
    }

    if (!HAS_INPUT) {
      return setError('readScript', 'unexpected end of file');
    }
  };


  const readXMLDeclaration = () => {
    if (!strict) {
      SKIP_WHILE(IS_SPACE(CURRENT_CHAR));
    }

    if (!tryString('xml')) {
      return setError('readXMLDeclaration', 'not an XML declaration');
    }

    var props = readProps();

    if (!((strict && tryString('?>')) || tryString('>'))) {
      return setError('readXMLDeclaration', 'unexpected end of the declaration');
    }

    onOpenTag('?xml', props);
    onCloseTag('?xml');
  };


  var prevPos = -1;

  while (HAS_INPUT) {
    if (null !== error) {
      break;
    }

    if (prevPos == pos) {
      setError('main loop', 'got stuck');
      break;
    }

    prevPos = pos;

    if (!strict) {
      if (TRY_CHAR(CODE_GT)) {
        // do nothing
      }
    }

    if (TRY_CHAR(CODE_LT)) {
      if (!strict && CODE_LT == s.charCodeAt(pos)) {
        // do nothing
      }
      else if (xmlDeclarations && TRY_CHAR(CODE_QUESTION)) {
        readXMLDeclaration();
      }
      else if (TRY_CHAR(CODE_SLASH)) {
        readCloseTag();
      }
      else if (TRY_CHAR(CODE_BANG)) {
        if (TRY_CHAR(CODE_HYPHEN)) {
          START_SELECTION;
          readComment();
          STOP_SELECTION;

          onOpenTag('!--', {});
          onText(GET_SELECTION_INT(1,-3));
          onCloseTag('!--');
        }
        else if (TRY_CHAR(CODE_LEFT_BRACKET)) {
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
        else if (!strict && READ_CHAR(IS_SPACE(CURRENT_CHAR))) {
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
