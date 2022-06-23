import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
const BACKEND_URL = "https://api.todoist.com/rest/v1/tasks/";

/*
 * Plan:
 *   1. Define backend url
 *   2. Get items and show them +
 *   3. Toggle item done +
 *   4. Handle item add +
 *   5. Delete +
 *   6. Filter
 *
 * */

function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [completedItems, setCompletedItems] = useState([]);

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    axios
      .post(
        `${BACKEND_URL}`,
        {
          content: itemToAdd,
          done: false,
        },
        {
          headers: {
            Authorization: "Bearer 952d05d88d20fde23ffc9a57f11aad3f2bb05df5",
          },
        }
      )
      .then((response) => {
        setItems([...items, response.data]);
      });
    setItemToAdd("");
  };

  const toggleItemDone = (item) => {
    const { id, completed } = item;
    if (item.completed_date) {
      axios
          .post(`${BACKEND_URL}${item.task_id}/reopen`, {}, {
            headers: {
              Authorization: "Bearer 952d05d88d20fde23ffc9a57f11aad3f2bb05df5",
            },
          }
          )
          .then((response) => {
            setItems(
              items.map((item) => {
                if (item.id === id) {
                  return {
                    ...item,
                    completed: !completed,
                  };
                }
                return item;
              })
            );
          });
        
    } else {
      axios
      .post(
        `${BACKEND_URL}${id}/close`,
        {
          completed: !completed,
        },
        {
          headers: {
            Authorization: "Bearer 952d05d88d20fde23ffc9a57f11aad3f2bb05df5",
          },
        }
      )
      .then((response) => {
        setCompletedItems(
          completedItems.map((item) => {
            if (item.id === id) {
              return {
                ...item,
                completed: !completed,
              };
            }
            return item;
          })
        );
      
    });
  }
};

  // N => map => N
  // N => filter => 0...N
  const handleItemDelete = (id) => {
    axios.delete(`${BACKEND_URL}${id}`).then((response) => {
      const deletedItem = response.data;
      console.log("Было:", items);
      const newItems = items.filter((item) => {
        return deletedItem.id !== item.id;
      });
      console.log("Осталось:", newItems);
      // setItems((newItems) => newItems.filter((item) => item.id !== id));
      setItems(newItems);
    });
  };

  useEffect(() => {
    // console.log(searchValue)
    axios
      .get("https://api.todoist.com/sync/v8/completed/get_all", {
        headers: {
          Authorization: "Bearer 952d05d88d20fde23ffc9a57f11aad3f2bb05df5",
        },
      })
      .then((response) => {
        setCompletedItems(response.data.items);
      });
  }, []);

  useEffect(() => {
    // console.log(searchValue)
    axios
      .get("https://api.todoist.com/rest/v1/tasks", {
        headers: {
          Authorization: "Bearer 952d05d88d20fde23ffc9a57f11aad3f2bb05df5",
        },
      })
      .then((response) => {
        setItems(response.data);
      });
  }, []);

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>

      {/* List-group */}
      <div>
        <b id="active">Active tasks</b>
      </div>
      <ul className="list-group todo-list">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      <div>
        <b id="active">Completed tasks</b>
      </div>
      <ul className="list-group todo-list">
        {completedItems.length > 0 ? (
          completedItems.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No completed todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
