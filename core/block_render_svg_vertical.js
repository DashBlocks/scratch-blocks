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

/**
 * @fileoverview Methods for graphically rendering a block as SVG.
 * @author fraser@google.com (Neil Fraser)
 */

/**
 * Some things (Custom Shapes, branched reporters & dual blocks render, etc.) taken from PenguinMod "The Port"
 * https://github.com/PenguinMod-Port/scratch-blocks/blob/develop/core/block_render_svg.js
 */

'use strict';

goog.provide('Blockly.BlockSvg.render');

goog.require('Blockly.BlockSvg');
goog.require('Blockly.scratchBlocksUtils');
goog.require('Blockly.utils');
goog.require('Blockly.pathUtils');

const getSubprop = (x, prop) => {
  if (typeof x == "object") return x[prop];
  return x;
}

// UI constants for rendering blocks.
/**
* Grid unit to pixels conversion
* @const
*/
Blockly.BlockSvg.GRID_UNIT = 4;

/**
 * Horizontal space between elements.
 * @const
 */
Blockly.BlockSvg.SEP_SPACE_X = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Vertical space between elements.
 * @const
 */
Blockly.BlockSvg.SEP_SPACE_Y = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of a block.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X = 16 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of a block with output (reporters).
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X_OUTPUT = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of a shadow block with output (single fields).
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X_SHADOW_OUTPUT = 10 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum height of a block.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of extra row after a statement input.
 * @const
 */
Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of a C- or E-shaped block.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT = 40 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum height of a shadow block with output and a single field.
 * This is used for shadow blocks that only contain a field - which are smaller than even reporters.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y_SINGLE_FIELD_OUTPUT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum height of a non-shadow block with output, i.e. a reporter.
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER = 10 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum space for a statement input height.
 * @const
 */
Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT = 6 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Width of vertical notch.
 * @const
 */
Blockly.BlockSvg.NOTCH_WIDTH = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of vertical notch.
 * @const
 */
Blockly.BlockSvg.NOTCH_HEIGHT = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Rounded corner radius.
 * @const
 */
Blockly.BlockSvg.CORNER_RADIUS = 1 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of statement input edge on the left, in px.
 * @const
 */
Blockly.BlockSvg.STATEMENT_INPUT_EDGE_WIDTH = 4 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Inner space between edge of statement input and notch.
 * @const
 */
Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of the top hat.
 * @const
 */
Blockly.BlockSvg.START_HAT_HEIGHT = 16;

/**
 * Height of the vertical separator line for icons that appear at the left edge
 * of a block, such as extension icons.
 * @const
 */
Blockly.BlockSvg.ICON_SEPARATOR_HEIGHT = 10 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Path of the top hat's curve.
 * @const
 */
Blockly.BlockSvg.START_HAT_PATH = 'c 25,-22 71,-22 96,0';

/**
 * SVG path for drawing next/previous notch from left to right.
 * @const
 */
Blockly.BlockSvg.NOTCH_PATH_LEFT = (
  'c 2,0 3,1 4,2 ' +
  'l 4,4 ' +
  'c 1,1 2,2 4,2 ' +
  'h 12 ' +
  'c 2,0 3,-1 4,-2 ' +
  'l 4,-4 ' +
  'c 1,-1 2,-2 4,-2'
);

/**
 * SVG path for drawing next/previous notch from right to left.
 * @const
 */
Blockly.BlockSvg.NOTCH_PATH_RIGHT = (
  'c -2,0 -3,1 -4,2 ' +
  'l -4,4 ' +
  'c -1,1 -2,2 -4,2 ' +
  'h -12 ' +
  'c -2,0 -3,-1 -4,-2 ' +
  'l -4,-4 ' +
  'c -1,-1 -2,-2 -4,-2'
);

/**
 * Amount of padding before the notch.
 * @const
 */
Blockly.BlockSvg.NOTCH_START_PADDING = 3 * Blockly.BlockSvg.GRID_UNIT;

/**
 * SVG start point for drawing the top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER_START =
    'm 0,' + Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the rounded top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER =
    'A ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ',0';

/**
 * SVG path for drawing the rounded top-right corner.
 * @const
 */
Blockly.BlockSvg.TOP_RIGHT_CORNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the rounded bottom-right corner.
 * @const
 */
Blockly.BlockSvg.BOTTOM_RIGHT_CORNER =
    ' a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 -' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the rounded bottom-left corner.
 * @const
 */
Blockly.BlockSvg.BOTTOM_LEFT_CORNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
     Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,1 -' +
     Blockly.BlockSvg.CORNER_RADIUS + ',-' +
     Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the top-left corner of a statement input.
 * @const
 */
Blockly.BlockSvg.INNER_TOP_LEFT_CORNER =
    ' a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 -' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for drawing the bottom-left corner of a statement input.
 * Includes the rounded inside corner.
 * @const
 */
Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER =
    'a ' + Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS + ' 0 0,0 ' +
    Blockly.BlockSvg.CORNER_RADIUS + ',' +
    Blockly.BlockSvg.CORNER_RADIUS;

/**
 * SVG path for an empty hexagonal input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL =
    'M ' + 4 * Blockly.BlockSvg.GRID_UNIT + ',0 ' +
    ' h ' + 4 * Blockly.BlockSvg.GRID_UNIT +
    ' l ' + 4 * Blockly.BlockSvg.GRID_UNIT + ',' + 4 * Blockly.BlockSvg.GRID_UNIT +
    ' l ' + -4 * Blockly.BlockSvg.GRID_UNIT + ',' + 4 * Blockly.BlockSvg.GRID_UNIT +
    ' h ' + -4 * Blockly.BlockSvg.GRID_UNIT +
    ' l ' + -4 * Blockly.BlockSvg.GRID_UNIT + ',' + -4 * Blockly.BlockSvg.GRID_UNIT +
    ' l ' + 4 * Blockly.BlockSvg.GRID_UNIT + ',' + -4 * Blockly.BlockSvg.GRID_UNIT +
    ' z';

/**
 * Width of empty boolean input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL_WIDTH = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * SVG path for an empty square input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_SQUARE =
    Blockly.BlockSvg.TOP_LEFT_CORNER_START +
    Blockly.BlockSvg.TOP_LEFT_CORNER +
    ' h ' + (12 * Blockly.BlockSvg.GRID_UNIT - 2 * Blockly.BlockSvg.CORNER_RADIUS) +
    Blockly.BlockSvg.TOP_RIGHT_CORNER +
    ' v ' + (8 * Blockly.BlockSvg.GRID_UNIT - 2 * Blockly.BlockSvg.CORNER_RADIUS) +
    Blockly.BlockSvg.BOTTOM_RIGHT_CORNER +
    ' h ' + (-12 * Blockly.BlockSvg.GRID_UNIT + 2 * Blockly.BlockSvg.CORNER_RADIUS) +
    Blockly.BlockSvg.BOTTOM_LEFT_CORNER +
    ' z';

/**
 * Width of empty square input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_SQUARE_WIDTH = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * SVG path for an empty round input shape.
 * @const
 */

Blockly.BlockSvg.INPUT_SHAPE_ROUND =
  'M ' + (4 * Blockly.BlockSvg.GRID_UNIT) + ',0' +
  ' h ' + (4 * Blockly.BlockSvg.GRID_UNIT) +
  ' a ' + (4 * Blockly.BlockSvg.GRID_UNIT) + ' ' +
      (4 * Blockly.BlockSvg.GRID_UNIT) + ' 0 0 1 0 ' + (8 * Blockly.BlockSvg.GRID_UNIT) +
  ' h ' + (-4 * Blockly.BlockSvg.GRID_UNIT) +
  ' a ' + (4 * Blockly.BlockSvg.GRID_UNIT) + ' ' +
      (4 * Blockly.BlockSvg.GRID_UNIT) + ' 0 0 1 0 -' + (8 * Blockly.BlockSvg.GRID_UNIT) +
  ' z';

/**
 * Width of empty round input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_ROUND_WIDTH = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of empty input shape.
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_HEIGHT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Height of user inputs
 * @const
 */
Blockly.BlockSvg.FIELD_HEIGHT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Width of user inputs
 * @const
 */
Blockly.BlockSvg.FIELD_WIDTH = 6 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Editable field padding (left/right of the text).
 * @const
 */
Blockly.BlockSvg.EDITABLE_FIELD_PADDING = 6;

/**
 * Square box field padding (left/right of the text).
 * @const
 */
Blockly.BlockSvg.BOX_FIELD_PADDING = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Drop-down arrow padding.
 * @const
 */
Blockly.BlockSvg.DROPDOWN_ARROW_PADDING = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Minimum width of user inputs during editing
 * @const
 */
Blockly.BlockSvg.FIELD_WIDTH_MIN_EDIT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Maximum width of user inputs during editing
 * @const
 */
Blockly.BlockSvg.FIELD_WIDTH_MAX_EDIT = Infinity;

/**
 * Maximum height of user inputs during editing
 * @const
 */
Blockly.BlockSvg.FIELD_HEIGHT_MAX_EDIT = Blockly.BlockSvg.FIELD_HEIGHT;

/**
 * Top padding of user inputs
 * @const
 */
Blockly.BlockSvg.FIELD_TOP_PADDING = 0.5 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Corner radius of number inputs
 * @const
 */
Blockly.BlockSvg.NUMBER_FIELD_CORNER_RADIUS = 4 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Corner radius of text inputs
 * @const
 */
Blockly.BlockSvg.TEXT_FIELD_CORNER_RADIUS = 1 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Default radius for a field, in px.
 * @const
 */
Blockly.BlockSvg.FIELD_DEFAULT_CORNER_RADIUS = 4 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Max text display length for a field (per-horizontal/vertical)
 * @const
 */
Blockly.BlockSvg.MAX_DISPLAY_LENGTH = Infinity;

/**
 * Minimum X of inputs and fields for blocks with a previous connection.
 * Ensures that inputs will not overlap with the top notch of blocks.
 * @const
 */
Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Vertical padding around inline elements.
 * @const
 */
Blockly.BlockSvg.INLINE_PADDING_Y = 1 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Point size of text field before animation. Must match size in CSS.
 * See implementation in field_textinput.
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_FONTSIZE_INITIAL = 12;

