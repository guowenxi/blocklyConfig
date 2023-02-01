
Blockly.JavaScript['load_point_block'] = function (block) {
    var DEVICE = block.getFieldValue('DEVICE');
    var POINT = block.getFieldValue('POINT');
    // TODO: Assemble JavaScript into code variable.
    var code = `
    await _this.LOADPOINT('${POINT}')
    \n
    `;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['send_point_block'] = function (block) {
    var DEVICE = block.getFieldValue('DEVICE');
    var POINT = block.getFieldValue('POINT');
    var VALUE = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = `
    await _this.SETPOINTVALUE('${POINT}','${VALUE}')
    \n`
        ;
    return code;
};

Blockly.JavaScript['sleep_block'] = function (block) {
    var TIME = Blockly.JavaScript.valueToCode(block, 'TIME', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = `
    var _sleep  = await _this.SLEEP(${TIME || 0})
    \n`;
    return code;
};
Blockly.JavaScript['listen_time_value_block'] = function (block) {
    var LOGIC = Blockly.JavaScript.valueToCode(block, 'LOGIC', Blockly.JavaScript.ORDER_ATOMIC);
    var TIME = Blockly.JavaScript.valueToCode(block, 'TIME', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var interval_fn = Blockly.JavaScript.provideFunction_("interval_fn", [
        `async function HOLDVALUEINTIME(TIME) {
            var bol ;
            var end_num = (new Date().getTime()) + TIME;
            async function timer_fn() {
                return new Promise(async function (resolve) {
                    const __res = ${LOGIC || null};
                    resolve(__res)
                })
            }
            return new Promise(async function (res) {
                var now_num = new Date().getTime();
                while(end_num > now_num && state){
                    bol = await timer_fn();
                    if(!bol){
                        end_num = (new Date().getTime()) + TIME;
                    }
                    now_num = new Date().getTime();
                    if(end_num <= now_num) res(true);
                }
            });
        }
        `
    ])
    var code = `var _interval = await HOLDVALUEINTIME(${TIME || 0});
    console.log("完毕");
    \n`;
    return code;
};

Blockly.JavaScript['listen_time_judge_value_block'] = function (block) {
    var LOGIC = Blockly.JavaScript.valueToCode(block, 'LOGIC', Blockly.JavaScript.ORDER_ATOMIC);
    var TIME = Blockly.JavaScript.valueToCode(block, 'TIME', Blockly.JavaScript.ORDER_ATOMIC);
    var FALSE_FUNCTION = Blockly.JavaScript.statementToCode(block, 'FALSE_FUNCTION'); //有变化
    var TRUE_FUNCTION = Blockly.JavaScript.statementToCode(block, 'TRUE_FUNCTION'); //无变化
    // TODO: Assemble JavaScript into code variable.
    var interval_fn = Blockly.JavaScript.provideFunction_("listen_change_fn", [
        `async function LISTENVALUECHANGEINTIME(TIME) {
            var bol ;
            var end_num = (new Date().getTime()) + TIME;
            async function timer_fn() {
                return new Promise(async function (resolve) {
                    const __res = ${LOGIC || null};
                        resolve(__res)
                })
            }
            return new Promise(async function (res) {
                var now_num = new Date().getTime();
                while(end_num > now_num && state){
                    bol = await timer_fn();
                    if(!bol){
                        res(false);
                        return;
                    }
                    now_num = new Date().getTime();
                    if(end_num <= now_num) res(true);
                }
            });
        }`
    ])
    var code = `var _listen_bol = await LISTENVALUECHANGEINTIME(${TIME || 0}); \n
    if(!_listen_bol){
        ${FALSE_FUNCTION}
    }else{
        ${TRUE_FUNCTION}
    }
    `
    return code;
};

Blockly.JavaScript['warn_block'] = function (block) {
    var text_warn_name = block.getFieldValue('WARN_NAME');
    var code = `
    console.warn('${text_warn_name} -- 告警');
    var wranId = await _this.SENDWARN('${block.id || null}');
    WARNINGLIST.push(wranId);
    \n`;
    return code;
};