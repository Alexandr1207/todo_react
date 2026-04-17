import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import { FormControlLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Edit as EditIcon, DeleteOutline as DeleteOutlineIcon, Add } from '@mui/icons-material';


function AddField({onTextChange, inputValue, addTask}) {
    return (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-end',
            marginBottom: '24px',
            borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
            '&:hover': {
                borderBottom: '2px solid rgba(0, 0, 0, 0.87)',
            },
            '&:focus-within': {
                borderBottom: '2px solid #1976d2',
            }
        }}>
            <TextField
                label="Имя новой задачи"
                variant="standard"
                fullWidth
                InputProps={{ 
                    disableUnderline: true
                }}
                sx={{
                    '& .MuiInputLabel-root': {
                    }
                }}
                onChange={(e) => onTextChange(e.target.value)}
            />
            <IconButton
                onClick={(e) => {addTask(inputValue);}}>
                <Add />
            </IconButton>
        </Box>
    );
}


function AddTask({id, text, deleteTask, updateTask, toggleTaskStatus, isDone}){
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(text);

    const handleSave = () => {
        updateTask(id, editText);
        setIsEditing(false);
    };

    return(
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '12px',
            alignItems: 'center'
        }}>
            <Box sx={{ flexGrow: 1 }}>
                {isEditing ? (
                    <TextField 
                        variant="standard"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                        autoFocus
                        fullWidth
                    />
                ) : (
                    <FormControlLabel 
                        control={<Checkbox color="primary" checked={isDone}onChange={() => toggleTaskStatus(id, isDone)}/>} 
                        label={text} 
                    />
                )}
            </Box>
            <Box>
                {!isDone && 
                    <IconButton size="small" color="primary" onClick={() => setIsEditing(!isEditing)}>
                    <EditIcon fontSize="small" />
                </IconButton>
                }
                <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => deleteTask(id)}
                >
                    <DeleteOutlineIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}


export default function App(){
    const [inputValue, setinputValue] = useState('');

    const [taskList, setTaskList] = useState(() => {
        const saved = localStorage.getItem('taskList');
        return saved ? JSON.parse(saved) : [];
    });

    const [nextId, setNextId] = useState(() => {
        const saved = localStorage.getItem('nextId');
        return saved ? JSON.parse(saved) : 1;
    });

    const [completedList, setCompletedList] = useState(() => {
        const saved = localStorage.getItem('completedList');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('taskList', JSON.stringify(taskList));
    }, [taskList]);

    useEffect(() => {
        localStorage.setItem('completedList', JSON.stringify(completedList));
    }, [completedList]);

    useEffect(() => {
        localStorage.setItem('nextId', JSON.stringify(nextId));
    }, [nextId]);

    function HandleAddTask(e){
        if(e.trim().length > 0){
            setNextId(nextId + 1);
            setTaskList([...taskList, {id: nextId, name: e}]);
        }
    }

    function HandleDeleteTask(id){
        setTaskList(taskList.filter(task => task.id !== id));
        setCompletedList(completedList.filter(task => task.id !== id));
    }

    function HandleUpdateTask(id, newName) {
        setTaskList(taskList.map(task => 
            task.id === id ? { ...task, name: newName} : task
        ));
    }

    const toggleTaskStatus = (id, isDone) => {
        if (isDone) {
            const task = completedList.find(t => t.id === id);
            setCompletedList(completedList.filter(t => t.id !== id));
            setTaskList([...taskList, task]);
        }
        else {
        const task = taskList.find(t => t.id === id);
        setTaskList(taskList.filter(t => t.id !== id));
        setCompletedList([...completedList, task]);
    }
    };

    return(
        <Container maxWidth="sm">
            <Box sx={{ 
              bgcolor: '#cfe8fc', 
              minHeight: '100vh', 
              borderRadius: '10px', 
              padding: '32px' }}>
                <Typography variant="h4" sx={{marginBottom: '8px'}}>TODO</Typography>

                <AddField
                    onTextChange={(t) => {setinputValue(t)}}
                    inputValue={inputValue}
                    addTask={(t) => HandleAddTask(t)}
                />

                <Typography variant="h6" sx={{textAlign: 'center'}}>План ({taskList.length})</Typography>

                {taskList.map(t => (
                    <AddTask 
                        key={t.id} 
                        id={t.id} 
                        text={t.name} 
                        isDone={false} 
                        deleteTask={HandleDeleteTask} 
                        toggleTaskStatus={toggleTaskStatus} 
                        updateTask={HandleUpdateTask}
                    />
                ))}

                {completedList.length > 0 && (
                    <Typography variant='h6' sx={{textAlign: 'center', marginTop: '20px'}}>
                        Готово ({completedList.length})
                    </Typography>
                )}

                {completedList.map(t => (
                    <AddTask 
                        key={t.id} 
                        id={t.id} 
                        text={t.name} 
                        isDone={true} 
                        deleteTask={HandleDeleteTask} 
                        toggleTaskStatus={toggleTaskStatus} 
                    />
                ))}
            </Box>

        </Container>
    );
}