/* V18 actor state machine. Independent from renderer and save data. */
(function(root){'use strict';
const states=Object.freeze(['idle','walk','work','carry','hurt','dead']);
const frames=Object.freeze({idle:4,walk:6,work:8,carry:6,hurt:3,dead:6});
function transition(actor,next){if(!states.includes(next))throw Error('invalid actor state '+next);if(actor.state==='dead'&&next!=='dead')return actor;return {...actor,state:next,frame:0,elapsed:0};}
function advance(actor,dt){const state=states.includes(actor.state)?actor.state:'idle',fps=state==='work'?9:state==='walk'?10:state==='dead'?6:7;
 const elapsed=Math.max(0,Number(actor.elapsed)||0)+Math.max(0,Number(dt)||0),count=frames[state],index=Math.floor(elapsed*fps);
 return {...actor,state,elapsed,frame:state==='dead'?Math.min(count-1,index):index%count};
}
function jobState(job,phase){if(phase==='injured')return 'hurt';if(phase==='dead')return 'dead';if(phase==='transport'||phase==='delivery')return 'carry';if(phase==='moving'||phase==='travel')return 'walk';if(phase==='working'||phase==='harvest'||phase==='chop'||phase==='build')return 'work';return 'idle';}
root.PetecoActorV18=Object.freeze({states,frames,transition,advance,jobState});
})(typeof window!=='undefined'?window:globalThis);
