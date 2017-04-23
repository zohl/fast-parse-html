# fast-parse-html

[![Build Status](https://travis-ci.org/zohl/fast-parse-html.svg?branch=master)](https://travis-ci.org/zohl/fast-parse-html)

## Description
Lightweight platform-independent forgiving html parser

## Status
The library is under heavy development. Many things haven't been implemented yet.

## Example
```javascript
import {parseHTML} from 'fast-parse-html';

var result = parseHTML('<div><p>foo</p><p>bar</p></div>');
// yields:
// {name: 'div', props: {}, children: [
//   {name: 'p', props: {}, children: ['foo']}
// , {name: 'p', props: {}, children: ['bar']}]}

```

## See also
- [[Documentation](./API.md)]
- [[Changelog](./CHANGELOG.md)]
