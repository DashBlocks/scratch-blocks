/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
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

goog.provide('Blockly.Blocks.operators');

goog.require('Blockly.Blocks');
goog.require('Blockly.Colours');
goog.require('Blockly.constants');
goog.require('Blockly.ScratchBlocks.VerticalExtensions');


Blockly.Blocks['operator_add'] = {
  /**
   * Block for adding two numbers.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_ADD,
      "args0": [
        {
          "type": "input_value",
          "name": "NUM1"
        },
        {
          "type": "input_value",
          "name": "NUM2"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_number"]
    });
  }
};

Blockly.Blocks['operator_subtract'] = {
  /**
   * Block for subtracting two numbers.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_SUBTRACT,
      "args0": [
        {
          "type": "input_value",
          "name": "NUM1"
        },
        {
          "type": "input_value",
          "name": "NUM2"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_number"]
    });
  }
};

Blockly.Blocks['operator_multiply'] = {
  /**
   * Block for multiplying two numbers.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_MULTIPLY,
      "args0": [
        {
          "type": "input_value",
          "name": "NUM1"
        },
        {
          "type": "input_value",
          "name": "NUM2"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_number"]
    });
  }
};

Blockly.Blocks['operator_divide'] = {
  /**
   * Block for dividing two numbers.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_DIVIDE,
      "args0": [
        {
          "type": "input_value",
          "name": "NUM1"
        },
        {
          "type": "input_value",
          "name": "NUM2"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_number"]
    });
  }
};

Blockly.Blocks['operator_mathexpandable'] = {
  /**
   * Block to caculate numbers
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": '%1 %2',
      "args0": [
        {
          "type": "field_expandable_remove",
          "name": "REMOVE"
        },
        {
          "type": "field_expandable_add",
          "name": "ADD"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_number"]
    });

    this.inputs_ = 0;
  },

  fillInBlock: Blockly.scratchBlocksUtils.generateMutatorShadow,
  menuGenerator: function () {
    const dropdown = new Blockly.FieldDropdown(function () {
      return [
        ["+", "+"], ["-", "-"],
        ["*", "*"], ["/", "/"],
        ["^", "^"],
      ];
    });
    const ogSetValue = dropdown.setValue;
    dropdown.setValue = function (value, omitMutation) {
      const srcBlock = this.sourceBlock_;
      let oldMutation;
      if (!omitMutation) oldMutation = Blockly.Xml.domToText(srcBlock.mutationToDom());

      ogSetValue.call(this, value);
      if (!omitMutation) {
        const newMutation = Blockly.Xml.domToText(srcBlock.mutationToDom());
        Blockly.Events.fire(new Blockly.Events.BlockChange(
          srcBlock, 'mutation', null, oldMutation, newMutation
        ));
      }
    }
    return dropdown;
  },

  mutationToDom: function () {
    const container = document.createElement("mutation");
    container.setAttribute("inputcount", String(this.inputs_));
    let orderedOperations = "";
    for (var i = 1; i < this.inputList.length; i++) {
      const input = this.inputList[i];
      if (input.fieldRow[0]) orderedOperations += input.fieldRow[0].getValue();
    }
    container.setAttribute("menuvalues", orderedOperations);
    return container;
  },
  domToMutation: function (xmlElement) {
    const inputCount = Number(xmlElement.getAttribute("inputcount"));
    const menuValues = String(xmlElement.getAttribute("menuvalues"));
    this.inputs_ = isNaN(inputCount) ? 0 : inputCount;

    let repeatPreventer = false;
    if (this.inputList.length > 1) {
      // This was a control Z action
      if (this.inputList.length - 1 === menuValues.length) repeatPreventer = true;
      else {
        const lastInput = this.inputList[this.inputList.length - 1];
        const innerBlock = lastInput.connection.targetBlock();
        if (innerBlock.isShadow()) innerBlock.dispose();
        this.removeInput(lastInput.name);
        return;
      }
    }

    for (let i = 0; i < this.inputs_; i++) {
      if (repeatPreventer && this.getInput(`NUM${i + 1}`)) continue;

      const input = this.appendValueInput(`NUM${i + 1}`);
      if (i > 0) {
        const menu = input.appendField(this.menuGenerator());
        menu.fieldRow[0].setValue(menuValues[i - 1] ? menuValues[i - 1] : "+", true);
      }
    }
  },

  onExpandableButtonClicked_: function (isAdding) {
    // Create an event group to keep field value and mutator in sync
    // Return null at the end because setValue is called here already.
    Blockly.Events.setGroup(true);
    var oldMutation = Blockly.Xml.domToText(this.mutationToDom());
    if (isAdding) {
      this.inputs_++;
      const number = this.inputs_;
      const newInput = this.appendValueInput(`NUM${number}`);
      newInput.appendField(this.menuGenerator());
      this.fillInBlock(newInput.connection, "math_number");
    } else if (this.inputs_ > 1) {
      const number = this.inputs_;
      this.removeInput(`NUM${number}`);
      this.inputs_--;
    }
    this.initSvg();
    if (this.rendered) this.render();

    const newMutation = Blockly.Xml.domToText(this.mutationToDom());
    Blockly.Events.fire(new Blockly.Events.BlockChange(
      this, 'mutation', null, oldMutation, newMutation
    ));
    Blockly.Events.setGroup(false);
  }
};

Blockly.Blocks['operator_random'] = {
  /**
   * Block for picking a random number.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_RANDOM,
      "args0": [
        {
          "type": "input_value",
          "name": "FROM"
        },
        {
          "type": "input_value",
          "name": "TO"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_number"]
    });
  }
};

Blockly.Blocks['operator_lt'] = {
  /**
   * Block for less than comparator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_LT,
      "args0": [
        {
          "type": "input_value",
          "name": "OPERAND1"
        },
        {
          "type": "input_value",
          "name": "OPERAND2"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  }
};

Blockly.Blocks['operator_equals'] = {
  /**
   * Block for equals comparator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_EQUALS,
      "args0": [
        {
          "type": "input_value",
          "name": "OPERAND1"
        },
        {
          "type": "input_value",
          "name": "OPERAND2"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  }
};

Blockly.Blocks['operator_gt'] = {
  /**
   * Block for greater than comparator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_GT,
      "args0": [
        {
          "type": "input_value",
          "name": "OPERAND1"
        },
        {
          "type": "input_value",
          "name": "OPERAND2"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  }
};

Blockly.Blocks['operator_and'] = {
  /**
   * Block for "and" boolean comparator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_AND,
      "args0": [
        {
          "type": "input_value",
          "name": "OPERAND1",
          "check": "Boolean"
        },
        {
          "type": "input_value",
          "name": "OPERAND2",
          "check": "Boolean"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  }
};

Blockly.Blocks['operator_or'] = {
  /**
   * Block for "or" boolean comparator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_OR,
      "args0": [
        {
          "type": "input_value",
          "name": "OPERAND1",
          "check": "Boolean"
        },
        {
          "type": "input_value",
          "name": "OPERAND2",
          "check": "Boolean"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  }
};

Blockly.Blocks['operator_comparatorexpandable'] = {
  /**
   * Block to comparate conditions.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": '%1 %2',
      "args0": [
        {
          "type": "field_expandable_remove",
          "name": "REMOVE"
        },
        {
          "type": "field_expandable_add",
          "name": "ADD"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });

    this.inputs_ = 0;
  },

  fillInBlock: Blockly.scratchBlocksUtils.generateMutatorShadow,
  menuGenerator: function () {
    const dropdown = new Blockly.FieldDropdown(function () {
      return [
        ["=", "="], [">", ">"],
        ["<", "<"], ["and", "&"],
        ["or", "|"]
      ];
    });
    const ogSetValue = dropdown.setValue;
    dropdown.setValue = function (value, omitMutation) {
      const srcBlock = this.sourceBlock_;
      let oldMutation;
      if (!omitMutation) oldMutation = Blockly.Xml.domToText(srcBlock.mutationToDom());

      ogSetValue.call(this, value);
      if (!omitMutation) {
        const newMutation = Blockly.Xml.domToText(srcBlock.mutationToDom());
        Blockly.Events.fire(new Blockly.Events.BlockChange(
          srcBlock, 'mutation', null, oldMutation, newMutation
        ));
      }
    }
    return dropdown;
  },

  mutationToDom: function () {
    const container = document.createElement("mutation");
    container.setAttribute("inputcount", String(this.inputs_));
    let orderedOperations = "";
    for (var i = 1; i < this.inputList.length; i++) {
      const input = this.inputList[i];
      if (input.fieldRow[0]) orderedOperations += input.fieldRow[0].getValue();
    }
    container.setAttribute("menuvalues", orderedOperations);
    return container;
  },
  domToMutation: function (xmlElement) {
    const inputCount = Number(xmlElement.getAttribute("inputcount"));
    const menuValues = String(xmlElement.getAttribute("menuvalues"));
    this.inputs_ = isNaN(inputCount) ? 0 : inputCount;

    let repeatPreventer = false;
    if (this.inputList.length > 1) {
      // This was a control Z action
      if (this.inputList.length - 1 === menuValues.length) repeatPreventer = true;
      else {
        const lastInput = this.inputList[this.inputList.length - 1];
        const innerBlock = lastInput.connection.targetBlock();
        if (innerBlock.isShadow()) innerBlock.dispose();
        this.removeInput(lastInput.name);
        return;
      }
    }

    for (let i = 0; i < this.inputs_; i++) {
      if (repeatPreventer && this.getInput(`BOOL${i + 1}`)) continue;
      const input = this.appendValueInput(`BOOL${i + 1}`).setCheck('Boolean');
      if (i > 0) {
        const menu = input.appendField(this.menuGenerator());
        menu.fieldRow[0].setValue(menuValues[i - 1] ? menuValues[i - 1] : "=", true);
      }
    }
  },

  onExpandableButtonClicked_: function (isAdding) {
    // Create an event group to keep field value and mutator in sync
    // Return null at the end because setValue is called here already.
    Blockly.Events.setGroup(true);
    var oldMutation = Blockly.Xml.domToText(this.mutationToDom());
    if (isAdding) {
      this.inputs_++;
      const number = this.inputs_;
      const newInput = this.appendValueInput(`BOOL${number}`).setCheck('Boolean');
      newInput.appendField(this.menuGenerator());
    } else if (this.inputs_ > 1) {
      const number = this.inputs_;
      this.removeInput(`BOOL${number}`);
      this.inputs_--;
    }
    this.initSvg();
    if (this.rendered) this.render();

    const newMutation = Blockly.Xml.domToText(this.mutationToDom());
    Blockly.Events.fire(new Blockly.Events.BlockChange(
      this, 'mutation', null, oldMutation, newMutation
    ));
    Blockly.Events.setGroup(false);
  }
};

Blockly.Blocks['operator_not'] = {
  /**
   * Block for "not" unary boolean operator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_NOT,
      "args0": [
        {
          "type": "input_value",
          "name": "OPERAND",
          "check": "Boolean"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  }
};

Blockly.Blocks['operator_join'] = {
  /**
   * Block for string join operator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_JOIN,
      "args0": [
        {
          "type": "input_value",
          "name": "STRING1"
        },
        {
          "type": "input_value",
          "name": "STRING2"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_string"]
    });
  }
};

Blockly.Blocks['operator_joinexpandable'] = {
  /**
   * Block for joining N strings together.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_JOIN,
      "args0": [
        {
          "type": "field_expandable_remove",
          "name": "REMOVE"
        },
        {
          "type": "field_expandable_add",
          "name": "ADD"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_string"]
    });
    this.messageList = ["apple ", "banana ", "pear ", "orange ", "mango ", "strawberry ", "pineapple ", "grape ", "kiwi "];
    this.inputs_ = 0;
  },

  fillInBlock: Blockly.scratchBlocksUtils.generateMutatorShadow,

  mutationToDom: function() {
    const container = document.createElement("mutation");
    container.setAttribute("inputcount", String(this.inputs_));
    return container;
  },
  domToMutation: function(xmlElement) {
    const inputCount = Number(xmlElement.getAttribute("inputcount"));
    if (this.inputList.length > 1) {
      // This was a control Z action
      if (this.inputs_ > inputCount) {
        const lastInput = this.inputList[this.inputList.length - 1];
        const innerBlock = lastInput.connection.targetBlock();
        if (innerBlock.isShadow()) innerBlock.dispose();
        this.removeInput(lastInput.name);
      }
    }

    this.inputs_ = isNaN(inputCount) ? 0 : inputCount;
    for (let i = 0; i < this.inputs_; i++) {
      // VM will automatically replace empty inputs with saved shadows
      if (!this.getInput(`INPUT${i + 1}`)) this.appendValueInput(`INPUT${i + 1}`);
    }
  },

  onExpandableButtonClicked_: function (isAdding) {
    // Create an event group to keep field value and mutator in sync
    // Return null at the end because setValue is called here already.
    Blockly.Events.setGroup(true);
    var oldMutation = Blockly.Xml.domToText(this.mutationToDom());
    if (isAdding) {
      this.inputs_++;
      const number = this.inputs_;
      const newInput = this.appendValueInput(`INPUT${number}`);
      const text = this.messageList[number - 1];
      this.fillInBlock(newInput.connection, "text",  text ? text : "... ", "TEXT");
    } else if (this.inputs_ > 1) {
      this.removeInput(`INPUT${this.inputs_}`);
      this.inputs_--;
    }
    this.initSvg();
    if (this.rendered) this.render();

    var newMutation = Blockly.Xml.domToText(this.mutationToDom());
    Blockly.Events.fire(new Blockly.Events.BlockChange(
      this, 'mutation', null, oldMutation, newMutation
    ));
    Blockly.Events.setGroup(false);
  }
};

Blockly.Blocks['operator_newline'] = {
  /**
   * Block for newline.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_NEWLINE,
      "args0": [
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_number"]
    });
  }
};

Blockly.Blocks['operator_letter_of'] = {
  /**
   * Block for "letter _ of _" operator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_LETTEROF,
      "args0": [
        {
          "type": "input_value",
          "name": "LETTER"
        },
        {
          "type": "input_value",
          "name": "STRING"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_string"]
    });
  }
};

Blockly.Blocks['operator_length'] = {
  /**
   * Block for string length operator.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_LENGTH,
      "args0": [
        {
          "type": "input_value",
          "name": "STRING"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_string"]
    });
  }
};

Blockly.Blocks['operator_contains'] = {
  /**
   * Block for _ contains _ operator
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_CONTAINS,
      "args0": [
        {
          "type": "input_value",
          "name": "STRING1"
        },
        {
          "type": "input_value",
          "name": "STRING2"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  }
};

Blockly.Blocks['operator_se_with'] = {
  /**
   * Block for _ [starts/ends v] with _ operator
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_SE_WITH,
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE1"
        },
        {
          "type": "field_dropdown",
          "name": "TYPE",
          "options": [
            [Blockly.Msg.OPERATORS_SE_WITH_STARTS, 'starts'],
            [Blockly.Msg.OPERATORS_SE_WITH_ENDS, 'ends']
          ]
        },
        {
          "type": "input_value",
          "name": "VALUE2"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  }
};

Blockly.Blocks['operator_typeof'] = {
  /**
   * Block for type of _ operator
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_TYPEOF,
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "output": null,
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "shape_round"]
    });
  }
};

Blockly.Blocks['operator_is_type'] = {
  /**
   * Block for _ is (string v)?
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_ISTYPE,
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE"
        },
        {
          "type": "field_dropdown",
          "name": "TYPE",
          "options": [
            [Blockly.Msg.OPERATORS_CAST_STRING, 'string'],
            [Blockly.Msg.OPERATORS_CAST_NUMBER, 'number'],
            [Blockly.Msg.OPERATORS_CAST_BOOLEAN, 'boolean'],
            [Blockly.Msg.OPERATORS_CAST_ARRAY, 'array'],
            [Blockly.Msg.OPERATORS_CAST_OBJECT, 'object'],
            [Blockly.Msg.OPERATORS_ISTYPE_CUSTOMTYPE, 'custom type']
          ]
        },
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  }
};

Blockly.Blocks['operator_is_string'] = {
  /**
   * Block for _ string? operator
   * Legacy block
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_ISSTRING,
      "args0": [
        {
          "type": "input_value",
          "name": "STRING"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  }
};

Blockly.Blocks['operator_is_number'] = {
  /**
   * Block for _ number? operator
   * Legacy block
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_ISNUMBER,
      "args0": [
        {
          "type": "input_value",
          "name": "NUM"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  }
};

Blockly.Blocks['operator_cast'] = {
  /**
   * Block for cast value to specific type
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_CAST,
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE"
        },
        {
          "type": "field_dropdown",
          "name": "TYPE",
          "options": [
            [Blockly.Msg.OPERATORS_CAST_STRING, 'string'],
            [Blockly.Msg.OPERATORS_CAST_NUMBER, 'number'],
            [Blockly.Msg.OPERATORS_CAST_BOOLEAN, 'boolean'],
            [Blockly.Msg.OPERATORS_CAST_ARRAY, 'array'],
            [Blockly.Msg.OPERATORS_CAST_OBJECT, 'object']
          ]
        },
      ],
      "output": null,
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "shape_round"]
    });
  }
};

Blockly.Blocks['operator_to_case'] = {
  /**
   * Block to convert value into specific case
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_TOCASE,
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE"
        },
        {
          "type": "field_dropdown",
          "name": "CASE",
          "options": [
            [Blockly.Msg.OPERATORS_TOCASE_UPPER, 'upper'],
            [Blockly.Msg.OPERATORS_TOCASE_LOWER, 'lower']
          ]
        },
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_string"]
    });
  }
};

Blockly.Blocks['operator_nums_in_range'] = {
  /**
   * Block for reporting all numbers in range from to.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_NUMSINRANGE,
      "args0": [
        {
          "type": "input_value",
          "name": "FROM"
        },
        {
          "type": "input_value",
          "name": "TO"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_array"]
    });
  }
};

Blockly.Blocks['operator_in_range'] = {
  /**
   * Block for is input in range from to.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_INRANGE,
      "args0": [
        {
          "type": "input_value",
          "name": "NUM"
        },
        {
          "type": "input_value",
          "name": "FROM"
        },
        {
          "type": "input_value",
          "name": "TO"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  }
};

Blockly.Blocks['operator_mod'] = {
  /**
   * Block for mod two numbers.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_MOD,
      "args0": [
        {
          "type": "input_value",
          "name": "NUM1"
        },
        {
          "type": "input_value",
          "name": "NUM2"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_number"]
    });
  }
};

Blockly.Blocks['operator_round'] = {
  /**
   * Block for rounding a numbers.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_ROUND,
      "args0": [
        {
          "type": "input_value",
          "name": "NUM"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_number"]
    });
  }
};

Blockly.Blocks['operator_mathop'] = {
  /**
   * Block for "advanced" math ops on a number.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.OPERATORS_MATHOP,
      "args0": [
        {
          "type": "field_dropdown",
          "name": "OPERATOR",
          "options": [
            [Blockly.Msg.OPERATORS_MATHOP_ABS, 'abs'],
            [Blockly.Msg.OPERATORS_MATHOP_FLOOR, 'floor'],
            [Blockly.Msg.OPERATORS_MATHOP_CEILING, 'ceiling'],
            [Blockly.Msg.OPERATORS_MATHOP_SQRT, 'sqrt'],
            [Blockly.Msg.OPERATORS_MATHOP_SIN, 'sin'],
            [Blockly.Msg.OPERATORS_MATHOP_COS, 'cos'],
            [Blockly.Msg.OPERATORS_MATHOP_TAN, 'tan'],
            [Blockly.Msg.OPERATORS_MATHOP_ASIN, 'asin'],
            [Blockly.Msg.OPERATORS_MATHOP_ACOS, 'acos'],
            [Blockly.Msg.OPERATORS_MATHOP_ATAN, 'atan'],
            [Blockly.Msg.OPERATORS_MATHOP_LN, 'ln'],
            [Blockly.Msg.OPERATORS_MATHOP_LOG, 'log'],
            [Blockly.Msg.OPERATORS_MATHOP_EEXP, 'e ^'],
            [Blockly.Msg.OPERATORS_MATHOP_10EXP, '10 ^']
          ]
        },
        {
          "type": "input_value",
          "name": "NUM"
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_number"]
    });
  }
};
