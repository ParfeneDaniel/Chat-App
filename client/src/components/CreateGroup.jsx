import React, { useEffect, useRef, useState } from "react";
import useAxiosInstance from "../hooks/useAxiosInstance";
import { useAuthContext } from "../contexts/AuthContext";
import { useChatContext } from "../contexts/ChatContext";

const CreateGroup = () => {
  const nameRef = useRef();
  const [users, setUsers] = useState(null);
  const [filter, setFilter] = useState("");
  const [guests, setGuests] = useState([]);
  const axiosInstance = useAxiosInstance();
  const { accessToken, username } = useAuthContext();
  const { setShowCreateGroup } = useChatContext();

  const handleChange = (e) => {
    setFilter(e.target.value);
  };

  const handleAddUser = (user) => {
    const alreadyInGuests = guests.find((guest) => guest.userId == user._id);
    if (!alreadyInGuests) {
      setGuests((prev) => [
        ...prev,
        { userId: user._id, username: user.username },
      ]);
    }
  };

  const handleRemoveUser = (user) => {
    const newGuest = [...guests].filter((guest) => guest.userId != user.userId);
    setGuests(newGuest);
  };

  const handleCreateGroup = () => {
    axiosInstance
      .post(
        "/users/createGroup",
        { name: nameRef.current.value, guests, username },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => setShowCreateGroup(false))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    axiosInstance
      .get("/users/getUsers", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => setUsers(response.data.users))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="createGroup">
      <div className="input">
        <input type="text" placeholder="Name" ref={nameRef} />
      </div>
      <div className="container">
        <div className="subContainer">
          <input type="text" onChange={handleChange} />
          <div>
            {users
              ?.filter((user) => user.username.includes(filter))
              .map((user) => (
                <div key={user._id} className="addUser">
                  <p>{user.username}</p>
                  <button onClick={() => handleAddUser(user)}>Add</button>
                </div>
              ))}
          </div>
        </div>
        <div className="subContainer">
          <div>
            {guests.map((quest, ind) => (
              <div key={ind} className="addUser">
                <p>{quest.username}</p>
                <button onClick={() => handleRemoveUser(quest)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="create">
        <button onClick={handleCreateGroup}>Create</button>
      </div>
    </div>
  );
};

export default CreateGroup;