/**
 * Point size of text field after animation.
 * See implementation in field_textinput.
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_FONTSIZE_FINAL = 12;

/**
 * Whether text fields are allowed to expand past their truncated block size.
 * @const{boolean}
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_EXPAND_PAST_TRUNCATION = false;

/**
 * Whether text fields should animate their positioning.
 * @const{boolean}
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_ANIMATE_POSITIONING = false;

/**
 * Minimum width of a block with output and stack inputs (dual blocks).
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X_DUAL = Blockly.BlockSvg.MIN_BLOCK_X_OUTPUT + Blockly.BlockSvg.NOTCH_START_PADDING + Blockly.BlockSvg.NOTCH_WIDTH;

/**
 * Percentage of the maximum height a reporter can grow before its sides stretch or expand.
 */
Blockly.BlockSvg.REPORTER_HEIGHT_THRESHOLD = 1.0;

/**
 * Map of output/input shapes and the amount they should cause a block to be padded.
 * Outer key is the outer shape, inner key is the inner shape.
 * When a block with the outer shape contains an input block with the inner shape
 * on its left or right edge, that side is extended by the padding specified.
 * See also: `Blockly.BlockSvg.computeOutputPadding_`.
 */
Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING = {
  1: { // Outer shape: hexagon.
    0: 5 * Blockly.BlockSvg.GRID_UNIT, // Field in hexagon.
    1: 2 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in hexagon.
    2: 5 * Blockly.BlockSvg.GRID_UNIT, // Round in hexagon.
    3: 5 * Blockly.BlockSvg.GRID_UNIT, // Square in hexagon.
    4: 3 * Blockly.BlockSvg.GRID_UNIT, // Plus in hexagon.
    5: 5 * Blockly.BlockSvg.GRID_UNIT, // Octagon in hexagon.
    6: 2 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in hexagon.
  },
  2: { // Outer shape: round.
    0: 3 * Blockly.BlockSvg.GRID_UNIT, // Field in round.
    1: 3 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in round.
    2: 1 * Blockly.BlockSvg.GRID_UNIT, // Round in round.
    3: 3 * Blockly.BlockSvg.GRID_UNIT, // Square in round.
    4: 2 * Blockly.BlockSvg.GRID_UNIT, // Plus in round.
    5: 1 * Blockly.BlockSvg.GRID_UNIT, // Octagon in round.
    6: 3 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in round.
  },
  3: { // Outer shape: square.
    0: 2 * Blockly.BlockSvg.GRID_UNIT, // Field in square.
    1: 2 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in square.
    2: 2 * Blockly.BlockSvg.GRID_UNIT, // Round in square.
    3: 2 * Blockly.BlockSvg.GRID_UNIT, // Square in square.
    4: 2 * Blockly.BlockSvg.GRID_UNIT, // Plus in square.
    5: 1 * Blockly.BlockSvg.GRID_UNIT, // Octagon in square.
    6: 2 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in square.
  },
  4: { // Outer shape: plus.
    0: 5 * Blockly.BlockSvg.GRID_UNIT, // Field in plus.
    1: 4 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in plus.
    2: 4 * Blockly.BlockSvg.GRID_UNIT, // Round in plus.
    3: 5 * Blockly.BlockSvg.GRID_UNIT, // Square in plus.
    4: 3 * Blockly.BlockSvg.GRID_UNIT, // Plus in plus.
    5: 4 * Blockly.BlockSvg.GRID_UNIT, // Octagon in plus.
    6: 4 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in plus.
  },
  5: { // Outer shape: octagon.
    0: 5 * Blockly.BlockSvg.GRID_UNIT, // Field in octagon.
    1: 4 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in octagon.
    2: 4 * Blockly.BlockSvg.GRID_UNIT, // Round in octagon.
    3: 5 * Blockly.BlockSvg.GRID_UNIT, // Square in octagon.
    4: 3 * Blockly.BlockSvg.GRID_UNIT, // Plus in octagon.
    5: 1 * Blockly.BlockSvg.GRID_UNIT, // Octagon in octagon.
    6: 2 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in octagon.
  },
  6: { // Outer shape: scrapped.
    0: 5 * Blockly.BlockSvg.GRID_UNIT, // Field in scrapped.
    1: 4 * Blockly.BlockSvg.GRID_UNIT, // Hexagon in scrapped.
    2: 4 * Blockly.BlockSvg.GRID_UNIT, // Round in scrapped.
    3: 5 * Blockly.BlockSvg.GRID_UNIT, // Square in scrapped.
    4: 3 * Blockly.BlockSvg.GRID_UNIT, // Plus in scrapped.
    5: 2 * Blockly.BlockSvg.GRID_UNIT, // Octagon in scrapped.
    6: 2 * Blockly.BlockSvg.GRID_UNIT, // Scrapped in scrapped.
  },
};

/**
 * Default shape padding used by custom shapes if not set
 * @const
 */
Blockly.BlockSvg.DEFAULT_SHAPE_PADDING = Blockly.BlockSvg.GRID_UNIT * 5;

/**
 * Corner radius of the hat on the define block.
 * @const
 */
Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS = 5 * Blockly.BlockSvg.GRID_UNIT;

/**
 * SVG path for drawing the rounded top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER_DEFINE_HAT =
    'a ' + Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS + ',' +
    Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS + ',-' +
    Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS;

/**
 * SVG path for drawing the rounded top-left corner.
 * @const
 */
Blockly.BlockSvg.TOP_RIGHT_CORNER_DEFINE_HAT =
    'a ' + Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS + ',' +
    Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS + ' 0 0,1 ' +
    Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS + ',' +
    Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS;

/**
 * Padding on the right side of the internal block on the define block.
 * @const
 */
Blockly.BlockSvg.DEFINE_BLOCK_PADDING_RIGHT = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Roundness of the hexagonal block shape.
 * @const
 */
Blockly.BlockSvg.HEXAGONAL_SHAPE_ROUNDNESS = 1 * Blockly.BlockSvg.GRID_UNIT;

/**
 * Change the colour of a block.
 */
Blockly.BlockSvg.prototype.updateColour = function() {
  var strokeColour = this.getColourTertiary();
  var renderShadowed = this.isShadow() &&
      !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this);

  if (renderShadowed && this.parentBlock_) {
    // Pull shadow block stroke colour from parent block's tertiary if possible.
    strokeColour = this.parentBlock_.getColourTertiary();
    // Special case: if we contain a colour field, set to a special stroke colour.
    if (this.inputList[0] &&
        this.inputList[0].fieldRow[0] &&
        (this.inputList[0].fieldRow[0] instanceof Blockly.FieldColour ||
        this.inputList[0].fieldRow[0] instanceof Blockly.FieldColourSlider)) {
      strokeColour = Blockly.Colours.colourPickerStroke;
    }
  }

  // Render block stroke
  this.svgPath_.setAttribute('stroke', strokeColour);

  // Render block fill
  if (this.isGlowingBlock_ || renderShadowed) {
    // Use the block's shadow colour if possible.
    if (this.getShadowColour()) {
      var fillColour = this.getShadowColour();
    } else {
      var fillColour = this.getColourSecondary();
    }
  } else {
    var fillColour = this.getColour();
  }
  this.svgPath_.setAttribute('fill', fillColour);

  // Render opacity
  this.svgPath_.setAttribute('fill-opacity', this.getOpacity());

  // Update colours of input shapes.
  for (var i = 0, input; input = this.inputList[i]; i++) {
    if (input.outlinePath) {
      input.outlinePath.setAttribute('fill', this.getColourTertiary());
    }
  }

  // Render icon(s) if applicable
  var icons = this.getIcons();
  for (var i = 0; i < icons.length; i++) {
    icons[i].updateColour();
  }

  // Bump every dropdown to change its colour.
  for (var x = 0, input; input = this.inputList[x]; x++) {
    for (var y = 0, field; field = input.fieldRow[y]; y++) {
      field.setText(null);
    }
  }
};

/**
 * Visual effect to show that if the dragging block is dropped, this block will
 * be replaced.  If a shadow block it will disappear.  Otherwise it will bump.
 * @param {boolean} add True if highlighting should be added.
 */
Blockly.BlockSvg.prototype.highlightForReplacement = function(add) {
  if (add) {
    var replacementGlowFilterId = this.workspace.options.replacementGlowFilterId
      || 'blocklyReplacementGlowFilter';
    this.svgPath_.setAttribute('filter', 'url(#' + replacementGlowFilterId + ')');
    Blockly.utils.addClass(/** @type {!Element} */ (this.svgGroup_),
        'blocklyReplaceable');
  } else {
    this.svgPath_.removeAttribute('filter');
    Blockly.utils.removeClass(/** @type {!Element} */ (this.svgGroup_),
        'blocklyReplaceable');
  }
};

/**
 * Visual effect to show that if the dragging block is dropped it will connect
 * to this input.
 * @param {Blockly.Connection} conn The connection on the input to highlight.
 * @param {boolean} add True if highlighting should be added.
 */
Blockly.BlockSvg.prototype.highlightShapeForInput = function(conn, add) {
  var input = this.getInputWithConnection(conn);
  if (!input) {
    throw 'No input found for the connection';
  }
  if (!input.outlinePath) {
    return;
  }
  if (add) {
    var replacementGlowFilterId = this.workspace.options.replacementGlowFilterId
      || 'blocklyReplacementGlowFilter';
    input.outlinePath.setAttribute('filter',
        'url(#' + replacementGlowFilterId + ')');
    Blockly.utils.addClass(/** @type {!Element} */ (this.svgGroup_),
        'blocklyReplaceable');
  } else {
    input.outlinePath.removeAttribute('filter');
    Blockly.utils.removeClass(/** @type {!Element} */ (this.svgGroup_),
        'blocklyReplaceable');
  }
};

/**
 * Returns a bounding box describing the dimensions of this block
 * and any blocks stacked below it.
 * @return {!{height: number, width: number}} Object with height and width properties.
 */
Blockly.BlockSvg.prototype.getHeightWidth = function() {
  var height = this.height;
  var width = this.width;
  // Recursively add size of subsequent blocks.
  var nextBlock = this.getNextBlock();
  if (nextBlock) {
    var nextHeightWidth = nextBlock.getHeightWidth();
    height += nextHeightWidth.height;
    height -= Blockly.BlockSvg.NOTCH_HEIGHT; // Exclude height of connected notch.
    width = Math.max(width, nextHeightWidth.width);
  }
  return {height: height, width: width};
};

/**
 * Render the block.
 * Lays out and reflows a block based on its contents and settings.
 * @param {boolean=} opt_bubble If false, just render this block.
 *   If true, also render block's parent, grandparent, etc.  Defaults to true.
 */
