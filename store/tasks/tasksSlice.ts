import { Task } from "@/constants/Task";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TasksState {
  list: Task[];
}

const initialState: TasksState = {
  list: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.list = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.list.push(action.payload);
    },
    updateTask: (state, action: any) => {
      const index = state.list.findIndex((t) => t.id === action.payload.taskId);
      if (index !== -1) {
        state.list[index].is_completed = action.payload.isCompleted ? 1 : 0;
      }
    },
    removeTask: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((t) => t.id !== action.payload);
    },
  },
});

export const { setTasks, addTask, updateTask, removeTask } = tasksSlice.actions;
export default tasksSlice.reducer;
