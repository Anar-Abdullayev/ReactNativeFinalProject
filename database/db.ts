import { Task } from '@/constants/Task';
import * as SQLite from 'expo-sqlite';

export const createTables = async () => {
    const db = await SQLite.openDatabaseAsync('tasks');
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            is_completed INTEGER NOT NULL DEFAULT 0,
            deadline DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        `);
    const existing = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM tasks');
    if (existing?.count === 0) {
        await db.execAsync(`
            INSERT INTO tasks (title, description, is_completed, deadline)
            VALUES
                ('Buy groceries', 'Milk, Eggs, Bread, Fruits', 0, '2025-08-10 18:00:00'),
                ('Complete React Native app', 'Finish the task list screen and details screen', 0, '2025-08-12 23:59:00'),
                ('Workout', 'Leg day at the gym', 1, '2025-08-05 08:00:00'),
                ('Call mom', 'Weekly check-in call', 1, '2025-08-06 20:00:00'),
                ('Plan weekend trip', 'Look for places to visit on Saturday and Sunday', 0, '2025-08-09 10:00:00');
        `);
    }
}

export const fetchTasks = async (filter: 'all' | 'completed' | 'uncompleted') => {
    const db = await SQLite.openDatabaseAsync('tasks');
    let query = 'SELECT * FROM tasks';
    if (filter === 'completed') query += ' WHERE is_completed = 1';
    else if (filter === 'uncompleted') query += ' WHERE is_completed = 0';
    const data = await db.getAllAsync<Task>(query);
    return data;
}