Blockly.BlockSvg.prototype.render = function(opt_bubble) {
  Blockly.Field.startCache();
  this.rendered = true;

  var cursorX = Blockly.BlockSvg.SEP_SPACE_X;
  if (this.RTL) {
    cursorX = -cursorX;
  }
  // Move the icons into position.
  var icons = this.getIcons();
  var scratchCommentIcon = null;
  for (var i = 0; i < icons.length; i++) {
    if (icons[i] instanceof Blockly.ScratchBlockComment) {
      // Don't render scratch block comment icon until
      // after the inputs
      scratchCommentIcon = icons[i];
    } else {
      cursorX = icons[i].renderIcon(cursorX);
    }
  }
  cursorX += this.RTL ?
      Blockly.BlockSvg.SEP_SPACE_X : -Blockly.BlockSvg.SEP_SPACE_X;
  // If there are no icons, cursorX will be 0, otherwise it will be the
  // width that the first label needs to move over by.

  // If this is an extension reporter block, add a horizontal offset.
  if (this.isScratchExtension && this.outputConnection) {
    cursorX += this.RTL ?
      -Blockly.BlockSvg.GRID_UNIT : Blockly.BlockSvg.GRID_UNIT;
  }

  var inputRows = this.renderCompute_(cursorX);
  this.renderDraw_(cursorX, inputRows);
  this.renderMoveConnections_();

  this.renderClassify_();

  // Position the Scratch Block Comment Icon at the end of the block
  if (scratchCommentIcon) {
    var iconX = this.RTL ? -inputRows.rightEdge : inputRows.rightEdge;
    var inputMarginY = inputRows[0].height / 2;
    scratchCommentIcon.renderIcon(iconX, inputMarginY);
  }

  if (opt_bubble !== false) {
    // Render all blocks above this one (propagate a reflow).
    var parentBlock = this.getParent();
    if (parentBlock) {
      parentBlock.render(true);
    } else {
      // Top-most block.  Fire an event to allow scrollbars to resize.
      Blockly.resizeSvgContents(this.workspace);
    }
  }
  Blockly.Field.stopCache();

  this.updateIntersectionObserver();
};

/**
 * Render a list of fields starting at the specified location.
 * @param {!Array.<!Blockly.Field>} fieldList List of fields.
 * @param {number} cursorX X-coordinate to start the fields.
 * @param {number} cursorY Y-coordinate around which fields are centered.
 * @return {number} X-coordinate of the end of the field row (plus a gap).
 * @private
 */
Blockly.BlockSvg.prototype.renderFields_ = function(fieldList, cursorX,
    cursorY) {
  if (this.edgeShape_ && this.inputList.find(function(v) {return v.type === Blockly.NEXT_STATEMENT})) {
    cursorX += this.edgeShapeWidth_ + Blockly.BlockSvg.CORNER_RADIUS * 2
  }
  if (this.RTL) {
    cursorX = -cursorX;
  }
  for (var t = 0, field; field = fieldList[t]; t++) {
    var root = field.getSvgRoot();
    if (!root) {
      continue;
    }
    // In blocks with a notch, fields should be bumped to a min X,
    // to avoid overlapping with the notch. Label and image fields are
    // excluded.
    if (this.previousConnection && !(field instanceof Blockly.FieldLabel) &&
        !(field instanceof Blockly.FieldImage)) {
      cursorX = this.RTL ?
        Math.min(cursorX, -Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X) :
        Math.max(cursorX, Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X);
    }
    // Offset the field upward by half its height.
    // This vertically centers the fields around cursorY.
    var yOffset = -field.getSize().height / 2;

    // If this is an extension block, and this field is the first field, and
    // it is an image field, and this block has a previous connection, bump
    // the image down by one grid unit to align it vertically.
    if (this.isScratchExtension && (field === this.inputList[0].fieldRow[0])
        && (field instanceof Blockly.FieldImage) && this.previousConnection) {
      yOffset += Blockly.BlockSvg.GRID_UNIT;
    }

    // If this is an extension hat block, adjust the height of the vertical
    // separator without adjusting the field height. The effect is to move
    // the bottom end of the line up one grid unit.
    if (this.isScratchExtension &&
        !this.previousConnection && this.nextConnection &&
        field instanceof Blockly.FieldVerticalSeparator) {
      field.setLineHeight(Blockly.BlockSvg.ICON_SEPARATOR_HEIGHT -
          Blockly.BlockSvg.GRID_UNIT);
    }

    var translateX, translateY;
    var scale = '';
    if (this.RTL) {
      cursorX -= field.renderSep + field.renderWidth;
      translateX = cursorX;
      translateY = cursorY + yOffset;
      if (field.renderWidth) {
        cursorX -= Blockly.BlockSvg.SEP_SPACE_X;
      }
    } else {
      translateX = cursorX + field.renderSep;
      translateY = cursorY + yOffset;
      if (field.renderWidth) {
        cursorX += field.renderSep + field.renderWidth +
            Blockly.BlockSvg.SEP_SPACE_X;
      }
    }
    if (this.RTL &&
        field instanceof Blockly.FieldImage &&
        field.getFlipRTL()) {
      scale = 'scale(-1 1)';
      translateX += field.renderWidth;
    }
    root.setAttribute('transform',
        'translate(' + translateX + ', ' + translateY + ') ' + scale);

    // Fields are invisible on insertion marker.
    if (this.isInsertionMarker()) {
      root.setAttribute('display', 'none');
    }
  }
  return this.RTL ? -cursorX : cursorX;
};

/**
 * Computes the height and widths for each row and field.
 * @param {number} iconWidth Offset of first row due to icons.
 * @return {!Array.<!Array.<!Object>>} 2D array of objects, each containing
 *     position information.
 * @private
 */
Blockly.BlockSvg.prototype.renderCompute_ = function(iconWidth) {
  var inputList = this.inputList;
  var inputRows = [];
  // Block will be drawn from 0 (left edge) to rightEdge, in px.
  inputRows.rightEdge = 0;
  // Drawn from 0 to bottomEdge vertically.
  inputRows.bottomEdge = 0;
  var fieldValueWidth = 0;  // Width of longest external value field.
  var fieldStatementWidth = 0;  // Width of longest statement field.
  var hasValue = false;
  var hasStatement = false;
  var hasDummy = false;
  var lastType = undefined;

  // Previously created row, for special-casing row heights on C- and E- shaped blocks.
  var previousRow;
  for (var i = 0, input; input = inputList[i]; i++) {
    if (!input.isVisible()) {
      continue;
    }
    var isSecondInputOnProcedure = this.type == 'procedures_definition' &&
        lastType && lastType == Blockly.NEXT_STATEMENT;
    var row;
    // Don't create a new row for the second dummy input on a procedure block.
    // See github.com/LLK/scratch-blocks/issues/1658
    // In all other cases, statement and value inputs catch all preceding dummy
    // inputs, and cause a line break before following inputs.
    var previousInput = inputList[i - 1];
    if (
      (!this.inputsInline && (
        !previousInput ||
        previousInput.type !== Blockly.DUMMY_INPUT && !previousInput.connection.targetConnection
      )) ||
      (!isSecondInputOnProcedure && (!lastType || lastType == Blockly.NEXT_STATEMENT || input.type == Blockly.NEXT_STATEMENT))
    ) {
      lastType = input.type;
      row = this.createRowForInput_(input);
      inputRows.push(row);
    } else {
      row = inputRows[inputRows.length - 1];
    }
    row.push(input);

    // Compute minimum dimensions for this input.
    input.renderHeight = this.computeInputHeight_(input, row, previousRow);
    input.renderWidth = this.computeInputWidth_(input);

    // If the input is a statement input, determine if a notch
    // should be drawn at the inner bottom of the C.
    row.statementNotchAtBottom = true;
    if (input.connection && input.connection.type === Blockly.NEXT_STATEMENT) {
      var linkedBlock = input.connection.targetBlock();
      if (linkedBlock && !linkedBlock.lastConnectionInStack()) {
        row.statementNotchAtBottom = false;
      }
    }

    // Expand input size.
    if (input.connection) {
      var linkedBlock = input.connection.targetBlock();
      var paddedHeight = 0;
      var paddedWidth = 0;
      if (linkedBlock) {
        // A block is connected to the input - use its size.
        var bBox = linkedBlock.getHeightWidth();
        paddedHeight = bBox.height;
        paddedWidth = bBox.width;
      } else {
        // No block connected - use the size of the rendered empty input shape.
        paddedHeight = Blockly.BlockSvg.INPUT_SHAPE_HEIGHT;
      }
      if (input.connection.type === Blockly.INPUT_VALUE) {
        paddedHeight += 2 * Blockly.BlockSvg.INLINE_PADDING_Y;
      }
      if (input.connection.type === Blockly.NEXT_STATEMENT) {
        // Subtract height of notch, only if the last block in the stack has a next connection.
        if (row.statementNotchAtBottom) {
          paddedHeight -= Blockly.BlockSvg.NOTCH_HEIGHT;
        }
      }
      input.renderHeight = Math.max(input.renderHeight, paddedHeight);
      input.renderWidth = Math.max(input.renderWidth, paddedWidth);
    }
    row.height = Math.max(row.height, input.renderHeight);
    input.fieldWidth = 0;
    if (inputRows.length == 1) {
      // The first row gets shifted to accommodate any icons.
      input.fieldWidth += this.RTL ? -iconWidth : iconWidth;
    }
    var previousFieldEditable = false;
    for (var j = 0, field; field = input.fieldRow[j]; j++) {
      if (j != 0) {
        input.fieldWidth += Blockly.BlockSvg.SEP_SPACE_X;
      }
      // Get the dimensions of the field.
      var fieldSize = field.getSize();
      field.renderWidth = fieldSize.width;
      field.renderSep = (previousFieldEditable && field.EDITABLE) ?
          Blockly.BlockSvg.SEP_SPACE_X : 0;
      // See github.com/LLK/scratch-blocks/issues/1658
      if (!isSecondInputOnProcedure) {
        input.fieldWidth += field.renderWidth + field.renderSep;
      }
      row.height = Math.max(row.height, fieldSize.height);
      previousFieldEditable = field.EDITABLE;
    }

    if (row.type != Blockly.BlockSvg.INLINE) {
      if (row.type == Blockly.NEXT_STATEMENT) {
        hasStatement = true;
        fieldStatementWidth = Math.max(fieldStatementWidth, input.fieldWidth);
      } else {
        if (row.type == Blockly.INPUT_VALUE) {
          hasValue = true;
        } else if (row.type == Blockly.DUMMY_INPUT) {
          hasDummy = true;
        }
        fieldValueWidth = Math.max(fieldValueWidth, input.fieldWidth);
      }
    }
    previousRow = row;
  }

  /*
  // Fix incorrect width calculations for mega-chin blocks
  // i.e., C- or E- shaped blocks with labels and/or inputs on the end branch
  if (hasStatement) {
    // The mega-chin block issue only happens to blocks with images
    const input = inputList[inputList.length - 1];
    const field = input.fieldRow[0];
    if (field instanceof Blockly.FieldImage) {
      // Check for inputs before the last branch
      const measureables = [];
      for (var i = inputList.length - 1; i--; ) {
        if (inputList[i].type == Blockly.NEXT_STATEMENT) break;
        measureables.push(inputList[i]);
      }

      if (measureables.length) {
        const newWidth = measureables.reduce(function(w, input) {return w + input.fieldWidth}, 0);
        input.fieldWidth = newWidth * (Blockly.BlockSvg.BOX_FIELD_PADDING / 4);
      }
    }
  }
  */
  
  // Compute padding for output blocks.
  // Data is attached to the row.
  this.computeOutputPadding_(inputRows);
  // Compute the statement edge.
  // This is the width of a block where statements are nested.
  inputRows.statementEdge = Blockly.BlockSvg.STATEMENT_INPUT_EDGE_WIDTH +
      fieldStatementWidth;

  // Compute the preferred right edge.
  inputRows.rightEdge = this.computeRightEdge_(inputRows.rightEdge,
      hasStatement);

  // Bottom edge is sum of row heights
  for (var i = 0; i < inputRows.length; i++) {
    inputRows.bottomEdge += inputRows[i].height;
  }

  inputRows.hasValue = hasValue;
  inputRows.hasStatement = hasStatement;
  inputRows.hasDummy = hasDummy;
  return inputRows;
};

