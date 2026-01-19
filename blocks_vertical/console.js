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

goog.provide('Blockly.Blocks.console');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');

Blockly.Blocks['console_clear'] = {
  /**
   * Block to clear console.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.CONSOLE_CLEAR,
      "category": Blockly.Categories.console,
      "extensions": ["colours_console", "shape_statement"]
    });
  }
};

Blockly.Blocks['console_addline'] = {
  /**
   * Block to add line in console.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.CONSOLE_ADDLINE,
      "args0": [
        {
          "type": "input_value",
          "name": "LINE"
        }
      ],
      "category": Blockly.Categories.console,
      "extensions": ["colours_console", "shape_statement"]
    });
  }
};

Blockly.Blocks['console_addlineandmove'] = {
  /**
   * Block to add line in console and move cursor.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.CONSOLE_ADDLINEANDMOVE,
      "args0": [
        {
          "type": "input_value",
          "name": "LINE"
        }
      ],
      "category": Blockly.Categories.console,
      "extensions": ["colours_console", "shape_statement"]
    });
  }
};

Blockly.Blocks['console_editline'] = {
  /**
   * Block to edit line in console.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.CONSOLE_EDITLINE,
      "args0": [
        {
          "type": "input_value",
          "name": "LINE"
        }
      ],
      "category": Blockly.Categories.console,
      "extensions": ["colours_console", "shape_statement"]
    });
  }
};

Blockly.Blocks['console_editsymbol'] = {
  /**
   * Block to edit symbol in console.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.CONSOLE_EDITSYMBOL,
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "category": Blockly.Categories.console,
      "extensions": ["colours_console", "shape_statement"]
    });
  }
};

Blockly.Blocks['console_movecursor'] = {
  /**
   * Block to move cursor.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.CONSOLE_MOVECURSOR,
      "args0": [
        {
          "type": "input_value",
          "name": "ROW"
        },
        {
          "type": "input_value",
          "name": "SYMBOL"
        }
      ],
      "category": Blockly.Categories.console,
      "extensions": ["colours_console", "shape_statement"]
    });
  }
};

Blockly.Blocks['console_of'] = {
  /**
   * Block to report properties of console.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.CONSOLE_OF,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "PROPERTY",
          "options": [
            [Blockly.Msg.CONSOLE_OF_CONTENT, 'content'],
            [Blockly.Msg.CONSOLE_OF_LINESCOUNT, 'linescount'],
            [Blockly.Msg.CONSOLE_OF_SYMBOLS, 'symbols'],
          ]
        },
      ],
      "output": null,
      "category": Blockly.Categories.console,
      "extensions": ["colours_console", "shape_round"]
    });
  }
};
