import { Task } from "@/constants/Task";
import { fetchTasks } from "@/database/db";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Button, Card, Chip, Text } from 'react-native-paper';

export default function TasksListScreen() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<'all' | 'completed' | 'uncompleted'>('all');
    const navigation = useNavigation<any>();

    useEffect(() => {
        const fetchTasksAsync = async () => {
           const data = await fetchTasks(filter);
           setTasks(data);
        };

        fetchTasksAsync();
    }, [filter])


    const renderItem = ({ item }: { item: Task }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('TaskDetail' as never, { taskId: item.id } as never)}
        >
            <Card style={{ margin: 8, elevation: 3 }}>
                <Card.Content>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text variant="bodyMedium">{item.title}</Text>
                        <Chip
                            style={{
                                backgroundColor: item.is_completed ? '#c8e6c9' : '#ffcdd2'
                            }}
                            textStyle={{
                                color: item.is_completed ? 'green' : 'red'
                            }}
                        >
                            {item.is_completed ? 'Done' : 'Pending'}
                        </Chip>
                    </View>
                    {item.deadline && <Text variant="bodySmall">Deadline: {item.deadline}</Text>}
                    {item.description && <Text variant="bodySmall">{item.description}</Text>}
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, padding: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 }}>
                <Button mode={filter === 'all' ? 'contained' : 'outlined'} onPress={() => setFilter('all')}>All</Button>
                <Button mode={filter === 'completed' ? 'contained' : 'outlined'} onPress={() => setFilter('completed')}>Completed</Button>
                <Button mode={filter === 'uncompleted' ? 'contained' : 'outlined'} onPress={() => setFilter('uncompleted')}>Pending</Button>
            </View>

            <FlatList
                data={tasks}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
            />
        </View>
    );
}