/**
 * Compute the minimum width of this input based on the connection type and
 * outputs.
 * @param {!Blockly.Input} input The input to measure.
 * @return {number} the computed width of this input.
 * @private
 */
Blockly.BlockSvg.prototype.computeInputWidth_ = function(input) {
  // Empty input shape widths.
  if (input.type == Blockly.INPUT_VALUE && (!input.connection || !input.connection.isConnected())) {
    const shape = input.connection.getOutputShape();
    const customShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(shape);
    if (customShape) return customShape.emptyInputWidth;
  }
  return 0;
};

/**
 * Compute the minimum height of this input.
 * @param {!Blockly.Input} input The input to measure.
 * @param {!Object} row The row of the block that is currently being measured.
 * @param {!Object} previousRow The previous row of the block, which was just
 *     measured.
 * @return {number} the computed height of this input.
 * @private
 */
Blockly.BlockSvg.prototype.computeInputHeight_ = function(input, row,
    previousRow) {
  if (this.inputList.length === 1 && this.outputConnection &&
      (this.isShadow() &&
      !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this))) {
    // "Lone" field blocks are smaller.
    return Blockly.BlockSvg.MIN_BLOCK_Y_SINGLE_FIELD_OUTPUT;
  } else if (this.outputConnection) {
    // If this is an extension reporter block, make it taller.
    if (this.isScratchExtension) {
      return Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER + 2 * Blockly.BlockSvg.GRID_UNIT;
    }
    // All other reporters.
    return Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;
  } else if (row.type == Blockly.NEXT_STATEMENT) {
    // Statement input.
    return Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT;
  } else if (previousRow && previousRow.type == Blockly.NEXT_STATEMENT) {
    // Extra row for below statement input.
    return Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y;
  } else {
    // If this is an extension block, and it has a previous connection,
    // make it taller.
    if (this.isScratchExtension && this.previousConnection) {
      return Blockly.BlockSvg.MIN_BLOCK_Y + 2 * Blockly.BlockSvg.GRID_UNIT;
    }
    // All other blocks.
    return Blockly.BlockSvg.MIN_BLOCK_Y;
  }
};

/**
 * Create a row for an input and associated fields.
 * @param {!Blockly.Input} input The input that the row is based on.
 * @return {!Object} The new row, with the correct type and default sizing info.
 */
Blockly.BlockSvg.prototype.createRowForInput_ = function(input) {
  // Create new row.
  var row = [];
  if (input.type != Blockly.NEXT_STATEMENT) {
    row.type = Blockly.BlockSvg.INLINE;
  } else {
    row.type = input.type;
  }
  row.height = 0;
  // Default padding for a block: same as separators between fields/inputs.
  row.paddingStart = Blockly.BlockSvg.SEP_SPACE_X;
  row.paddingEnd = Blockly.BlockSvg.SEP_SPACE_X;
  return row;
};

/**
 * Compute the preferred right edge of the block.
 * @param {number} curEdge The previously calculated right edge.
 * @param {boolean} hasStatement Whether this block has a statement input.
 * @return {number} The preferred right edge of the block.
 */
Blockly.BlockSvg.prototype.computeRightEdge_ = function(curEdge, hasStatement) {
  var edge = curEdge;
  if (this.previousConnection || this.nextConnection) {
    // Blocks with notches
    edge = Math.max(edge, this.outputConnection ? Blockly.BlockSvg.MIN_BLOCK_X_DUAL : Blockly.BlockSvg.MIN_BLOCK_X);
  } else if (this.outputConnection) {
    if (this.isShadow() &&
        !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this)) {
      // Single-fields
      edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X_SHADOW_OUTPUT);
    } else {
      // Reporters
      edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X_OUTPUT);
    }
  }
  if (hasStatement) {
    // Statement blocks (C- or E- shaped) have a longer minimum width.
    edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT);
  }

  // Ensure insertion markers are at least insertionMarkerMinWidth_ wide.
  if (this.insertionMarkerMinWidth_ > 0) {
    edge = Math.max(edge, this.insertionMarkerMinWidth_);
  }
  return edge;
};

/**
 * For a block with output,
 * determine start and end padding, based on connected inputs.
 * Padding will depend on the shape of the output, the shape of the input,
 * and possibly the size of the input.
 * @param {!Array.<!Array.<!Object>>} inputRows Partially calculated rows.
 */
Blockly.BlockSvg.prototype.computeOutputPadding_ = function(inputRows) {
  // Only apply to blocks with outputs and not single fields (shadows).
  if (!this.getOutputShape() || !this.outputConnection ||
      (this.isShadow() &&
      !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this))) {
    return;
  }
  // Blocks with outputs must have single row to be padded.
  if (inputRows.length > 1) {
    let shape = this.getOutputShapeRight();
    let totalHeight = inputRows.reduce(function(o, v) {return o + v.height;}, 0);
    if (!this.inputsInline && shape !== Blockly.OUTPUT_SHAPE_SQUARE) {
      inputRows.forEach(function(v) {
        return v.paddingEnd = getSubprop(Blockly.BlockSvg.CUSTOM_SHAPES.get(shape).edgeShapeWidth, "right")(totalHeight / 2);
      });
    }
    return;
  }
  var row = inputRows[0];
  var shape = this.getOutputShape();
  // Reset any padding: it's about to be set.
  row.paddingStart = 0;
  row.paddingEnd = 0;
  // Start row padding: based on first input or first field.
  var firstInput = row[0];
  var firstField = firstInput.fieldRow[0];
  if (firstField && firstField.getSize().width === 0) {
    firstField = null;
    if (firstInput.type == Blockly.DUMMY_INPUT && firstInput.fieldRow.length == 1 && row[1]) {
      firstInput = row[1];
      firstField = firstInput.fieldRow[0];
    }
  }
  var otherShape;
  // In checking the left/start side, a field takes precedence over any input.
  // That's because a field will be rendered before any value input.
  if (firstField || !firstInput.connection) {
    otherShape = 0; // Field comes first in the row.
    var shapeCurvature = getSubprop(Blockly.BlockSvg.CUSTOM_SHAPES.get(shape).curvature, "left") || 0
    if (shapeCurvature < 0) {
      var deltaHeight = firstInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;
      // One grid unit per level of nesting.
      let tmp = Blockly.BlockSvg.CUSTOM_SHAPES.get(shape)
      if (tmp.edgeShapeWidth) {
        row.paddingStart += getSubprop(tmp.edgeShapeWidth(deltaHeight / 2), "left")
      } else {
        row.paddingStart += deltaHeight / 2;
      }
    }
  } else {
    // Value input comes first in the row.
    var inputConnection = firstInput.connection;
    if (!inputConnection.targetConnection) {
      // Not connected: use the drawn shape.
      otherShape = inputConnection.getOutputShape();
    } else {
      // Connected: use the connected block's output shape.
      otherShape = inputConnection.targetConnection.getSourceBlock().getOutputShape();
    }
    // Special case for hexagonal output: if the connection is larger height
    // than a standard reporter, add some start padding.
    // https://github.com/LLK/scratch-blocks/issues/376
    var shapeCurvature = getSubprop(Blockly.BlockSvg.CUSTOM_SHAPES.get(shape).curvature, "left") || 0
    var otherCurvature = getSubprop(Blockly.BlockSvg.CUSTOM_SHAPES.get(otherShape).curvature, "left") || 0
    if (otherCurvature > shapeCurvature) {
      var deltaHeight = firstInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;
      // One grid unit per level of nesting.
      let tmp = Blockly.BlockSvg.CUSTOM_SHAPES.get(shape)
      if (tmp.edgeShapeWidth) {
        row.paddingStart += getSubprop(tmp.edgeShapeWidth(deltaHeight / 2), "left")
      } else {
        row.paddingStart += deltaHeight / 2;
      }
    }
  }

  row.paddingStart += getSubprop(Blockly.BlockSvg.getShapePadding(shape, otherShape), "left") || 0;
  if (!(!this.previousConnection || !this.previousConnection.targetConnection || !this.getSurroundParent())) {
    row.paddingStart = Blockly.BlockSvg.SEP_SPACE_X;
  }

  // End row padding: based on last input or last field.
  var lastInput = row[row.length - 1];
  // In checking the right/end side, any value input takes precedence over any field.
  // That's because fields are rendered before inputs...the last item
  // in the row will be an input, if one exists.
  if (lastInput.connection) {
    // Value input last in the row.
    var inputConnection = lastInput.connection;
    if (!inputConnection.targetConnection) {
      // Not connected: use the drawn shape.
      otherShape = inputConnection.getOutputShape();
    } else {
      // Connected: use the connected block's output shape.
      otherShape = inputConnection.targetConnection.getSourceBlock().getOutputShapeRight();
    }
    // Special case for hexagonal output: if the connection is larger height
    // than a standard reporter, add some end padding.
    // https://github.com/LLK/scratch-blocks/issues/376
    var shapeCurvature = getSubprop(Blockly.BlockSvg.CUSTOM_SHAPES.get(this.getOutputShapeRight()).curvature, "right") || 0
    var otherCurvature = getSubprop(Blockly.BlockSvg.CUSTOM_SHAPES.get(otherShape).curvature, "right") || 0
    if (otherCurvature > shapeCurvature) {
      var deltaHeight = lastInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;
      // One grid unit per level of nesting.
      let tmp = Blockly.BlockSvg.CUSTOM_SHAPES.get(this.getOutputShapeRight())
      if (tmp.edgeShapeWidth) {
        row.paddingEnd += getSubprop(tmp.edgeShapeWidth(deltaHeight / 2), "right")
      } else {
        row.paddingEnd += deltaHeight / 2;
      }
    }
  } else {
    // No input in this row - mark as field.
    otherShape = 0;
    var shapeCurvature = getSubprop(Blockly.BlockSvg.CUSTOM_SHAPES.get(this.getOutputShapeRight()).curvature, "right") || 0
    if (shapeCurvature < 0) {
      var deltaHeight = firstInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;
      // One grid unit per level of nesting.
      let tmp = Blockly.BlockSvg.CUSTOM_SHAPES.get(this.getOutputShapeRight())
      if (tmp.edgeShapeWidth) {
        row.paddingEnd += getSubprop(tmp.edgeShapeWidth(deltaHeight / 2), "right")
      } else {
        row.paddingEnd += deltaHeight / 2;
      }
    }
  }

  row.paddingEnd += getSubprop(Blockly.BlockSvg.getShapePadding(shape, otherShape), "right") || 0;
};

