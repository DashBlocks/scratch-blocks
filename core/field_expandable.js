/**
 * Taken from PenguinMod "The Port"
 * https://github.com/PenguinMod-Port/scratch-blocks/blob/develop/core/field_expandable.js
 */

'use strict';

goog.provide('Blockly.FieldExpandable');

goog.require('Blockly.Field');
goog.require('Blockly.BlockSvg');
goog.require('Blockly.BlockSvg.render');

/**
 * Class for a button field.
 * @param {object} state Unused.
 * @param {Function=} opt_validator A function that is executed.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldExpandable = function(value, opt_min = 1, opt_max = Infinity) {
  this.size_ = new goog.math.Size(
    Blockly.BlockSvg.FIELD_WIDTH,
    Blockly.BlockSvg.FIELD_HEIGHT);
  this.setText('0');
  this.showWhenCollapsed_ = false;

  this.arrowWidth_ = 0;
  this.addArgType('button');
  this.min = opt_min;
  this.max = opt_max;

  this.tempValue_ = value;
};
goog.inherits(Blockly.FieldExpandable, Blockly.Field);

/**
 * Construct a FieldExpandable from a JSON arg object.
 * @param {!Object} options A JSON object with options.
 * @returns {!Blockly.FieldExpandable} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldExpandable.fromJson = function(options) {
  return new Blockly.FieldExpandable(options['value'], options['min'], options['max']);
};

/**
 * Mouse cursor style when over the button.
 */
Blockly.FieldExpandable.prototype.CURSOR = 'pointer';

/**
 * Icon used by Add button
 */
Blockly.FieldExpandable.ADD_IMAGE = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDEyIDEyIj48ZyBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTEuOTAzIDguNDRDLjg1MSA4LjQ0IDAgNy41MzYgMCA2LjQxOXYtLjgzN2MwLTEuMTE2Ljg1Mi0yLjAyMSAxLjkwMy0yLjAyMWgxLjY1NlYxLjkwM0MzLjU1OS44NTEgNC40NjUgMCA1LjU4MSAwaC44MzdjMS4xMTYgMCAyLjAyMS44NTIgMi4wMjEgMS45MDN2MS42NTZoMS42NTdjMS4wNTIgMCAxLjkwMy45MDYgMS45MDMgMi4wMjJ2LjgzN2MwIDEuMTE2LS44NTIgMi4wMjEtMS45MDMgMi4wMjFIOC40NDF2MS42NTdjMCAxLjA1Mi0uOTA2IDEuOTAzLTIuMDIyIDEuOTAzaC0uODM3Yy0xLjExNiAwLTIuMDIxLS44NTItMi4wMjEtMS45MDNWOC40NDF6IiBmaWxsLW9wYWNpdHk9Ii4xMDIiIGZpbGw9IiMyNDIwMjEiLz48cGF0aCBkPSJNMi4yMjggNy41OThBMS40MjcgMS40MjcgMCAwIDEgLjgwMSA2LjE3MVY1LjgzYTEuNDI3IDEuNDI3IDAgMCAxIDEuNDI3LTEuNDI3aDIuMTc0VjIuMjI4QTEuNDI3IDEuNDI3IDAgMCAxIDUuODI5LjgwMWguMzQxYTEuNDI3IDEuNDI3IDAgMCAxIDEuNDI3IDEuNDI3djIuMTc0aDIuMTc0YTEuNDI3IDEuNDI3IDAgMCAxIDEuNDI3IDEuNDI3di4zNDFhMS40MjcgMS40MjcgMCAwIDEtMS40MjcgMS40MjdINy41OTh2Mi4xNzRhMS40MjcgMS40MjcgMCAwIDEtMS40MjcgMS40MjdINS44M2ExLjQyNyAxLjQyNyAwIDAgMS0xLjQyNy0xLjQyN1Y3LjU5OHoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+";

/**
 * Icon used by Remove button
 */
Blockly.FieldExpandable.REMOVE_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMiIgaGVpZ2h0PSI0Ljg4IiB2aWV3Qm94PSIwIDAgMTIgNC44OCI+PGcgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0xLjkwMyA0Ljg4Qy44NTEgNC44OCAwIDMuOTc2IDAgMi44NTl2LS44MzdDMCAuOTA1Ljg1MiAwIDEuOTAzIDBoOC4xOTNjMS4wNTIgMCAxLjkwMy45MDQgMS45MDMgMi4wMjF2LjgzN2MwIDEuMTE2LS44NTIgMi4wMjEtMS45MDMgMi4wMjF6IiBmaWxsLW9wYWNpdHk9Ii4xMDIiIGZpbGw9IiMyNDIwMjEiLz48cGF0aCBkPSJNMi4yMjggNC4wMzhBMS40MjcgMS40MjcgMCAwIDEgLjgwMSAyLjYxMVYyLjI3QTEuNDI3IDEuNDI3IDAgMCAxIDIuMjI4Ljg0M2g3LjU0NGExLjQyNyAxLjQyNyAwIDAgMSAxLjQyNyAxLjQyN3YuMzQxYTEuNDI3IDEuNDI3IDAgMCAxLTEuNDI3IDEuNDI3eiIgZmlsbD0iI2ZmZiIvPjwvZz48L3N2Zz4=';

