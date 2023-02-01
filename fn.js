var OP_to_text = {
    EQ: '等于',
    NEQ: '不等于',
    LT: '小于',
    LTE: '小于等于',
    GT: '大于',
    GTE: '大于等于',
}
var BOL_to_text = {
    FALSE_FUNCTION: '有变化',
    TRUE_FUNCTION: '无变化',
}

const spliceText = function (p, block, type) {
    let obj = null;
    function judgeBlock(obj){
        switch (obj.type) {
            case "logic_compare":
                var _DEVICE = obj.getInputTargetBlock('A').getFieldName('DEVICE'),
                    _POINT = obj.getInputTargetBlock('A').getFieldName('POINT'),
                    _NUM = obj.getInputTargetBlock('B').getFieldValue('NUM'),
                    _OP = OP_to_text[obj.getFieldValue('OP')],
                    _BOL = BOL_to_text[p.getInputWithBlock(block).name] || ""
                    // TODO  AND OP  ...
                    ;
                    return  `${_DEVICE}-${_POINT}(值${_OP} ${_NUM}) ${_BOL}`;
                break;
                default:
                    return "";
                break;
        }
    }
    switch (type) {
        case "controls_if":
            obj = p.getInputTargetBlock('IF0');
            break;
        case "listen_time_judge_value_block":
            obj = p.getInputTargetBlock('LOGIC');
            break;
    }
    return judgeBlock(obj || {});
}


var params_id = getUrlParams('id');
var params_rbacToken = getUrlParams('rbacToken');
var warnObject = {
    warnList: [],
    changeValue: function (id, value, name) {
        const idx = this.warnList.findIndex(item => item.warnId === id);
        if (idx >= 0) {
            this.warnList[idx][name] = value;
        }
    },
    pushOrChange: function (obj) {
        const idx = this.warnList.findIndex(item => item.warnId === obj.warnId);
        if (idx === -1) {
            this.warnList.push(obj);
        } else {
            Object.assign(this.warnList[idx], {
                ...obj
            })
        }
    },
    remove: function (id) {
        const idx = this.warnList.findIndex(item => item.warnId === id);
        if (idx >= 0) {
            //判断是否能够被删除,需要查表
            this.warnList.splice(idx, 1);
        }
    }
}
function getParentBlockItem(block) {
    const _p = block.getSurroundParent();
    var text;
    if (_p) {
        switch (_p.type) {
            case "controls_if":
                text = spliceText(_p, block, _p.type);
                warnObject.pushOrChange({
                    warnId: block.id,
                    warnName: block.getFieldValue('WARN_NAME'),
                    warnText: text
                })
                break;
            case "listen_time_judge_value_block":
                //找到逻辑判断
                text = spliceText(_p, block, _p.type);
                warnObject.pushOrChange({
                    warnId: block.id,
                    warnName: block.getFieldValue('WARN_NAME'),
                    warnText: text
                })
                break;
            case "listen_time_value_block":
                warnObject.pushOrChange({
                    warnId: block.id,
                    warnName: block.getFieldValue('WARN_NAME'),
                })
                break;
            case "sleep_block":
                warnObject.pushOrChange({
                    warnId: block.id,
                    warnName: block.getFieldValue('WARN_NAME'),
                })
                break;
        }
    } else {
        //单个插入告警也在此
        warnObject.pushOrChange({
            warnId: block.id,
            warnName: block.getFieldValue('WARN_NAME'),
            warnText: ""
        })
    }
}

function setStyle(obj, json) {
    for (var i in json) {
        obj.style[i] = json[i];
    }
}

// 获取数组的params字段默认用来获取rbacToken;
function getUrlParams(name) {
    const url2 = window.location.href;
    const temp2 = url2.split('?')[1];
    const pram2 = new URLSearchParams(`?${temp2}`);
    let data = pram2.get(name);
    if (!data) return '';
    if (data.indexOf('#/') >= 0) {
        data = data.split('#/')[0];
    }
    return data;
};
async function LOADPOINT(id) {
    return new Promise(function (resolve) {
        try {
            let _value = null;
            for (const item of subscription.receiveData.pointData) {
                if (Number(item.id) == Number(id)) {
                    _value = item.value;
                    break;
                }
            }
            resolve(_value);
        } catch (err) {
            resolve(null);
        }
    })
}

async function SETPOINTVALUE(id, value) {
    return new Promise(function (resolve) {
        dispatch({
            url: `${sendUrl}/data_collect/point/issuedPoint`,
            method: "POST",
            params: {
                pointId: id,
                value: value
            }
        }).then(res => {
            resolve(res)
        })
    })
}