/**
 * Draw the path of the block.
 * Move the fields to the correct locations.
 * @param {number} iconWidth Offset of first row due to icons.
 * @param {!Array.<!Array.<!Object>>} inputRows 2D array of objects, each
 *     containing position information.
 * @private
 */
Blockly.BlockSvg.prototype.renderDraw_ = function(iconWidth, inputRows) {
  this.startHat_ = false;
  // Should the top left corners be rounded or square?
  // Currently, it is squared only if it's a hat.
  this.squareTopLeftCorner_ = false;
  if (!this.outputConnection && !this.previousConnection) {
    // No output or previous connection.
    this.squareTopLeftCorner_ = true;
    this.startHat_ = true;
    inputRows.rightEdge = Math.max(inputRows.rightEdge, 100);
  }

  // Amount of space to skip drawing the top and bottom,
  // to make room for the left and right to draw shapes (curves or angles).
  this.edgeShapeWidth_ = 0;
  this.edgeShape_ = null;
  if (this.outputConnection) {
    // Width of the curve/pointy-curve
    var shape = this.getOutputShape();
    if (shape !== Blockly.OUTPUT_SHAPE_SQUARE) {
      this.edgeShapeWidth_ = (
        inputRows.bottomEdge +
        this.inputList.filter(function(v) {return v.type == Blockly.NEXT_STATEMENT;}).length * Blockly.BlockSvg.NOTCH_WIDTH
      ) / 2;
      this.edgeShape_ = shape;
      this.squareTopLeftCorner_ = !this.previousConnection || !this.previousConnection.targetConnection || !this.getSurroundParent();
      this.height = this.edgeShapeWidth_ * 2;

      let customShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(shape);
      let rightCustomShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(this.getOutputShapeRight());

      let left = customShape.edgeShapeWidth ? getSubprop(customShape.edgeShapeWidth(this.edgeShapeWidth_), "left") : this.edgeShapeWidth_;
      let right = 0;
      this.edgeShapeWidth_ = left;

      if (inputRows.length === 1 && !this.inputList.find(function(v) {return v.type == Blockly.NEXT_STATEMENT;})) {
        right = rightCustomShape.edgeShapeWidth
          ? getSubprop(rightCustomShape.edgeShapeWidth(this.edgeShapeWidth_), "right")
          : this.edgeShapeWidth_;

        if (getSubprop(customShape.unsafeEdges, "left")) {
          inputRows[0].paddingStart += customShape.edgeShapeWidth
            ? getSubprop(customShape.edgeShapeWidth(this.height / 2), "left")
            : this.height / 2;
        }
        if (getSubprop(rightCustomShape.unsafeEdges, "right")) {
          inputRows[0].paddingEnd += rightCustomShape.edgeShapeWidth
            ? getSubprop(rightCustomShape.edgeShapeWidth(this.height / 2), "right")
            : this.height / 2;
        }
      }

      inputRows.rightEdge = Math.max(inputRows.rightEdge, left + right + Blockly.BlockSvg.GRID_UNIT * 2);
    }
  }

  // Assemble the block's path.
  var steps = [];

  this.renderDrawTop_(steps, inputRows.rightEdge);
  var cursorY = this.renderDrawRight_(steps, inputRows, iconWidth);
  this.renderDrawBottom_(steps, cursorY);
  this.renderDrawLeft_(steps);

  var pathString = steps.join(' ');
  this.svgPath_.setAttribute('d', pathString);

  if (this.RTL) {
    // Mirror the block's path.
    // This is awesome.
    this.svgPath_.setAttribute('transform', 'scale(-1 1)');
  }
};

/**
 * Give the block an attribute 'data-shapes' that lists its shape[s], and an
 *     attribute 'data-category' with its category.
 * @private
 */
Blockly.BlockSvg.prototype.renderClassify_ = function() {
  var shapes = [];

  if (this.outputConnection) {
    if (this.isShadow_) {
      shapes.push('argument');
    } else {
      shapes.push('reporter');
    }
    if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      shapes.push('boolean');
    } else if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_ROUND) {
      shapes.push('round');
    }
  } else {
    // count the number of statement inputs
    var inputList = this.inputList;
    var statementCount = 0;
    for (var i = 0, input; input = inputList[i]; i++) {
      if (input.connection && input.connection.type === Blockly.NEXT_STATEMENT) {
        statementCount++;
      }
    }

    if (statementCount) {
      shapes.push('c-block');
      shapes.push('c-' + statementCount);
    }
    if (this.startHat_) {
      shapes.push('hat'); // c-block+hats are possible (e.x. reporter procedures)
    } else if (!statementCount) {
      shapes.push('stack'); // only call it "stack" if it's not a c-block
    }
    if (!this.nextConnection) {
      shapes.push('end');
    }
  }

  this.svgGroup_.setAttribute('data-shapes', shapes.join(' '));

  if (this.getCategory()) {
    this.svgGroup_.setAttribute('data-category', this.getCategory());
  }
};

