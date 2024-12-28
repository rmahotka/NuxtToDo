import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';

export const useNotesStore = defineStore('notes', () => {
    const notes = ref([]);
    const undoStack = ref([]);
    let isSaved = ref(false);

    const loadNotes = () => {
        const storedNotes = localStorage.getItem('notes');
        if (storedNotes) {
            notes.value = JSON.parse(storedNotes);
            undoStack.value = notes.value.map(note => ({ id: note.id, data: JSON.parse(JSON.stringify(note)) }));
        }
    };

    const saveNotes = () => {
        localStorage.setItem('notes', JSON.stringify(notes.value));
    };

    const addNote = (note) => {
        notes.value.push(note);
        saveNotes();
    };

    const deleteNote = (noteId) => {
        const index = notes.value.findIndex(note => note.id === noteId);
        if (index !== -1) {
            notes.value.splice(index, 1);
            saveNotes();
        }
    };

    const updateNote = (noteId, updatedNote) => {
        const noteIndex = notes.value.findIndex(note => note.id === noteId);
        if (noteIndex !== -1) {
            notes.value[noteIndex] = updatedNote;
            saveNotes();
        }
    };

    const addTodoToNote = (noteId, todo) => {
        const note = notes.value.find(note => note.id === noteId);
        if (note) {
            note.todos.push(todo);
            saveNotes();
        }
    };

    const deleteTodoFromNote = (noteId, todoId) => {
        const note = notes.value.find(note => note.id === noteId);
        if (note) {
            const todoIndex = note.todos.findIndex(todo => todo.id === todoId);
            if (todoIndex !== -1) {
                note.todos.splice(todoIndex, 1);
                saveNotes();
            }
        }
    };

    const saveStateBeforeChange = (noteId) => {
        const note = notes.value.find(note => note.id === noteId);
        if (note) {
            undoStack.value.push({
                id: note.id,
                data: JSON.parse(JSON.stringify(note))
            });
        }
    };

    const undo = (noteId) => {
        const lastStateIndex = undoStack.value.findIndex(state => state.id === noteId);
        if (lastStateIndex !== -1) {
            const lastState = undoStack.value[lastStateIndex];
            const noteIndex = notes.value.findIndex(note => note.id === noteId);
            if (noteIndex !== -1) {
                notes.value[noteIndex] = lastState.data;
                undoStack.value.splice(lastStateIndex, 1);
                saveNotes();
            }
        }
    };

    const saveChanges = () => {
        isSaved.value = true;
        alert("Изменения сохранены");
    };

    onMounted(() => {
        loadNotes();
    });

    return {
        loadNotes,
        saveNotes,
        addNote,
        deleteNote,
        updateNote,
        addTodoToNote,
        deleteTodoFromNote,
        undo,
        saveStateBeforeChange,
        saveChanges,
        notes,
        undoStack,
        isSaved
    };
});