async function SLEEP(TIME) {
    return new Promise(function (res) {
        var timer = setTimeout(function () {
            res(null)
        }, TIME)
    })
}

function SENDWARN(blockId) {
    return new Promise(function (res) {
        dispatch({
            url: `${warnUrl}/bs/system/insertSystemAlarmLogs`,
            method: "POST",
            params: {
                type: 1,
                warnId: blockId
            }
        }).then(res => {
            res(blockId)
        }).catch(function (err) {
            res(blockId)
        });
    })


}

function RESETWARNACTION(olist, nlist) {
    let _ids = [];
    olist.map((item) => {
        if (nlist.indexOf(item.warnId) === -1) {
            _ids.push(item.warnId)
        }
    })
    dispatch({
        url: `${warnUrl}/bs/system/insertSystemAlarmLogs`,
        method: "POST",
        params: {
            type: 2,
            warnId: _ids.join(',')
        }
    }).then(res => {
    }).catch(function (err) {
        return err;
    });
    return blockId;
}



const importJson = function (id, demoWorkspace) {
    dispatch({
        url: "/evalCode/getSCheduleBlockly",
        method: "GET",
        params: {
            id: id,
        }
    }).then(res => {
        var state = JSON.parse(res.data.scheduleJson);
        warnObject.warnList = res.data.warnList;
        Blockly.serialization.workspaces.load(state, demoWorkspace);
    })
}

const saveJson = function (id, json, code, demoWorkspace) {
    dispatch({
        url: "/evalCode/saveSCheduleBlockly",
        method: "POST",
        params: {
            id: id,
            scheduleJson: json,
            codeData: code,
            socketList: subscription.socketList.join(','),
            warnList: Array.from(new Set(warnObject.warnList)),
        }
    }).then(res => {
        alert(res.message || res.data)
    })
}

const runJson = function (id, json, demoWorkspace) {
    dispatch({
        url: "/control-module/schedule/runSchedule",
        method: "GET",
        params: {
            id: id,
        }
    }).then(res => {
        alert(res.message)
        if (!res.success) {

        } else {

        }
    })
}


const saveEval = function (code) {
    dispatch({
        url: "/evalCode/eval",
        method: "POST",
        params: {
            code: code
        }
    }).then(res => {
        alert(res.message || res.data)
    })
}
const createSChedule = function (code) {
    dispatch({
        url: "/evalCode/createSChedule",
        method: "POST",
        params: {
            id: 1,
            name: "test",
            execute: 1,
            describe: "测试",
            triggerState: 3,// 1 执行一次还是 2循环 3 时间段循环,
            daySetting: "1,2,3,4,5", //周,号分割  1-7
            timeSetting: "12:57-16:00", //时间段,号分割
            code: code,
            loopState: 1, //1执行一次 2 一直循环
        }
    }).then(res => {
        alert(res.message || res.data)
    })
}
const updateSChedule = function (code) {
    dispatch({
        url: "/evalCode/updateSChedule",
        method: "POST",
        params: {
            id: 1,
            name: "test",
            execute: 1,
            describe: "测试",
            triggerState: 3,// 1 执行一次还是 2循环 3 时间段循环,
            daySetting: "1,2,3,4", //周,号分割  1-7
            timeSetting: "17:05-17:06", //时间段,号分割
            code: code,
            loopState: 1, //1执行一次 2 一直循环
        }
    }).then(res => {
        alert(res.message || res.data)
    })
}
const stopSChedule = function (code) {
    dispatch({
        url: "/evalCode/stopSChedule",
        method: "POST",
        params: {
            id: 1,
            name: "test",
            execute: 1,
            describe: "测试",
            triggerState: 3,// 1 执行一次还是 2循环 3 时间段循环,
            daySetting: "1,2,3,4", //周,号分割  1-7
            timeSetting: "17:05-17:06", //时间段,号分割
            code: code,
            loopState: 1, //1执行一次 2 一直循环
        }
    }).then(res => {
        alert(res.message || res.data)
    })
}
const deleteSChedule = function (code) {
    dispatch({
        url: "/evalCode/deleteSCheduleList",
        method: "POST",
        params: {
            id: "1,2,3",
        }
    }).then(res => {
        alert(res.message || res.data)
    })
}




function hide_blocklyFlyout() {
    document.getElementsByClassName("blocklyFlyout")[1].style.transform = "translate(0px, 0px)";
    document.getElementsByClassName("blocklyFlyout")[1].setAttribute("width", 0);
    document.getElementById("scrollBox").style.display = "none";
    document.getElementsByClassName("font-big")[0] && document.getElementsByClassName("font-big")[0].classList.remove("font-big");
}