/**
 * Render the top edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {number} rightEdge Minimum width of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawTop_ = function(steps, rightEdge) {
  if (this.type == Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE) {
    steps.push('m 0, 0');
    steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER_DEFINE_HAT);
  } else {
    // Position the cursor at the top-left starting point.
    if (this.squareTopLeftCorner_) {
      steps.push('m 0,0');
      if (this.startHat_) {
        steps.push(Blockly.BlockSvg.START_HAT_PATH);
      }
      // Skip space for the output shape
      if (this.edgeShapeWidth_) {
        steps.push('m ' + this.edgeShapeWidth_ + ',0');
      }
    } else {
      steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER_START);
      // Top-left rounded corner.
      steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER);
    }

    // Top edge.
    if (this.previousConnection) {
      // Space before the notch
      let notchStart = Blockly.BlockSvg.NOTCH_START_PADDING;
      if (this.edgeShape_ && (!this.previousConnection || !this.previousConnection.targetConnection || !this.getSurroundParent())) {
        notchStart += this.edgeShapeWidth_;
      }
      steps.push('H', notchStart);
      steps.push(Blockly.pathUtils.scale(Blockly.BlockSvg.NOTCH_PATH_LEFT, 1, Blockly.BlockSvg.NOTCH_HEIGHT / (2 * Blockly.BlockSvg.GRID_UNIT)));

      // Create previous block connection.
      let connectionX = Blockly.BlockSvg.NOTCH_WIDTH;
      if (this.edgeShape_ && (!this.previousConnection || !this.previousConnection.targetConnection || !this.getSurroundParent())) {
        connectionX += this.edgeShapeWidth_;
      }
      connectionX *= this.RTL ? -1 : 1;
      this.previousConnection.setOffsetInBlock(connectionX, 0);
    }
  }
  this.width = rightEdge;
};

/**
 * Render the right edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Array.<!Array.<!Object>>} inputRows 2D array of objects, each
 *     containing position information.
 * @param {number} iconWidth Offset of first row due to icons.
 * @return {number} Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawRight_ = function(steps,
    inputRows, iconWidth) {
  var cursorX = 0;
  var cursorY = 0;
  var connectionX, connectionY;
  for (var y = 0, row; row = inputRows[y]; y++) {
    cursorX = row.paddingStart;
    if (
      this.edgeShape_ &&
      (!this.previousConnection || !this.previousConnection.targetConnection || !this.getSurroundParent()) &&
      inputRows.length > 1
    ) {
      cursorX += this.edgeShapeWidth_;
    }
    if (y == 0) {
      cursorX += this.RTL ? -iconWidth : iconWidth;
    }

    if (row.type == Blockly.BlockSvg.INLINE) {
      // Inline inputs.
      for (var x = 0, input; input = row[x]; x++) {
        // Align fields vertically within the row.
        // Moves the field to half of the row's height.
        // In renderFields_, the field is further centered
        // by its own rendered height.
        var fieldY = cursorY + row.height / 2;

        var fieldX = Blockly.BlockSvg.getAlignedCursor_(cursorX, input, inputRows, y);

        cursorX = this.renderFields_(input.fieldRow, fieldX, fieldY);
        if (input.type == Blockly.INPUT_VALUE) {
          // Create inline input connection.
          // In blocks with a notch, inputs should be bumped to a min X,
          // to avoid overlapping with the notch.
          if (this.previousConnection && (!inputRows[y - 1] || inputRows[y - 1].type !== Blockly.BlockSvg.INLINE)) {
            cursorX = Math.max(cursorX, Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X +
              (!(!this.previousConnection || !this.previousConnection.targetConnection || !this.getSurroundParent()) ? 0 : this.edgeShapeWidth_));
          }
          connectionX = this.RTL ? -cursorX : cursorX;
          // Attempt to center the connection vertically.
          var connectionYOffset = row.height / 2;
          connectionY = cursorY + connectionYOffset;
          input.connection.setOffsetInBlock(connectionX, connectionY);
          this.renderInputShape_(input, cursorX, cursorY + connectionYOffset);
          cursorX += input.renderWidth + Blockly.BlockSvg.SEP_SPACE_X;
        }
      }
      // Remove final separator and replace it with right-padding.
      cursorX -= Blockly.BlockSvg.SEP_SPACE_X;
      cursorX += row.paddingEnd;
      // Update right edge for all inputs, such that all rows
      // stretch to be at least the size of all previous rows.
      inputRows.rightEdge = Math.max(
        cursorX,
        inputRows.rightEdge,
        this.inputList.find(function(v) {return v.type === Blockly.NEXT_STATEMENT})
          ? Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT + this.edgeShapeWidth_ : 0
      );
      // Move to the right edge
      let cursorXChanged = this.width < inputRows.rightEdge;
      cursorX = Math.max(cursorX, inputRows.rightEdge);
      this.width = Math.max(this.width, cursorX);
      if (
        this.getOutputShapeRight() == Blockly.OUTPUT_SHAPE_SQUARE &&
        (!inputRows[y - 1] || inputRows[y - 1].type !== Blockly.BlockSvg.INLINE || cursorXChanged)
      ) {
        // Include corner radius in drawing the horizontal line.
        steps.push('H', cursorX - Blockly.BlockSvg.CORNER_RADIUS);
        steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
      } else {
        // Don't include corner radius - no corner (edge shape drawn).
        steps.push('H', cursorX - this.edgeShapeWidth_);
      }
      // Subtract CORNER_RADIUS * 2 to account for the top right corner
      // and also the bottom right corner. Only move vertically the non-corner length.
      if (this.getOutputShapeRight() == Blockly.OUTPUT_SHAPE_SQUARE) {
        steps.push('v', row.height - Blockly.BlockSvg.CORNER_RADIUS *
          (inputRows[y - 1] && inputRows[y - 1].type === Blockly.BlockSvg.INLINE ? (cursorXChanged ? 1 : 0) : 2));
      }
    } else if (row.type == Blockly.NEXT_STATEMENT) {
      // Nested statement.
      var input = row[0];
      var fieldX = cursorX;
      // Align fields vertically within the row.
      // In renderFields_, the field is further centered by its own height.
      var fieldY = cursorY;
      fieldY += Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT;
      this.renderFields_(input.fieldRow, fieldX, fieldY);
      // Move to the start of the notch.
      cursorX = inputRows.statementEdge + Blockly.BlockSvg.NOTCH_WIDTH;

      if (this.type == Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE) {
        this.renderDefineBlock_(steps, inputRows, input, row, cursorY);
      } else {
        Blockly.BlockSvg.drawStatementInputFromTopRight_(steps, cursorX,
            inputRows.rightEdge, row, this);
      }

      // Create statement connection.
      connectionX = this.RTL ? -cursorX : cursorX;
      input.connection.setOffsetInBlock(connectionX, cursorY);
      if (input.connection.isConnected()) {
        this.width = Math.max(this.width, inputRows.statementEdge +
          input.connection.targetBlock().getHeightWidth().width +
          (this.inputList.find(function(v) {return v.type === Blockly.NEXT_STATEMENT}) ? this.edgeShapeWidth_ : 0));
      }
      if (this.type != Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE &&
        (y == inputRows.length - 1 ||
          inputRows[y + 1].type == Blockly.NEXT_STATEMENT)) {
        // If the final input is a statement stack, add a small row underneath.
        // Consecutive statement stacks are also separated by a small divider.
        steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
        steps.push('v', Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y - 2 * Blockly.BlockSvg.CORNER_RADIUS);
        cursorY += Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y;
      }
    }
    cursorY += row.height;
  }
  this.drawEdgeShapeRight_(steps);
  if (!inputRows.length) {
    cursorY = Blockly.BlockSvg.MIN_BLOCK_Y;
    steps.push('V', cursorY);
  }
  return cursorY;
};

/**
 * Render the input shapes.
 * If there's a connected block, hide the input shape.
 * Otherwise, draw and set the position of the input shape.
 * @param {!Blockly.Input} input Input to be rendered.
 * @param {Number} x X offset of input.
 * @param {Number} y Y offset of input.
 */
Blockly.BlockSvg.prototype.renderInputShape_ = function(input, x, y) {
  var inputShape = input.outlinePath;
  if (!inputShape) {
    // No input shape for this input - e.g., the block is an insertion marker.
    return;
  }
  // Input shapes are only visibly rendered on non-connected slots.
  if (input.connection.targetConnection) {
    inputShape.setAttribute('style', 'visibility: hidden');
  } else {
    var inputShapeX = 0, inputShapeY = 0;
    var inputShapeInfo =
        Blockly.BlockSvg.getInputShapeInfo_(input.connection.getOutputShape());
    if (this.RTL) {
      inputShapeX = -x - inputShapeInfo.width;
    } else {
      inputShapeX = x;
    }
    inputShapeY = y - (Blockly.BlockSvg.INPUT_SHAPE_HEIGHT / 2);
    inputShape.setAttribute('d', inputShapeInfo.path);
    inputShape.setAttribute('transform',
        'translate(' + inputShapeX + ',' + inputShapeY + ')');
    inputShape.setAttribute('data-argument-type', inputShapeInfo.argType);
    inputShape.setAttribute('style', 'visibility: visible');
  }
};

/**
 * Render the bottom edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {number} cursorY Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawBottom_ = function(steps, cursorY) {
  this.height = cursorY;
  if (this.edgeShapeWidth_) {
    this.edgeShapeWidth_ = this.height / 2; // more accurate assumption
    let customShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(this.getOutputShape());
    if (customShape.edgeShapeWidth) {
      this.edgeShapeWidth_ = getSubprop(customShape.edgeShapeWidth(this.edgeShapeWidth_), "right");
    }
  }
  if (this.getOutputShapeRight() == Blockly.OUTPUT_SHAPE_SQUARE) {
    steps.push(Blockly.BlockSvg.BOTTOM_RIGHT_CORNER);
  }
  if (this.nextConnection) {
    // Move to the right-side of the notch.
    var notchStart = (
      Blockly.BlockSvg.NOTCH_WIDTH +
      Blockly.BlockSvg.NOTCH_START_PADDING +
      Blockly.BlockSvg.GRID_UNIT
    );
    if (this.edgeShape_ && (!this.previousConnection || !this.previousConnection.targetConnection || !this.getSurroundParent())) {
      notchStart += this.edgeShapeWidth_;
    }
    steps.push('H', notchStart, ' ');
    steps.push(Blockly.pathUtils.scale(Blockly.BlockSvg.NOTCH_PATH_RIGHT, 1, Blockly.BlockSvg.NOTCH_HEIGHT / (2 * Blockly.BlockSvg.GRID_UNIT)));
    // Create next block connection.
    var connectionX = Blockly.BlockSvg.NOTCH_WIDTH;
    if (this.edgeShape_ && (!this.previousConnection || !this.previousConnection.targetConnection || !this.getSurroundParent())) {
      connectionX += this.edgeShapeWidth_;
    }
    connectionX *= this.RTL ? -1 : 1;
    this.nextConnection.setOffsetInBlock(connectionX, cursorY);
    // Include height of notch in block height.
    this.height += Blockly.BlockSvg.NOTCH_HEIGHT;
  }
  // Bottom horizontal line
  if (!this.edgeShape_ || !(!this.previousConnection || !this.previousConnection.targetConnection || !this.getSurroundParent())) {
    steps.push('H', Blockly.BlockSvg.CORNER_RADIUS);
    // Bottom left corner
    steps.push(Blockly.BlockSvg.BOTTOM_LEFT_CORNER);
  } else {
    steps.push('H', this.height / 2);
  }
};

/**
 * Render the left edge of the block.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {number} cursorY Height of block.
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawLeft_ = function(steps) {
  let scale = this.height / 2
  
  if (this.outputConnection) {
    // Scratch-style reporters have output connection y at half block height.
    this.outputConnection.setOffsetInBlock(0, this.height / 2);
  }
  if (this.edgeShape_ && (!this.previousConnection || !this.previousConnection.targetConnection || !this.getSurroundParent())) {
    if (this.nextConnection) this.height -= Blockly.BlockSvg.NOTCH_HEIGHT;
    const customShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(this.edgeShape_);
    if (customShape) {
      const path = customShape.leftPath(this);
      if (path && Array.isArray(path)) steps.push.apply(steps, path);
      else console.error(`Left Path Function for shape: ${this.edgeShape_} did not return an Array!`);
    }
    if (this.nextConnection) this.height += Blockly.BlockSvg.NOTCH_HEIGHT;
  }
  steps.push('z');
};

/**
 * Draw the edge shape on the right side of a block with
 * an output.
 * @param {!Array.<string>} steps Path of block outline.
 * @private
 */
Blockly.BlockSvg.prototype.drawEdgeShapeRight_ = function(steps) {
  if (this.getOutputShapeRight() != Blockly.OUTPUT_SHAPE_SQUARE) {
    const customShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(this.edgeShape_);
    if (customShape) {
      const path = customShape.rightPath(this);
      if (path && Array.isArray(path)) steps.push.apply(steps, path);
      else console.error(`Right Path Function for shape: ${this.edgeShape_} did not return an Array!`);
    }
  }
};

/**
 * Position an new block correctly, so that it doesn't move the existing block
 * when connected to it.
 * @param {!Blockly.Block} newBlock The block to position - either the first
 *     block in a dragged stack or an insertion marker.
 * @param {!Blockly.Connection} newConnection The connection on the new block's
 *     stack - either a connection on newBlock, or the last NEXT_STATEMENT
 *     connection on the stack if the stack's being dropped before another
 *     block.
 * @param {!Blockly.Connection} existingConnection The connection on the
 *     existing block, which newBlock should line up with.
 */
Blockly.BlockSvg.prototype.positionNewBlock = function(newBlock, newConnection,
    existingConnection) {
  // We only need to position the new block if it's before the existing one,
  // otherwise its position is set by the previous block.
  if (newConnection.type == Blockly.NEXT_STATEMENT) {
    var dx = existingConnection.x_ - newConnection.x_;
    var dy = existingConnection.y_ - newConnection.y_;
    if (newConnection.sourceBlock_.edgeShape_ && newConnection != newBlock.nextConnection) {
      var bounds = existingConnection.sourceBlock_.getBoundingRectangle();
      dx += ((bounds.bottomRight.y - bounds.topLeft.y) / -2) + 6 * Blockly.BlockSvg.GRID_UNIT;
    }

    newBlock.moveBy(dx, dy);
  }
};

