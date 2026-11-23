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

Blockly.Blocks['operator_math_expandable'] = {
  /**
   * Block to caculate numbers.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": '%1',
      "args0": [
        {
          "type": "field_expandable",
          "name": "EXPANDABLE",
          "value": 2
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_number"]
    });
  },

  expandableCallback: function (field, oldValue, newValue, createShadows) {
    if (oldValue < newValue) {
      for (let i = oldValue; i < newValue; i++) {
        var type = createShadows ? 'math_number' : null;
        var { input, shadow } = Blockly.scratchBlocksUtils.newBlockParam(this, 'NUM' + (i + 1), type, ['NUM', i + 1]);

        if (i > 0) {
          input.appendField(new Blockly.FieldDropdown([
            ['+', '+'],
            ['-', '-'],
            ['*', '*'],
            ['/', '/'],
            ['^', '**']
          ]), 'OP' + (i + 1));
          Blockly.Events.fire(new Blockly.Events.BlockChange(this, 'field', 'OP' + (i + 1), '-', '+')); // tell vm it updated
        }
      }
    } else {
      for (let i = newValue; i < oldValue; i++) {
        this.removeInput('NUM' + (i + 1));
      }
    }

    this.initSvg();
    if (this.rendered) this.render();
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

Blockly.Blocks['operator_numbers_comparator_expandable'] = {
  /**
   * Block to comparate numbers.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": '%1',
      "args0": [
        {
          "type": "field_expandable",
          "name": "EXPANDABLE",
          "value": 2
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  },

  expandableCallback: function (field, oldValue, newValue, createShadows) {
    if (oldValue < newValue) {
      for (let i = oldValue; i < newValue; i++) {
        var type = createShadows ? 'text' : null;
        var { input, shadow } = Blockly.scratchBlocksUtils.newBlockParam(this, 'STRING' + (i + 1), type);

        if (i > 0) {
          input.appendField(new Blockly.FieldDropdown([
            ['=', '=='],
            ['>', '>'],
            ['<', '<']
          ]), 'OP' + (i + 1));
          Blockly.Events.fire(new Blockly.Events.BlockChange(this, 'field', 'OP' + (i + 1), '>', '==')); // tell vm it updated
        }
      }
    } else {
      for (let i = newValue; i < oldValue; i++) {
        this.removeInput('STRING' + (i + 1));
      }
    }

    this.initSvg();
    if (this.rendered) this.render();
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

Blockly.Blocks['operator_conditions_comparator_expandable'] = {
  /**
   * Block to comparate conditions.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      "message0": '%1',
      "args0": [
        {
          "type": "field_expandable",
          "name": "EXPANDABLE",
          "value": 2
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_boolean"]
    });
  },

  expandableCallback: function (field, oldValue, newValue, createShadows) {
    if (oldValue < newValue) {
      for (let i = oldValue; i < newValue; i++) {
        var { input, shadow } = Blockly.scratchBlocksUtils.newBlockParam(
          this, 'BOOL' + (i + 1), null,
          undefined,
          function(input) {return input.setCheck('Boolean');}
        );

        if (i > 0) {
          input.appendField(new Blockly.FieldDropdown([
            ['=', '=='],
            [Blockly.Msg.OPERATORS_CONDITIONSCOMPARATOREXPANDABLE_AND, '&&'],
            [Blockly.Msg.OPERATORS_CONDITIONSCOMPARATOREXPANDABLE_OR, '||']
          ]), 'OP' + (i + 1));
          Blockly.Events.fire(new Blockly.Events.BlockChange(this, 'field', 'OP' + (i + 1), '&&', '==')); // tell vm it updated
        }
      }
    } else {
      for (let i = newValue; i < oldValue; i++) {
        this.removeInput('BOOL' + (i + 1));
      }
    }

    this.initSvg();
    if (this.rendered) this.render();
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
      "message0": Blockly.Msg.OPERATORS_JOINEXPANDABLE,
      "args0": [
        {
          "type": "field_expandable",
          "name": "EXPANDABLE",
          "value": 2
        }
      ],
      "category": Blockly.Categories.operators,
      "extensions": ["colours_operators", "output_string"]
    });

    this.possibleStrings = [
      Blockly.Msg.OPERATORS_JOIN_APPLE,
      Blockly.Msg.OPERATORS_JOIN_BANANA,
      Blockly.Msg.OPERATORS_JOIN_PEAR,
      Blockly.Msg.OPERATORS_JOIN_ORANGE,
      Blockly.Msg.OPERATORS_JOIN_MANGO,
      Blockly.Msg.OPERATORS_JOIN_STRAWBERRY,
      Blockly.Msg.OPERATORS_JOIN_PINEAPPLE,
      Blockly.Msg.OPERATORS_JOIN_GRAPE,
      Blockly.Msg.OPERATORS_JOIN_KIWI
    ];
  },

  expandableCallback: function (field, oldValue, newValue, createShadows) {
    if (oldValue < newValue) {
      for (let i = oldValue; i < newValue; i++) {
        var type = createShadows ? 'text' : null;
        Blockly.scratchBlocksUtils.newBlockParam(
          this, 'INPUT' + (i + 1), type,
          ['TEXT', this.possibleStrings[i] || '...'],
          function(input) {return input.setAlign(Blockly.ALIGN_RIGHT);}
        );
      }
    } else {
      for (let i = newValue; i < oldValue; i++) {
        this.removeInput('INPUT' + (i + 1));
      }
    }

    this.initSvg();
    if (this.rendered) this.render();
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
