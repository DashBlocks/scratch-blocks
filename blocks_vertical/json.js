/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2016 Massachusetts Institute of Technology
 * All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

goog.provide('Blockly.Blocks.json');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');

Blockly.Blocks['json_array_item_of'] = {
    /**
     * Block for getting an item from an array.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_ARRAY_ITEMOF,
            "args0": [
                {
                    "type": "input_value",
                    "name": "INDEX"
                },
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": "Array"
                }
            ],
            "output": null,
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "shape_round"]
        });
    }
};

Blockly.Blocks['json_array_item_no_of'] = {
    /**
     * Block for getting the index of an item in an array.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_ARRAY_ITEMNOOF,
            "args0": [
                {
                    "type": "input_value",
                    "name": "VALUE"
                },
                {
                    "type": "input_value",
                    "name": "ARRAY",
                    "check": "Array"
                }
            ],
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_number"]
        });
    }
};

Blockly.Blocks['json_contains'] = {
    /**
     * Block for checking if a list or object contains a value.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_CONTAINS,
            "args0": [
                {
                    "type": "input_value",
                    "name": "JSON",
                    "check": ["Array", "Object"]
                },
                {
                    "type": "input_value",
                    "name": "VALUE"
                }
            ],
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_boolean"]
        });
    }
};

Blockly.Blocks['json_length'] = {
    /**
     * Block for getting the length of a list or object.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_LENGTH,
            "args0": [
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": ["Array", "Object"]
                }
            ],
            "output": "Number",
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_number"]
        });
    }
};

Blockly.Blocks['json_array_empty'] = {
    /**
     * Block for creating an empty list.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_ARRAY_EMPTY,
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_array"]
        });
    }
};

Blockly.Blocks['json_array_split'] = {
    /**
     * Block for creating a list from a text.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_ARRAY_SPLIT,
            "args0": [
                {
                    "type": "input_value",
                    "name": "TEXT",
                },
                {
                    "type": "input_value",
                    "name": "DELIM"
                }
            ],
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_array"]
        });
    }
};

Blockly.Blocks['json_array_in_front_of'] = {
    /**
     * Block for reporting a list with an item added to the top.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_ARRAY_INFRONTOF,
            "args0": [
                {
                    "type": "input_value",
                    "name": "ITEM"
                },
                {
                    "type": "input_value",
                    "name": "ARRAY",
                    "check": "Array"
                }
            ],
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_array"]
        });
    }
};

Blockly.Blocks['json_array_behind'] = {
    /**
     * Block for reporting a list with an item added to the bottom.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_ARRAY_BEHIND,
            "args0": [
                {
                    "type": "input_value",
                    "name": "ITEM"
                },
                {
                    "type": "input_value",
                    "name": "ARRAY",
                    "check": "Array"
                }
            ],
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_array"]
        });
    }
};

Blockly.Blocks['json_array_at'] = {
    /**
     * Block for reporting a list with an item at a specific position.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_ARRAY_AT,
            "args0": [
                {
                    "type": "input_value",
                    "name": "ITEM"
                },
                {
                    "type": "input_value",
                    "name": "INDEX"
                },
                {
                    "type": "input_value",
                    "name": "ARRAY",
                    "check": "Array"
                }
            ],
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_array"]
        });
    }
};

Blockly.Blocks['json_array_delete'] = {
    /**
     * Block for reporting a list with an item deleted.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_ARRAY_DELETE,
            "args0": [
                {
                    "type": "input_value",
                    "name": "INDEX"
                },
                {
                    "type": "input_value",
                    "name": "ARRAY",
                    "check": "Array"
                }
            ],
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_array"]
        });
    }
};

Blockly.Blocks['json_array_replace'] = {
    /**
     * Block for reporting a list with an item replaced.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_ARRAY_REPLACE,
            "args0": [
                {
                    "type": "input_value",
                    "name": "INDEX"
                },
                {
                    "type": "input_value",
                    "name": "ARRAY",
                    "check": "Array"
                },
                {
                    "type": "input_value",
                    "name": "ITEM"
                }
            ],
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_array"]
        });
    }
};

Blockly.Blocks['json_object_empty'] = {
    /**
     * Block for creating an empty object.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_OBJECT_EMPTY,
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_object"]
        });
    }
};

Blockly.Blocks['json_object_split'] = {
    /**
     * Block for creating an object from a text.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_OBJECT_SPLIT,
            "args0": [
                {
                    "type": "input_value",
                    "name": "TEXT",
                },
                {
                    "type": "input_value",
                    "name": "KEYDELIM"
                },
                {
                    "type": "input_value",
                    "name": "PAIRDELIM"
                }
            ],
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_object"]
        });
    }
};

Blockly.Blocks['json_object_item_of'] = {
    /**
     * Block for getting an item from an object.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_OBJECT_ITEMOF,
            "args0": [
                {
                    "type": "input_value",
                    "name": "KEY"
                },
                {
                    "type": "input_value",
                    "name": "VALUE",
                    "check": "Object"
                }
            ],
            "output": null,
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "shape_round"]
        });
    }
};

Blockly.Blocks['json_object_contains_key'] = {
    /**
     * Block for checking if an object contains a key.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_OBJECT_CONTAINS_KEY,
            "args0": [
                {
                    "type": "input_value",
                    "name": "OBJECT",
                    "check": "Object"
                },
                {
                    "type": "input_value",
                    "name": "KEY"
                }
            ],
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_boolean"]
        });
    }
};

Blockly.Blocks['json_object_set'] = {
    /**
     * Block for reporting an object with a key setted to item.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_OBJECT_SET,
            "args0": [
                {
                    "type": "input_value",
                    "name": "KEY"
                },
                {
                    "type": "input_value",
                    "name": "ITEM"
                },
                {
                    "type": "input_value",
                    "name": "OBJECT",
                    "check": "Object"
                }
            ],
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_object"]
        });
    }
};

Blockly.Blocks['json_object_delete'] = {
    /**
     * Block for reporting an object with a key deleted.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_OBJECT_DELETE,
            "args0": [
                {
                    "type": "input_value",
                    "name": "KEY"
                },
                {
                    "type": "input_value",
                    "name": "OBJECT",
                    "check": "Object"
                }
            ],
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_object"]
        });
    }
};

Blockly.Blocks['json_object_entries'] = {
    /**
     * Block for reporting entries, keys or values of object.
     * @this Blockly.Block
     */
    init: function () {
        this.jsonInit({
            "message0": Blockly.Msg.JSON_OBJECT_ENTRIES,
            "args0": [
                {
                    "type": "field_dropdown",
                    "name": "PROPERTY",
                    "options": [
                        [Blockly.Msg.JSON_OBJECT_ENTRIES_ENTRIES, 'entries'],
                        [Blockly.Msg.JSON_OBJECT_ENTRIES_KEYS, 'keys'],
                        [Blockly.Msg.JSON_OBJECT_ENTRIES_VALUES, 'values']
                    ]
                },
                {
                    "type": "input_value",
                    "name": "OBJECT",
                    "check": "Object"
                }
            ],
            "category": Blockly.Categories.json,
            "extensions": ["colours_json", "output_array"]
        });
    }
};
