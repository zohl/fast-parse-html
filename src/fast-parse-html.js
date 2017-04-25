// @flow

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


#define CURRENT_CHAR (s.charCodeAt(pos))
#define HAS_INPUT (pos < len)
#define NEXT_CHAR (++pos)

#define START_SELECTION (_sel_begin = pos)
#define STOP_SELECTION (_sel_end = pos)
#define GET_SELECTION (s.substring(_sel_begin, _sel_end))
#define GET_SELECTION_INT(l,r) (s.substring(_sel_begin + (l), _sel_end + (r)))
#define GET_SELECTION_LENGTH (_sel_end - _sel_begin)


#define SKIP_WHILE(_E) while ((HAS_INPUT) && _E) NEXT_CHAR
#define SELECT_WHILE(_i,_E) START_SELECTION; SKIP_WHILE(_E); STOP_SELECTION

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


const coalesce = <T>(x: ?T, y:T):T => (null == x) ? y : x;

/**
   @name OnOpenTagHandler
   @function

   @arg {string} name
   @arg {Object} props
   @return {void}
 */
type OnOpenTagHandler = (name: string, props: {[id:string]:string}) => void;


/**
   @name OnCloseTagHandler
   @function

   @arg {string} name
   @return {void}
 */
type OnCloseTagHandler = (name: string) => void;


/**
   @name OnTextHandler
   @function

   @arg {string} text
   @return {void}
 */
type OnTextHandler = (text: string) => void;


/**
   Handlers for {@link genericParseHTML} function.
   @name GenericParseHTMLHandlers

   @prop {OnOpenTagHandler} onOpenTag - called for each open tag being successfully parsed.
   @prop {OnCloseTagHandler} onCloseTag - called for each close tag being successfully parsed.
   @prop {OnTextHandler} onText - called for each text element being parsed.
 */
interface GenericParseHTMLHandlers {
  onOpenTag:  OnOpenTagHandler
, onCloseTag: OnCloseTagHandler
, onText:     OnTextHandler
}


/**
   Options for {@link genericParseHTML} function.
   @name GenericParseHTMLOptions

   @prop {bool} allowSyntaxErrors - tolerate syntax errors.
   @prop {bool} allowCData - tolerate CDATA tags in the text.
   @prop {bool} allowIETags - tolerate IE-spacific tags in the text.
   @prop {bool} allowXMLDeclarations - tolerate XML.
 */
interface GenericParseHTMLOptions {
  allowSyntaxErrors?:    bool
, allowCData?:           bool
, allowIETags?:          bool
, allowXMLDeclarations?: bool
}

type HTMLParser = (s: string) => (void|Error);