/**
 * Install this button on a block.
 */
Blockly.FieldExpandable.prototype.init = function() {
  if (this.fieldGroup_) {
    // Button has already been initialized once.
    return;
  }
  Blockly.FieldExpandable.superClass_.init.call(this);

  this.textElement_.style.display = "none";

  this.size_.height = Blockly.BlockSvg.FIELD_HEIGHT * 0.75;
  const ratio = this.size_.height / 32;

  if (!this.sourceBlock_.isInsertionMarker()) {
    var addGroup = Blockly.utils.createSvgElement('g', {}, null);
    Blockly.utils.createSvgElement('rect', {
      'x': this.size_.height + Blockly.BlockSvg.GRID_UNIT,
      'y': 0,
      'rx': 4,
      'ry': 4,
      'width': this.size_.height,
      'height': this.size_.height,
      'fill': "#00000000",
      'stroke': this.sourceBlock_.getColourTertiary(),
      'cursor': this.CURSOR
    }, addGroup);
    Blockly.utils.createSvgElement('image', {
      'x': 5 * ratio + this.size_.height + Blockly.BlockSvg.GRID_UNIT,
      'y': 5 * ratio,
      'width': this.size_.height / 1.5,
      'height': this.size_.height / 1.5,
      'xlink:href': Blockly.FieldExpandable.ADD_IMAGE,
      'href': Blockly.FieldExpandable.ADD_IMAGE,
    }, addGroup);
    Blockly.bindEventWithChecks_(addGroup, 'mouseup', this, function() {return !this.sourceBlock_.isInFlyout && !this.sourceBlock_.workspace.isDragging() &&
      this.setValue(Number(this.getValue()) + 1);});
    this.fieldGroup_.insertBefore(addGroup, this.textElement_);

    var removeGroup = Blockly.utils.createSvgElement('g', {}, null);
    Blockly.utils.createSvgElement('rect', {
      'x': 0,
      'y': 0,
      'rx': 4,
      'ry': 4,
      'width': this.size_.height,
      'height': this.size_.height,
      'fill': "#00000000",
      'stroke': this.sourceBlock_.getColourTertiary(),
      'cursor': this.CURSOR
    }, removeGroup);
    Blockly.utils.createSvgElement('image', {
      'x': 5 * ratio,
      'y': 5 * ratio,
      'width': this.size_.height / 1.5,
      'height': this.size_.height / 1.5,
      'xlink:href': Blockly.FieldExpandable.REMOVE_IMAGE,
      'href': Blockly.FieldExpandable.REMOVE_IMAGE,
    }, removeGroup);
    Blockly.bindEventWithChecks_(removeGroup, 'mouseup', this, function() {return !this.sourceBlock_.isInFlyout && !this.sourceBlock_.workspace.isDragging() &&
      this.setValue(Number(this.getValue()) - 1);});
    this.fieldGroup_.insertBefore(removeGroup, this.textElement_);
  }

  this.setValue(Number(this.getValue()) || this.tempValue_, true);
};

Blockly.FieldExpandable.prototype.setValue = function(value, firstRun = false) {
  if (value == null) {
    return;
  }

  let oldValue = Number(this.getValue());
  let newValue = Math.max(Math.min(this.max, value), this.min);
  if (oldValue == newValue) {
    return;
  }

  Blockly.Events.setGroup(true);

  Blockly.Field.prototype.setValue.call(this, newValue);

  if (this.sourceBlock_ && this.sourceBlock_.expandableCallback) {
      this.sourceBlock_.expandableCallback(this, oldValue, newValue, !firstRun);
  }

  Blockly.Events.setGroup(false);
};

Blockly.FieldExpandable.prototype.updateWidth = function() {
  this.size_.width = this.size_.height * 2 + Blockly.BlockSvg.GRID_UNIT;
}

// dont do anything this is handled manually
Blockly.FieldExpandable.prototype.showEditor_ = function() {};

Blockly.Field.register('field_expandable', Blockly.FieldExpandable);
