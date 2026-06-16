const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const meta = document.getElementById('todo-meta');
const clearAllBtn = document.getElementById('clear-all');
const STORAGE_KEY = 'simple_todos_v1';

function loadTodos(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }catch(e){return []}
}

function saveTodos(todos){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render(){
  const todos = loadTodos();
  list.innerHTML = '';
  if(todos.length === 0){
    const e = document.createElement('div');
    e.className = 'empty';
    e.textContent = '할 일을 추가해 보세요.';
    list.appendChild(e);
  } else {
    todos.forEach((t, i)=>{
      const li = document.createElement('li');
      const text = document.createElement('span');
      text.className = 'todo-text' + (t.done ? ' done' : '');
      text.textContent = t.text;

      // 더블클릭 시 편집
      text.addEventListener('dblclick', ()=>{
        const inp = document.createElement('input');
        inp.value = t.text;
        inp.className = 'edit-input';
        inp.style.flex = '1';
        li.replaceChild(inp, text);
        inp.focus();
        inp.select();
        function finish(){
          const v = inp.value.trim();
          if(v) todos[i].text = v;
          saveTodos(todos);
          render();
        }
        inp.addEventListener('blur', finish);
        inp.addEventListener('keydown', (ev)=>{ if(ev.key === 'Enter') inp.blur(); if(ev.key === 'Escape') render(); });
      });

      const actions = document.createElement('div');
      actions.className = 'actions';

      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = t.done ? '취소' : '완료';
      toggleBtn.addEventListener('click', ()=>{
        todos[i].done = !todos[i].done;
        saveTodos(todos);
        render();
      });

      const delBtn = document.createElement('button');
      delBtn.textContent = '삭제';
      delBtn.addEventListener('click', ()=>{
        todos.splice(i,1);
        saveTodos(todos);
        render();
      });

      actions.appendChild(toggleBtn);
      actions.appendChild(delBtn);

      li.appendChild(text);
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  const remaining = loadTodos().filter(t=>!t.done).length;
  meta.textContent = `${remaining}개 남음`;
}

form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const v = input.value && input.value.trim();
  if(!v) return;
  const todos = loadTodos();
  todos.push({text:v,done:false});
  saveTodos(todos);
  input.value = '';
  render();
});

clearAllBtn.addEventListener('click', ()=>{
  if(!confirm('모든 항목을 삭제할까요?')) return;
  saveTodos([]);
  render();
});

// 초기 렌더
render();
