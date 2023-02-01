const { defineBlocksWithJsonArray } = Blockly;

var deviceList = [
    [
        "---",
        "null"
    ]
];
var pointList = [
    [
        "---",
        "null"
    ]
];
//获取设备列表
dispatch({
    url: `${deviceUrl}/enginConfigure/equipConfigureManger/getAllEquipConfigureList`
}).then(res => {
    res.data.map(function (item) {
        deviceList.push([
            item.name,
            item.id.toString()
        ])
    })
})

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
                "name": "DEVICE",
                "options": deviceList,
            },
            {
                "type": "field_dropdown",
                "name": "POINT",
                "options": pointList,
                // "options":function(){
                //     return new Promise(function(resolve){
                //         setTimeout(function(){
                //             resolve(pointList)
                //         },2000)
                //     })
                // },
            }
        ],
        "output": "Number",
        "colour": 225,
        "tooltip": "读取设备点位值",
        "helpUrl": "null",
        "extensions": ["optionsOnchange"],
    }, {
        "type": "send_point_block",
        "lastDummyAlign0": "CENTRE",
        "message0": "下发设备点位值 %1 设备 %2 点位 %3 值 %4",
        "args0": [
            {
                "type": "input_dummy",
                "align": "CENTRE"
            },
            {
                "type": "field_dropdown",
                "name": "DEVICE",
                "options": deviceList
            },
            {
                "type": "field_dropdown",
                "name": "POINT",
                "options": pointList
            },
            {
                "type": "input_value",
                "name": "VALUE",
                "check": "Number"
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 135,
        "tooltip": "下发设备点位值",
        "helpUrl": "null",
        "extensions": ["optionsOnchange"],
    }, {
        "type": "sleep_block",
        "message0": "延迟 %1 毫秒数 %2",
        "args0": [
            {
                "type": "input_dummy",
                "align": "CENTRE"
            },
            {
                "type": "input_value",
                "name": "TIME",
                "check": "Number",
                "align": "CENTRE"
            }
        ],
        "inputsInline": true,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "延迟",
        "helpUrl": "null"
    }, {
        "type": "listen_time_value_block",
        "message0": "保持 %1 逻辑 %2 在毫秒数 %3",
        "args0": [
            {
                "type": "input_dummy",
                "align": "CENTRE"
            },
            {
                "type": "input_value",
                "name": "LOGIC",
                "check": "Boolean",
                "align": "CENTRE"
            },
            {
                "type": "input_value",
                "name": "TIME",
                "check": "Number"
            }
        ],
        "inputsInline": false,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "监听时间内值变化",
        "helpUrl": "null"
    },
    {
        "type": "listen_time_judge_value_block",
        "message0": "监听 %1 逻辑 %2 在毫秒数 %3 有变化 %4 执行 %5 无变化 %6 执行 %7",
        "args0": [
            {
                "type": "input_dummy",
                "align": "CENTRE"
            },
            {
                "type": "input_value",
                "name": "LOGIC",
                "check": "Boolean",
                "align": "CENTRE"
            },
            {
                "type": "input_value",
                "name": "TIME",
                "check": "Number",
                "align": "CENTRE"
            },
            {
                "type": "input_dummy",
                "align": "CENTRE"
            },
            {
                "type": "input_statement",
                "name": "FALSE_FUNCTION",
                "align": "CENTRE"
            },
            {
                "type": "input_dummy",
                "align": "CENTRE"
            },
            {
                "type": "input_statement",
                "name": "TRUE_FUNCTION"
            }
        ],
        "inputsInline": false,
        "previousStatement": null,
        "nextStatement": null,
        "colour": 45,
        "tooltip": "null",
        "helpUrl": "null"
    },
    {
        "type": "warn_block",
        "lastDummyAlign0": "CENTRE",
        "message0": "告警 %1",
        "args0": [
          {
            "type": "field_input",
            "name": "WARN_NAME",
            "text": "名称"
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 0,
        "tooltip": "",
        "helpUrl": ""
      }

]);

Blockly.Extensions.register('optionsOnchange', function () {
    if (this.getField("DEVICE").value_ != 'null') {
        try {
            const DEVICE = this.getField("DEVICE").value_;
            let POINTITEM = [
                [
                    "---",
                    "null"
                ]
            ];
            let workspace = demoWorkspace.getBlockById(this.id);
            const POINT_EL = workspace.getField("POINT");
            subscription.push(Number(POINT_EL.value_));
            dispatch({
                url: `${deviceUrl}/enginConfigure/equipConfigureManger/getAllPointConfigureList`,
                params: {
                    id: DEVICE
                }
            }).then(res => {
                let pointList = [[
                    "---",
                    "null"
                ]
                ];
                  res.data.map(function (item) {
                    if(workspace.type ===   "send_point_block"){
                        if(item.type === 3){
                            pointList.push([
                                item.name,
                                item.dataSource.toString()
                              ])
                        }
                    }else{
                      pointList.push([
                        item.name,
                        item.dataSource.toString()
                      ])
                    }
                  })
                POINT_EL.menuGenerator_ = pointList;
                //   POINT_EL.selectedOption_ = POINTITEM ;
                POINT_EL.setValue(POINT_EL.value_);
            })
        } catch (err) {

        }
    }
}, true);






