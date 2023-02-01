var timeoutNumber = 999;
var state = false;
function setDefault() {
  document.getElementById("devjs").innerText = "运行";
  state = false;
  demoWorkspace.highlightBlock(null);
  new AbortController().abort();
  for (var i = 0; i < timeoutNumber; i++) {
    clearTimeout(i)
  }
}
function returnFn() {
  if (state === false) {
    if (rush) { return }
  }
}

var demoWorkspace = Blockly.inject('blocklyDiv',
  {
    media: './media/',
    toolbox: document.getElementById('toolbox')
  });

//代码块高亮
//在代码块之前
Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
Blockly.JavaScript.addReservedWords('highlightBlock');
function highlightBlock(id) {
  demoWorkspace.highlightBlock(!state ? null : id);
}



//通过id获取json
if (params_id != '') importJson(params_id, demoWorkspace);
window.addEventListener('message', function (e) {
  const { id } = e.data.params;
  params_id = id;
  setDefault();
  importJson(id, demoWorkspace)
})
Blockly.getMainWorkspace().addChangeListener(function (changeEvent) {
  const { blockId, type, newElementId, newValue ,oldJson ,group } = changeEvent;
  // console.log(Blockly.getMainWorkspace().getBlockById("!]T(.[b3d~zBsy#NM9U=").childBlocks_)
  
  switch (type) {
    case Blockly.Events.COMMENT_CHANGE:
      break;
    case Blockly.Events.DELETE:
      if(oldJson.type === 'warn_block'){
        warnObject.remove(blockId)
      }
      break;
    case Blockly.Events.BLOCK_DRAG:
      const block =  Blockly.getMainWorkspace().getBlockById(blockId);
      if(block){
        switch(block.type){
          case "warn_block":
            getParentBlockItem(block)
          break;
        }
      }
      break;
    case Blockly.Events.CLICK:
      hide_blocklyFlyout();
      break;
    case "create":
      // try {
      //   const { DEVICE, POINT } = changeEvent.json.fields;
      //   let workspace = demoWorkspace.getBlockById(blockId);
      //   const POINT_EL = workspace.getField("POINT");
      //   dispatch({
      //     url: "/service/joint/getAllReadPoints",
      //     params: {
      //       id: DEVICE
      //     }
      //   }).then(res => {
      //     let pointList = [];
      //     res.data.map(function (item) {
      //       pointList.push([
      //         item.name,
      //         item.id
      //       ])
      //     })
      //     POINT_EL.menuGenerator_ = pointList;
      //     POINT_EL.setValue(POINT);
      //   })
      // } catch (err) {

      // }
      break;
    case "selected":
      // const a = demoWorkspace.getBlockById(newElementId);
      // if(a){
      //     const DEVICE_EL = a.getField("DEVICE");
      //     //menuGenerator_ 这个字段可以直接修改
      //     console.log(DEVICE_EL);
      // }
      break;
    case Blockly.Events.BLOCK_CHANGE:
      let workspace = demoWorkspace.getBlockById(blockId);
      if (changeEvent.name === "POINT") {
        const POINT_EL = workspace.getField("POINT");
        subscription.push(Number(POINT_EL.value_));
        return ;
      }
      if (changeEvent.name === "WARN_NAME") {
        const WARN_NAME_EL = workspace.getField("WARN_NAME");
        warnObject.changeValue(blockId,WARN_NAME_EL.value_,'warnName');
        return ;
      }

      if (changeEvent.name === "DEVICE") {
        const POINT_EL = workspace.getField("POINT");
        dispatch({
          url: `${deviceUrl}/enginConfigure/equipConfigureManger/getAllPointConfigureList`,
          params: {
            id: newValue
          }
        }).then(res => {
          let pointList = [
            ["---", "null"]
          ];
          res.data.map(function (item) {
            if (workspace.type === "send_point_block") {
              if (item.type === 3) {
                pointList.push([
                  item.name,
                  item.dataSource.toString()
                ])
              }
            } else {
              pointList.push([
                item.name,
                item.dataSource.toString()
              ])
            }
          })
          POINT_EL.menuGenerator_ = pointList;
          POINT_EL.setValue("null");
        return;
      })
    }
      break;
    case "finished_loading":
      break;
  }

  Blockly.getMainWorkspace().render();


});

// document.getElementById("cancel").onclick = function () {

// }
document.getElementById("save").onclick = function () {
  var state = Blockly.serialization.workspaces.save(demoWorkspace);
  var value = JSON.stringify(state, null, 2);
  var code = Blockly['JavaScript'].workspaceToCode(demoWorkspace);
  saveJson(params_id, value, code, demoWorkspace)
}
// document.getElementById("saveEval").onclick = function () {
//   var value = Blockly['JavaScript'].workspaceToCode(demoWorkspace);
//   console.log(value);
//   saveEval(value)
// }
// document.getElementById("createSChedule").onclick = function () {
//   var value = Blockly['JavaScript'].workspaceToCode(demoWorkspace);
//   createSChedule(value)
// }
// document.getElementById("updateSChedule").onclick = function () {
//   var value = Blockly['JavaScript'].workspaceToCode(demoWorkspace);
//   updateSChedule(value)
// }
// document.getElementById("stopSChedule").onclick = function () {
//   var value = Blockly['JavaScript'].workspaceToCode(demoWorkspace);
//   stopSChedule(value)
// }

