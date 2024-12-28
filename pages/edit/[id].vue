<template>
  <div>
    <IconBackSvg @click="onBack" class="btn back"/>
  </div>
  <div class="note">
    <h1>Редактирование заметки</h1>
    <div v-if="note">
      <div class="note-edit-block">
        <input
            v-model="note.title"
            class="input-text note-edit"
            type="text"
            placeholder="Название заметки"
        >
        <IconEditSvg />
      </div>
      <div class="add-new-todo">
        <input
            v-model="newTodo"
            @keydown.enter="addTodo"
            class="input-text"
            type="text"
            placeholder="Добавить новую задачу">
        <button
            class="btn"
            @click="addTodo"
        >
          <IconAddSvg/>
        </button>
      </div>
      <h3>Список задач</h3>
      <ul class="list-todo">
        <li
            v-for="todo in note.todos"
            :key="todo.id"
            class="list-todo-li"
        >
          <label
              class="task-item__checkbox"
          >
            <input
                v-model="todo.completed"
                type="checkbox"
                class="checkbox"
            />
            <span class="checkmark"></span>
          </label>
          <input
              v-model="todo.text"
              class="input-text"
              v-if="editTodoValue === todo.id"
              type="text"
              @blur="saveTodo"
              placeholder="Задача"
          >
          <p v-else>{{todo.text}}</p>
          <button class="btn" @click="deleteTodo(todo.id)"><IconTrashSvg/></button>
          <button
              v-if="editTodoValue === todo.id"
              class="btn"
              @click="saveTodo()"
          >
            <IconSaveSvg/>
          </button>
          <button
              v-else
              class="btn"
              @click="editTodo(todo.id)"
          >
            <IconEditSvg/>
          </button>
        </li>
      </ul>
      <div class="btn-block">
        <button class="btn" @click="saveChanges">Сохранить изменения</button>
        <button class="btn" @click="undoChanges">Отменить</button>
        <button class="btn" @click="deleteNote">Удалить заметку</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from '~/store/note.ts';
import { useRouter, useRoute } from 'vue-router';
import { Ref, computed, ref } from 'vue';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface Note {
  id: number;
  title: string;
  todos: Todo[];
}

const notesStore = useNotesStore();
const router = useRouter();
const route = useRoute();

const note = computed<Note | undefined>(() => notesStore.notes.find(n => n.id === Number(route.params.id)));

const newTodo = ref<string>('');
const editTodoValue = ref<number | null>(null);

const onBack = (): void => {
  return navigateTo('/');
};

const addTodo = (): void => {
  if (newTodo.value.trim() !== "") {
    const todo: Todo = { id: Date.now(), text: newTodo.value, completed: false };
    notesStore.addTodoToNote(note.value!.id, todo);
    newTodo.value = '';
  }
};

const deleteTodo = (todoId: number): void => {
  if (confirm("Вы уверены, что хотите удалить эту задачу?")) {
    notesStore.deleteTodoFromNote(note.value!.id, todoId);
  }
};

const editTodo = (todoId: number): void => {
  editTodoValue.value = todoId;
};

const saveTodo = (): void => {
  editTodoValue.value = null;
};

const saveChanges = (): void => {
  if (note.value) {
    notesStore.saveStateBeforeChange(note.value.id);
    notesStore.updateNote(note.value.id, note.value);
    alert("Изменения сохранены");
  }
};

const undoChanges = (): void => {
  if (note.value && confirm("Вы уверены, что хотите отменить редактирование?")) {
    notesStore.undo(note.value.id);
  }
};

const deleteNote = (): void => {
  if (note.value && confirm("Вы уверены, что хотите удалить эту заметку?")) {
    notesStore.deleteNote(note.value.id);
    router.push('/');
  }
};
</script>

<style scoped>
.note h1{
  text-align: center;
  color: var(--color-white);
}
.note h3{
  margin: 10px 0;
  text-align: center;
}

.add-new-todo{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.list-todo-li{
  display: flex;
  align-items: center;
  gap: 10px;
}

.list-todo-li p {
  margin: 0;
  padding: 0;
  max-width: 350px;
  width: 100%;
  font-size: 20px;
}

.list-todo{
  padding: 20px 0 30px 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task-item__checkbox input[type="checkbox"] {
  display: none;
}

.task-item__checkbox .checkmark {
  position: relative;
  display: block;
  width: 18px;
  height: 18px;
  border: 2px solid var(--color-gray);
  border-radius: 4px;
  background-color: inherit;
  cursor: pointer;
}

.task-item__checkbox input[type="checkbox"]:checked + .checkmark {
  background-color: var(--color-green);
  border-color: var(--color-green);
}

.task-item__checkbox input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  color: var(--color-white);
  background-color: var(--color-green);
  width: 4px;
  height: 9px;
  border: solid var(--color-white);
  border-width: 0 2px 2px 0;
  transform: translate(-50%, -50%) rotate(45deg);
}

.task-item__checkbox .checkmark:hover {
  border-color: var(--color-white);
}

.note-edit-block{
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  color: var(--color-white);
}

.note-edit{
  text-align: center;
  border-bottom: 0;
  max-width: 100%;
  font-size: 25px;
}

.btn-block{
  display: flex;
  align-items: center;
  gap: 8px;
}

.back{
  font-size: 20px;
  padding: 4px 20px;
}
</style>
