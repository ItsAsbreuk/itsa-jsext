[![Build Status](https://travis-ci.org/ItsAsbreuk/itsa-jsext.svg?branch=master)](https://travis-ci.org/ItsAsbreuk/itsa-jsext)

[![browser support](https://ci.testling.com/ItsAsbreuk/itsa-jsext.png)](https://ci.testling.com/ItsAsbreuk/itsa-jsext)

Extensions to native javascript-objects, all within the "itsa_" namespace

## How to use:

```js
// ES5:
require("itsa-jsext");

// ES6:
import "itsa-jsext";
```

[API](http://projects.itsasbreuk.nl/modules/itsa-jsext/api/)

####example
```js
"use strict";

import "itsa-jsext";

const obj1 = {
    par1: 10,
    par2: [
        'hi',
        {
            par2_1: 1,
            par2_2: 2
        }
    ];
    par3: {
        par3_1: 1,
        par3_2: 2
    }
};

const obj2 = obj1.itsa_deepClone(); // deepcloning obj1 into obj2
```