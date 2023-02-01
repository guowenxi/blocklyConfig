/**
 * @license
 * Copyright 2012 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Colour blocks for Blockly.
 */
'use strict';

goog.module('Blockly.blocks.device');

const {defineBlocksWithJsonArray} = goog.require('Blockly.common');
/** @suppress {extraRequire} */

defineBlocksWithJsonArray([
  {
    "type": "load_point_block",
    "lastDummyAlign0": "CENTRE",
    "message0": "读取设备点位值 %1 设备 %2 点位 %3",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_dropdown",
        "name": "device",
        "options": [
          [
            "option",
            "OPTIONNAME"
          ],
          [
            "option",
            "OPTIONNAME"
          ],
          [
            "option",
            "OPTIONNAME"
          ]
        ]
      },
      {
        "type": "field_dropdown",
        "name": "value",
        "options": [
          [
            "option",
            "OPTIONNAME"
          ],
          [
            "option",
            "OPTIONNAME"
          ],
          [
            "option",
            "OPTIONNAME"
          ]
        ]
      }
    ],
    "output": "String",
    "colour": 225,
    "tooltip": "读取设备点位值",
    "helpUrl": "null"}
]);