/**
 * Draw the outline of a statement input, starting at the top right corner.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {number} cursorX The x position of the start of the notch at the top
 *     of the input.
 * @param {number} rightEdge The far right edge of the block, which determines
 *     how wide the statement input is.
 * @param {!Array.<!Object>} row An object containing information about the
 *     current row, including its height and whether it should have a notch at
 *     the bottom.
 * @private
 */
Blockly.BlockSvg.drawStatementInputFromTopRight_ = function(steps, cursorX,
    rightEdge, row, block) {
  Blockly.BlockSvg.drawStatementInputTop_(steps, cursorX, block);
  steps.push('v', row.height - 2 * Blockly.BlockSvg.CORNER_RADIUS);
  Blockly.BlockSvg.drawStatementInputBottom_(steps, rightEdge, row);
};

/**
 * Draw the top of the outline of a statement input, starting at the top right
 * corner.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {number} cursorX The x position of the start of the notch at the top
 *     of the input.
 * @private
 */
Blockly.BlockSvg.drawStatementInputTop_ = function(steps, cursorX, block) {
  steps.push(Blockly.BlockSvg.BOTTOM_RIGHT_CORNER);
  steps.push('H', cursorX + Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE +
    2 * Blockly.BlockSvg.CORNER_RADIUS + block.edgeShapeWidth_);
  steps.push(Blockly.pathUtils.scale(Blockly.BlockSvg.NOTCH_PATH_RIGHT, 1, Blockly.BlockSvg.NOTCH_HEIGHT / (2 * Blockly.BlockSvg.GRID_UNIT)));

  steps.push('h', -Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE - Blockly.BlockSvg.GRID_UNIT + Blockly.BlockSvg.CORNER_RADIUS);
  steps.push(Blockly.BlockSvg.INNER_TOP_LEFT_CORNER);
};

/**
 * Draw the bottom of the outline of a statement input, starting at the inner
 * left corner.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {number} rightEdge The far right edge of the block, which determines
 *     how wide the statement input is.
 * @param {!Array.<!Object>} row An object containing information about the
 *     current row, including its height and whether it should have a notch at
 *     the bottom.
 * @private
 */
Blockly.BlockSvg.drawStatementInputBottom_ = function(steps, rightEdge, row) {
  steps.push(Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER);
  if (row.statementNotchAtBottom) {
    steps.push('h ', Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE + Blockly.BlockSvg.NOTCH_SPACING + Blockly.BlockSvg.GRID_UNIT -
      Blockly.BlockSvg.CORNER_RADIUS);
    steps.push(Blockly.pathUtils.scale(Blockly.BlockSvg.NOTCH_PATH_LEFT, 1, Blockly.BlockSvg.NOTCH_HEIGHT / (2 * Blockly.BlockSvg.GRID_UNIT)));
  }
  steps.push('H', rightEdge - Blockly.BlockSvg.CORNER_RADIUS);
};

/**
 * Render part of the hat and the right side of the define block to fully wrap
 * the connected statement block.
 * Scratch-specific.
 * @param {!Array.<string>} steps Path of block outline.
 * @param {!Array.<!Array.<!Object>>} inputRows 2D array of objects, each
 *     containing position information.
 * @param {!Blockly.Input} input The input that is currently being rendered.
 * @param {!Array.<!Object>} row An object containing information about the
 *     current row, including its height and whether it should have a notch at
 *     the bottom.
 * @param {number} cursorY The y position of the start of this row.  Used to
 *     position the following dummy input's fields.
 * @private
 */
Blockly.BlockSvg.prototype.renderDefineBlock_ = function(steps, inputRows,
    input, row, cursorY) {
  // Following text shows up as a dummy input after the statement input, which
  // we are forcing to stay inline with the statement input instead of letting
  // it drop to a new line.
  var hasFollowingText = row.length == 2;

  // Figure out where the right side of the block is.
  var rightSide = inputRows.rightEdge;
  if (input.connection && input.connection.targetBlock()) {
    rightSide = inputRows.statementEdge +
        input.connection.targetBlock().getHeightWidth().width +
        Blockly.BlockSvg.DEFINE_BLOCK_PADDING_RIGHT;
  } else {
    // Handles the case where block is being rendered as an insertion marker
    rightSide = Math.max(Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT, rightSide)
    + Blockly.BlockSvg.DEFINE_BLOCK_PADDING_RIGHT;
  }
  rightSide -= Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS;

  if (hasFollowingText) {
    var followingTextInput = row[1];
    var fieldStart = rightSide + 3 * Blockly.BlockSvg.SEP_SPACE_X;
    rightSide += followingTextInput.fieldRow[0].getSize().width;
    rightSide += 2 * Blockly.BlockSvg.SEP_SPACE_X;

    // Align fields vertically within the row.
    // In renderFields_, the field is further centered by its own height.
    // The dummy input's fields did not get laid out normally because we're
    // forcing them to stay inline with a statement input.
    var fieldY = cursorY;
    fieldY += Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT;
    this.renderFields_(followingTextInput.fieldRow, fieldStart, fieldY);
  }
  // Draw the top and the right corner of the hat.
  steps.push('H', rightSide);
  steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER_DEFINE_HAT);
  row.height += 3 * Blockly.BlockSvg.GRID_UNIT;
  // Draw the right side of the block around the statement input.
  steps.push('v', row.height);
  // row.height will be used to update the cursor in the calling function.
  row.height += Blockly.BlockSvg.GRID_UNIT;
};

/**
 * Get some information about the input shape to draw, based on the type of the
 * connection.
 * @param {number} shape An enum representing the shape of the connection we're
 *     drawing around.
 * @return {!Object} An object containing an SVG path, a string representation
 *     of the argument type, and a width.
 * @private
 */
Blockly.BlockSvg.getInputShapeInfo_ = function(shape) {
  const customShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(shape);
  var inputShapePath = customShape.emptyInputPath;
  var inputShapeWidth = customShape.emptyInputWidth;
  var inputShapeArgType = 'input';

  switch (shape) {
    case Blockly.OUTPUT_SHAPE_HEXAGONAL:
      inputShapeArgType = 'boolean';
      break;
    case Blockly.OUTPUT_SHAPE_ROUND:
      inputShapeArgType = 'round';
      break;
    case Blockly.OUTPUT_SHAPE_SQUARE:
      inputShapeArgType = 'square';
      break;
  }

  // Try emulate path generation
  if (inputShapePath === undefined) {
    let block = {height: 8 * Blockly.BlockSvg.GRID_UNIT, edgeShapeWidth_: 4 * Blockly.BlockSvg.GRID_UNIT};
    if (customShape.edgeShapeWidth) block.edgeShapeWidth_ = customShape.edgeShapeWidth(block.edgeShapeWidth_);
    let widthDifference = inputShapeWidth - block.edgeShapeWidth_ * 2;

    let path = [`M ${block.edgeShapeWidth_} 0`, `l ${widthDifference} 0`];
    path = path.concat(customShape.rightPath(block));
    path.push(`h ${-widthDifference}`);
    path = path.concat(customShape.leftPath(block));
    path.push(`z`);

    inputShapePath = path.join(' ');
  }
  
  return {
    path: inputShapePath,
    argType: inputShapeArgType,
    width: inputShapeWidth
  };
};

/**
 * Get the correct cursor position for the given input, based on alignment,
 * the total size of the block, and the size of the input.
 * @param {number} cursorX The minimum x value of the cursor.
 * @param {!Blockly.Input} input The input to align the fields for.
 * @param {number} rightEdge The maximum width of the block.  Right-aligned
 *     fields are positioned based on this number.
 * @return {number} The new cursor position.
 * @private
 */
Blockly.BlockSvg.getAlignedCursor_ = function(cursorX, input, inputRows, rowI) {
  // Align inline field rows (left/right/centre).
  if (input.align === Blockly.ALIGN_RIGHT) {
    let offset = inputRows[rowI].paddingEnd;
    cursorX = Math.max(cursorX, inputRows.rightEdge - input.fieldWidth - input.renderWidth - offset);
  } else if (input.align === Blockly.ALIGN_CENTRE) {
    cursorX = Math.max(cursorX, inputRows.rightEdge / 2 - input.fieldWidth / 2);
  }
  return cursorX;
};

/**
 * Update all of the connections on this block with the new locaitons calculated
 * in renderCompute, and move all of the connected blocks based on the new
 * connection locations.
 * @private
 */
Blockly.BlockSvg.prototype.renderMoveConnections_ = function() {
  var blockTL = this.getRelativeToSurfaceXY();
  var branchedReporterTL = blockTL.clone().translate(this.edgeShapeWidth_ * (this.RTL ? -1 : 1), 0);
  // Don't tighten previous or output connections because they are inferior.
  if (this.previousConnection) {
    this.previousConnection.moveToOffset(blockTL);
  }
  if (this.outputConnection) {
    this.outputConnection.moveToOffset(blockTL);
  }

  for (var i = 0; i < this.inputList.length; i++) {
    var conn = this.inputList[i].connection;
    if (conn) {
      conn.moveToOffset(this.inputList[i].type === Blockly.NEXT_STATEMENT ? branchedReporterTL : blockTL);
      if (conn.isConnected()) {
        conn.tighten_();
      }
    }
  }

  if (this.nextConnection) {
    this.nextConnection.moveToOffset(blockTL);
    if (this.nextConnection.isConnected()) {
      /** @todo Remove this lazy fix for dual block rendering */
      this.getNextBlock().render(false);
      this.nextConnection.tighten_();
    }
  }
};

Blockly.BlockSvg.prototype.getOutputShapeRight = function() {
  if (!this.outputConnection) return Blockly.OUTPUT_SHAPE_SQUARE;
  if (this.inputList.find(function(v) {return v.type == Blockly.NEXT_STATEMENT;})) return Blockly.OUTPUT_SHAPE_SQUARE;
  return this.getOutputShape();
}

Blockly.BlockSvg.getShapePadding = function(external, internal) {
  if (Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[external] && Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[external][internal]) {
    return Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[external][internal];
  }

  let externalShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(external);
  if (externalShape && externalShape.blockPadding && externalShape.blockPadding.external) {
    let padding = externalShape.blockPadding.external[internal];
    if (padding) return padding;
  }

  let internalShape = Blockly.BlockSvg.CUSTOM_SHAPES.get(internal);
  if (internalShape && internalShape.blockPadding && internalShape.blockPadding.internal) {
    let padding = internalShape.blockPadding.internal[external];
    if (padding) return padding;
  }

  return 0;
}