// document.getElementById("deleteSChedule").onclick = function () {
//   var value = Blockly['JavaScript'].workspaceToCode(demoWorkspace);
//   deleteSChedule(value)
// }


// // document.getElementById("run").onclick = function(){
// //   runJson(params_id)
// // }
// document.getElementById("clear").onclick = function(){
//   var state = JSON.parse("{}");
//   Blockly.serialization.workspaces.load(state, demoWorkspace);
// }

//   document.getElementById("import").onclick = function () {
//     var data = `{
//   "blocks": {
//     "languageVersion": 0,
//     "blocks": [
//       {
//         "type": "sleep_block",
//         "id": "ers5+j$Gd$)TRw.)udM/",
//         "x": 161,
//         "y": 175,
//         "inputs": {
//           "TIME": {
//             "block": {
//               "type": "math_number",
//               "id": "CEcX[V+T:A!Cb_}6(VCx",
//               "fields": {
//                 "NUM": 10000
//               }
//             }
//           }
//         },
//         "next": {
//           "block": {
//             "type": "listen_time_judge_value_block",
//             "id": "!]T(.[b3d~zBsy#NM9U=",
//             "inputs": {
//               "LOGIC": {
//                 "block": {
//                   "type": "logic_compare",
//                   "id": "PbzCs:y:O,r*PvM$:u1p",
//                   "fields": {
//                     "OP": "EQ"
//                   },
//                   "inputs": {
//                     "A": {
//                       "block": {
//                         "type": "load_point_block",
//                         "id": ";Y%qPpxMVR6T1bpqpry1",
//                         "fields": {
//                           "DEVICE": "01d39c110c404f1b8d1d9d40dcc6e80f",
//                           "POINT": "98f13149fb614a868455dd37a61b1458"
//                         }
//                       }
//                     },
//                     "B": {
//                       "block": {
//                         "type": "math_number",
//                         "id": "~p|NI*X@Qk}1Qy0i~abB",
//                         "fields": {
//                           "NUM": 1
//                         }
//                       }
//                     }
//                   }
//                 }
//               },
//               "TIME": {
//                 "block": {
//                   "type": "math_number",
//                   "id": "{zL30ULLq14@)Zn:uY(i",
//                   "fields": {
//                     "NUM": 5000
//                   }
//                 }
//               },
//               "FALSE_FUNCTION": {
//                 "block": {
//                   "type": "send_point_block",
//                   "id": "wcTa9=oO9P-Cm1aJ6DiX",
//                   "fields": {
//                     "DEVICE": "01d39c110c404f1b8d1d9d40dcc6e80f",
//                     "POINT": "98f13149fb614a868455dd37a61b1458"
//                   },
//                   "inputs": {
//                     "VALUE": {
//                       "block": {
//                         "type": "math_number",
//                         "id": "wrTUifYIB%|otr==(^pX",
//                         "fields": {
//                           "NUM": 1
//                         }
//                       }
//                     }
//                   }
//                 }
//               },
//               "TRUE_FUNCTION": {
//                 "block": {
//                   "type": "send_point_block",
//                   "id": "kErCX/}X{M%fi9aXfgs=",
//                   "fields": {
//                     "DEVICE": "01d39c110c404f1b8d1d9d40dcc6e80f",
//                     "POINT": "98f13149fb614a868455dd37a61b1458"
//                   },
//                   "inputs": {
//                     "VALUE": {
//                       "block": {
//                         "type": "math_number",
//                         "id": "p:+p22X~pUmg_@z2e;d",
//                         "fields": {
//                           "NUM": 0
//                         }
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     ]
//   }
// }`;
//     var state = JSON.parse(data);
//     Blockly.serialization.workspaces.load(state, demoWorkspace);
//   }


document.getElementById("devjs").onclick = function () {

  switch (state) {
    case true:
      setDefault();
      break;
    case false:
      document.getElementById("devjs").innerText = "停止";
      state = true;
      var value = Blockly['JavaScript'].workspaceToCode(demoWorkspace);
      subscription.emit();
      var templete = `
    const _this = window;
    var WARNINGLIST = [] ;
    try{
      async function start(){
        ${value}
      };
      start()
      console.log(WARNINGLIST);
      _this.RESETWARNACTION(${warnObject.warnList},WARNINGLIST)
    }catch(err){
      subscription.remove();
      // console.log(err);
    };`;
      console.log(templete);
      // var myInterpreter = new Interpreter(templete);
      // myInterpreter.run();
      setTimeout(()=>{
        eval(templete);
      },1000)
      break;
  }

}




//   //控制循环溢出
//   window.LoopTrap = 1000;
// Blockly.JavaScript.INFINITE_LOOP_TRAP =
//   'if(--window.LoopTrap == 0) throw "Infinite loop.";\n';
// var code = Blockly.JavaScript.workspaceToCode(demoWorkspace);
