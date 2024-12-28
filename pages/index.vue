<template>
  <div class="list-note">
    <h1 class="title">Мои заметки</h1>
    <div class="add-note">
      <input type="text" v-model="noteName" class="input-text">
      <button @click="goToCreatePage()" class="btn">Создать новую заметку</button>
    </div>
    <div class="note-block">
      <div v-for="note in notesStore.notes" :key="note.id" class="note-item">
        <div>
          <h2>{{ note.title }}</h2>
          <ul v-if="note.todos" class="note-item-list">
            <li v-for="todo in note.todos.slice(0, 3)" :key="todo.id">
              <span>{{ todo.text }}</span>
            </li>
          </ul>
        </div>
        <div class="list-note-btns">
          <button @click="goToEditPage(note.id)" class="btn">Редактировать</button>
          <button @click="deleteNote(note.id)" class="btn">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotesStore } from '~/store/note.ts';

const notesStore = useNotesStore();
const noteName = ref<string>('')

const goToEditPage = (id:number):void => {
  return navigateTo(`/edit/${id}`)
};

const deleteNote = (id:number):void => {
  if (confirm("Вы уверены, что хотите удалить эту заметку?")) {
    notesStore.deleteNote(id);
  }
};

const goToCreatePage = (): void => {
  if (noteName.value.trim() !== "") {
      notesStore.addNote({ id: Date.now(), title: noteName.value, todos: [] });
      noteName.value = '';
  } else {
    alert("Введите название заметки");
  }
};
</script>

<style scoped>
.list-note{
  width: 100%;
}

.title{
  color: var(--color-white);
}

.add-note{
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.note-block{
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 20px;
}

.note-item{
  background: var(--color-blue-light);
  padding: 12px;
  border-radius: 6px;
  max-width: 300px;
  height: 157px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.note-item-list{
  margin: 0;
  padding: 10px 0 20px 0;
}

.note-item-list li {
  list-style: none;
}

.list-note-btns{
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}
</style>