/**
 * Map of all user-defined custom block shapes.
 * @type {Map}
 */
Blockly.BlockSvg.CUSTOM_SHAPES = new Map([
  // Pre-made native shapes.
  [Blockly.OUTPUT_SHAPE_HEXAGONAL, {
    emptyInputWidth: 12 * Blockly.BlockSvg.GRID_UNIT,
    curvature: 0,
    leftPath: (block) => {
      const hexRoundness = Blockly.BlockSvg.HEXAGONAL_SHAPE_ROUNDNESS;
      const diagonalWidth = block.edgeShapeWidth_ - hexRoundness * 1.5;
      const yMult = block.height / 2 / block.edgeShapeWidth_;
      return [
        `q ${-hexRoundness / 2} 0 ${-hexRoundness} ${-hexRoundness / 2 * yMult}`,
        `l ${-diagonalWidth} ${-diagonalWidth * yMult}`,
        `q ${-hexRoundness} ${-hexRoundness * yMult} 0 ${-hexRoundness * 2 * yMult}`,
        `l ${diagonalWidth} ${-diagonalWidth * yMult}`,
        `q ${hexRoundness / 2} ${-hexRoundness / 2 * yMult} ${hexRoundness} ${-hexRoundness / 2 * yMult}`
      ];
    },
    rightPath: (block) => {
      const hexRoundness = Blockly.BlockSvg.HEXAGONAL_SHAPE_ROUNDNESS;
      const diagonalWidth = block.edgeShapeWidth_ - hexRoundness * 1.5;
      const yMult = block.height / 2 / block.edgeShapeWidth_;
      return [
        `q ${hexRoundness / 2} 0 ${hexRoundness} ${hexRoundness / 2 * yMult}`,
        `l ${diagonalWidth} ${diagonalWidth * yMult}`,
        `q ${hexRoundness} ${hexRoundness * yMult} 0 ${hexRoundness * 2 * yMult}`,
        `l ${-diagonalWidth} ${diagonalWidth * yMult}`,
        `q ${-hexRoundness / 2} ${hexRoundness / 2 * yMult} ${-hexRoundness} ${hexRoundness / 2 * yMult}`
      ];
    },
    edgeShapeWidth: (original) => {
      return Math.min(original, Blockly.BlockSvg.GRID_UNIT * 15 * Blockly.BlockSvg.REPORTER_HEIGHT_THRESHOLD)
    }
  }],
  [Blockly.OUTPUT_SHAPE_ROUND, {
    emptyInputWidth: 12 * Blockly.BlockSvg.GRID_UNIT,
    curvature: 1,
    leftPath: (block) => {
      const unit = block.edgeShapeWidth_;
      const remainingHeight = block.height - unit * 2;
      return [
        `a ${unit} ${unit} 0 0 1 ${-unit} ${-unit}`,
        `l 0 ${-remainingHeight}`,
        `a ${unit} ${unit} 0 0 1 ${unit} ${-unit}`
      ];
    },
    rightPath: (block) => {
      const unit = block.edgeShapeWidth_;
      const remainingHeight = block.height - unit * 2;
      return [
        `a ${unit} ${unit} 0 0 1 ${unit} ${unit}`,
        `l 0 ${remainingHeight}`,
        `a ${unit} ${unit} 0 0 1 ${-unit} ${unit}`
      ];
    },
    edgeShapeWidth: (original) => {
      return Math.min(original, Blockly.BlockSvg.GRID_UNIT * 15 * Blockly.BlockSvg.REPORTER_HEIGHT_THRESHOLD)
    }
  }],
  [Blockly.OUTPUT_SHAPE_SQUARE, {
    emptyInputPath: "M 0 4 a 4 4 0 0 1 4 -4 h 40 a 4 4 0 0 1 4 4 v 24 a 4 4 0 0 1 -4 4 h -40 a 4 4 0 0 1 -4 -4 z",
    emptyInputWidth: 12 * Blockly.BlockSvg.GRID_UNIT,
    curvature: 1000,
    noEdgeShape: true
  }],
  [Blockly.OUTPUT_SHAPE_PLUS, {
    emptyInputPath: "M 36 0 a 4 4 0 0 1 4 4 l 0 2 a 4 4 0 0 0 4 4 a 4 4 0 0 1 4 4 l 0 4 a 4 4 0 0 1 -4 4 a 4 4 0 0 0 -4 4 l 0 2 a 4 4 0 0 1 -4 4  h -24 a 4 4 0 0 1 -4 -4 l 0 -2 a 4 4 0 0 0 -4 -4 a 4 4 0 0 1 -4 -4 l 0 -4 a 4 4 0 0 1 4 -4 a 4 4 0 0 0 4 -4 l 0 -2 a 4 4 0 0 1 4 -4 z",
    emptyInputWidth: 12 * Blockly.BlockSvg.GRID_UNIT,
    curvature: 1000,
    leftPath: (block) => {
      const paddingMultiplier = Blockly.BlockSvg.SEP_SPACE_Y / 2 / Blockly.BlockSvg.GRID_UNIT;
      const unit = 6 * paddingMultiplier;
      const remainingHeight = block.height - 36 * paddingMultiplier;
      return [
        `a ${unit} ${unit} 0 0 1 ${-unit} ${-unit}`,
        `a ${unit} ${unit} 0 0 0 ${-unit} ${-unit}`,
        `l -2 0`,
        `a ${unit} ${unit} 0 0 1 ${-unit} ${-unit}`,
        `l 0 ${-remainingHeight}`,
        `a ${unit} ${unit} 0 0 1 ${unit} ${-unit}`,
        `l 2 0`,
        `a ${unit} ${unit} 0 0 0 ${unit} ${-unit}`,
        `a ${unit} ${unit} 0 0 1 ${unit} ${-unit}`
      ]
    },
    rightPath: (block) => {
      const paddingMultiplier = Blockly.BlockSvg.SEP_SPACE_Y / 2 / Blockly.BlockSvg.GRID_UNIT;
      const unit = 6 * paddingMultiplier;
      const remainingHeight = block.height - 36 * paddingMultiplier;
      return [
        `a ${unit} ${unit} 0 0 1 ${unit} ${unit}`,
        `a ${unit} ${unit} 0 0 0 ${unit} ${unit}`,
        `l 2 0`,
        `a ${unit} ${unit} 0 0 1 ${unit} ${unit}`,
        `l 0 ${remainingHeight}`,
        `a ${unit} ${unit} 0 0 1 ${-unit} ${unit}`,
        `l -2 0`,
        `a ${unit} ${unit} 0 0 0 ${-unit} ${unit}`,
        `a ${unit} ${unit} 0 0 1 ${-unit} ${unit}`
      ]
    },
    edgeShapeWidth: (original) => {
      const paddingMultiplier = Blockly.BlockSvg.SEP_SPACE_Y / 2 / Blockly.BlockSvg.GRID_UNIT;
      const unit = 6 * paddingMultiplier;
      return unit * 3 + 2;
    }
  }],
  [Blockly.OUTPUT_SHAPE_OCTAGONAL, {
    emptyInputWidth: 12 * Blockly.BlockSvg.GRID_UNIT,
    curvature: 1000,
    leftPath: (block) => {
      const unit = Blockly.BlockSvg.GRID_UNIT * 2.5;
      const remainingHeight = block.height - unit * 2;
      return [
        `l ${-unit} ${-unit}`,
        `l 0 ${-remainingHeight}`,
        `l ${unit} ${-unit}`
      ]
    },
    rightPath: (block) => {
      const unit = Blockly.BlockSvg.GRID_UNIT * 2.5;
      const remainingHeight = block.height - unit * 2;
      return [
        `l ${unit} ${unit}`,
        `l 0 ${remainingHeight}`,
        `l ${-unit} ${unit}`
      ]
    },
    edgeShapeWidth: (original) => {
      return Blockly.BlockSvg.GRID_UNIT * 2.5;
    }
  }],
  [Blockly.OUTPUT_SHAPE_SCRAPPED, {
    emptyInputWidth: 12 * Blockly.BlockSvg.GRID_UNIT,
    curvature: 1000,
    unsafeEdges: true,
    leftPath: (block) => {
      const unit = block.edgeShapeWidth_;
      const remainingHeight = block.height - unit * 4;

      return [
        `l ${-unit} 0`,
        `l ${unit / 2} ${-unit}`,
        `l ${unit / 2} ${-unit / 4}`,
        `l ${-unit / 2} ${-unit / 4}`,
        `l 0 ${-unit - remainingHeight}`,
        `l ${unit / 2} ${-unit / 4}`,
        `l ${-unit / 2} ${-unit / 4}`,
        `l ${-unit / 2} ${-unit}`,
        `l ${unit} 0`,
      ];
    },
    rightPath: (block) => {
      const unit = block.edgeShapeWidth_;
      const remainingHeight = block.height - unit * 4;

      return [
        `l ${unit} 0`,
        `l ${-unit / 2} ${unit}`,
        `l ${-unit / 2} ${unit / 4}`,
        `l ${unit / 2} ${unit / 4}`,
        `l 0 ${unit + remainingHeight}`,
        `l ${-unit / 2} ${unit / 4}`,
        `l ${unit / 2} ${unit / 4}`,
        `l ${unit / 2} ${unit}`,
        `l ${-unit} 0`
      ];
    },
    edgeShapeWidth: (original) => {
      return Math.min(original / 2, Blockly.BlockSvg.GRID_UNIT * 5 * Blockly.BlockSvg.REPORTER_HEIGHT_THRESHOLD)
    }
  }]
]);

/**
 * Register a custom block shape.
 * @param {string} name The name used to identify custom shapes.
 * @param {object} shapeInfo All relative information for generating the shape.
 */
Blockly.BlockSvg.registerCustomShape = function(name, shapeInfo) {
  name = "custom-" + String(name);
  shapeInfo.name = name;

  if (!shapeInfo.emptyInputWidth) shapeInfo.emptyInputWidth = 12 * Blockly.BlockSvg.GRID_UNIT;

  if (shapeInfo.blockPaddingStart && shapeInfo.blockPaddingEnd) {
    shapeInfo.unsafeEdges = true
  } else if (shapeInfo.blockPaddingStart) {
    shapeInfo.unsafeEdges = {left: true};
  } else if (shapeInfo.blockPaddingEnd) {
    shapeInfo.unsafeEdges = {right: true};
  }

  Blockly.BlockSvg.CUSTOM_SHAPES.set(name, shapeInfo);
};