/** Parse given HTML text using event-based approach.

   @return {(void|Error)}
*/
const genericParseHTML = (
  handlers: GenericParseHTMLHandlers
, options?: GenericParseHTMLOptions
):HTMLParser => (s:string) => {

  const len = s.length;
  const {onOpenTag, onCloseTag, onText} = handlers;

  const opt = (null != options) ? options : {};
  const allowSyntaxErrors    = coalesce(opt.allowSyntaxErrors,    false);
  const allowCData           = coalesce(opt.allowCData,           false);
  const allowIETags          = coalesce(opt.allowIETags,          false);
  const allowXMLDeclarations = coalesce(opt.allowXMLDeclarations, false);

  var pos = 0;

  var _sel_begin = 0;
  var _sel_end = 0;

  var error = null;

  const getPosition = p => {
    var s1 = s.substring(0, p);
    var line = 1 + (s1.match(/\n/g) || []).length;
    var m = s1.match(/[^\n]*$/);
    var s2 = (null != m) ? m[0] : '';
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


  const readProps = ():({[id:string]: string}|void) => {
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
        if (allowSyntaxErrors) {
          if ((CODE_SLASH == s.charCodeAt(pos) && CODE_GT == s.charCodeAt(pos + 1))
           || (CODE_GT == s.charCodeAt(pos))) {
            break;
          }
          else {
            NEXT_CHAR;
          }
        }
        else {
          break;
        }
      }
    }

    return result;
  };

  const readOpenTag = (tagName) => {

    if (undefined === tagName && allowSyntaxErrors) {
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

    if (allowIETags && CODE_BANG == name.charCodeAt(0)) {
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

    if (null != props) {
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
    }
  };

  const readCloseTag = (tagName) => {

    if (undefined === tagName && allowSyntaxErrors) {
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

    var checkEnding = (allowIETags && CODE_BANG == name.charCodeAt(0))
      ? () => tryString(']>')
      : () => TRY_CHAR(CODE_GT);

    SKIP_WHILE(IS_SPACE(CURRENT_CHAR));

    while (HAS_INPUT && !checkEnding()) {
      if (!allowSyntaxErrors) {
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
    if (allowSyntaxErrors) {
      SKIP_WHILE(IS_SPACE(CURRENT_CHAR));
    }

    if (!tryString('xml')) {
      return setError('readXMLDeclaration', 'not an XML declaration');
    }

    var props = readProps();

    if (null != props) {
      if (!((!allowSyntaxErrors && tryString('?>')) || tryString('>'))) {
        return setError('readXMLDeclaration', 'unexpected end of the declaration');
      }

      onOpenTag('?xml', props);
      onCloseTag('?xml');
    }
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

    if (allowSyntaxErrors) {
      if (TRY_CHAR(CODE_GT)) {
        // do nothing
      }
    }

    if (TRY_CHAR(CODE_LT)) {
      if (allowSyntaxErrors && CODE_LT == s.charCodeAt(pos)) {
        // do nothing
      }
      else if (allowXMLDeclarations && TRY_CHAR(CODE_QUESTION)) {
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
          if (allowCData && tryString('CDATA[')) {
            readCDATA();
          }
          else if (allowIETags) {
            if (tryString('if')) {
              readOpenTag('!if');
            }
            else if (tryString('endif')) {
              readCloseTag('!if');
            }
          }
        }
        else if (allowSyntaxErrors && READ_CHAR(IS_SPACE(CURRENT_CHAR))) {
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
};


/**
   Options for {@link parseHTML} function.
   @name ParseHTMLOptions

   @prop {bool} allowMismatchedTags - Ignore mismatched tags.
   @prop {bool} ignoreTopLevelText - Do not include top-level text nodes into result.
 */
interface ParseHTMLOptions extends GenericParseHTMLOptions {
    allowMismatchedTags?: bool
  , ignoreTopLevelText?:  bool
  }

/** Parse given HTML text into ready-to-consume structure.
   See also {@link genericParseHTML} for additional options.

   @arg {string} s - HTML text to parse.
   @return {(Object|Error)}
*/
const parseHTML = (s: string, options?: ParseHTMLOptions) => {

  const opt = (null != options) ? options : {};

  const allowMismatchedTags = coalesce(opt.allowMismatchedTags, false);
  const ignoreTopLevelText  = coalesce(opt.ignoreTopLevelText, false);

  var result = [];
  var stack = [];
  var node = null;
  var error = null;

  const setError = (fname, message) => {
    error = new Error(fname + ' failed: ' + message);
  };

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
      if (!allowMismatchedTags && node.name != name) {
        setError('onCloseTag', 'tag names are mismatched: (' + node.name + ', ' + name + ')');
      }

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
      if (!allowMismatchedTags) {
        setError('onCloseTag', 'close tag without pair');
      }
    }
  };

  var onText = text => {
    if (null != node) {
      node.children.push(text);
    }
    else {
      if (!ignoreTopLevelText) {
        result.push(text);
      }
    }
  };

  if (null !== error) {
    return error;
  }

  var output = genericParseHTML({onOpenTag, onCloseTag, onText}, options)(s);
  if (output instanceof Error) {
    return output;
  }

  return result;
};

export {genericParseHTML, parseHTML};

