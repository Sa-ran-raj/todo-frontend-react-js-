import { useEffect, useState } from "react";


export default function Todo() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todo, setTodo] = useState([]);
    const [error, Seterror] = useState("");
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(-1);
    const api_url = import.meta.env.VITE_API_URL;

    //editing states

    const [edittitle, seteditTitle] = useState("");
    const [editdescription, seteditDescription] = useState("");

    const handleUpdate= async()=>{
        Seterror("");
        if (edittitle.trim() !== "" && editdescription.trim() !== "") {
            try {
                const res = await fetch(`${api_url}/todos/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({  title: edittitle, 
                        description: editdescription  }),
                });
                if (res.ok) {
                    const updatedtodo = todo.map((item) => {
                        if (item._id === editingId) {
                            return {
                                ...item,
                                title: edittitle,
                                description: editdescription
                            };
                        }
                        return item;
                    })
                    
                    setTodo(updatedtodo);  // Add the complete todo with ID to state
                    setMessage("Item Updated Successfully");
                    Seterror("");
                    setTitle("");
                    setDescription("");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                    setEditingId(-1);
                } else {
                    throw new Error("Unable to do the process");
                }
            } catch (error) {
                Seterror(error.message);
                setMessage("");
                
            }
        }

    }


    const handledelete =(id)=>{
        if(window.confirm("Are you sure want to delete")){
            fetch(api_url+'/todos/'+id,
                {
                    method:"DELETE"
                }
            )
            .then(()=>{
                const updatedtodo=todo.filter((item)=>item._id!==id)
                setTodo(updatedtodo)
            })

        }

    }



    const handlesubmit = async () => {
        Seterror("");
        if (title.trim() !== "" && description.trim() !== "") {
            try {
                const res = await fetch(api_url + "/todos", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, description }),
                });
                if (res.ok) {
                    const newTodoWithId = await res.json();  // Get the response with ID from server
                    console.log('New todo with ID:', newTodoWithId);  // See what we got back
                    setTodo([...todo, newTodoWithId]);  // Add the complete todo with ID to state
                    setMessage("Item added Successfully");
                    Seterror("");
                    setTitle("");
                    setDescription("");
                    setTimeout(() => {
                        setMessage("");
                    }, 3000);
                } else {
                    throw new Error("Unable to do the process");
                }
            } catch (error) {
                Seterror(error.message);
                setMessage("");
                setTitle("");
                setDescription("");
            }
        }
    }
    useEffect(() => {
        getItems()
    }, [])

    const getItems = () => {
        fetch(api_url + '/todos')
            .then((res) => res.json())
            .then((res) => setTodo(res))
    }
    const handleeditcancel=()=>{
        setEditingId(-1);
    }




    return (

        <>
            <div className="row p-3 bg-success text-light">
                <h1>Todo Project With Mern Stack
                </h1>
            </div>

            <div className="row">
                <h3>Add Item</h3>
                <p className="text-success">{message}</p>
                <div className="form-group d-flex gap-2">
                    <input placeholder="Title" type="text" onChange={(e) => setTitle(e.target.value)} value={title} className="form-control" />
                    <input placeholder="Description" type="text" onChange={(e) => setDescription(e.target.value)} value={description} className="form-control" />
                    <button className="btn btn-dark" onClick={handlesubmit}>Submit</button>
                </div>
                {error && <p className="text-danger">{error}</p>}
            </div>

            <div className="row mt-3">
                <h3>Tasks</h3>
                <ul className="list-group">
                    {todo.map((item) =>
                        <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2" key={item._id} >
                            <div className="d-flex flex-column me-2">
                                {
                                    editingId === -1 || editingId!== item._id ?   <>
                                        <span className="fw-bold">{item.title}</span>
                                        <span>{item.description}</span>
                                    </> : <>

                                        <div className="form-group d-flex gap-2">
                                            <input placeholder="Title" type="text" onChange={(e) => seteditTitle(e.target.value)} value={edittitle} className="form-control" />
                                            <input placeholder="Description" type="text" onChange={(e) => seteditDescription(e.target.value)} value={editdescription} className="form-control" />

                                        </div>

                                    </>
                                }

                            </div>

                            <div className="d-flex gap-2">
                                {
                                    editingId===-1 || editingId!== item._id ?<> 
                                    <button className="btn btn-warning" onClick={() => {setEditingId(item._id); seteditTitle(item.title); seteditDescription(item.description);}}>Edit</button>
                                    <button className="btn btn-danger" onClick={()=>handledelete(item._id)}>Delete</button> </>:<>
                                    <button className="btn btn-warning" onClick={handleUpdate}>Update</button>  <button className="btn btn-danger" onClick={handleeditcancel}>Cancel</button></>
                                }
                                
                                
                               
                            </div>

                        </li>


                    )}


                </ul>
            </div>
        </>
    )
}