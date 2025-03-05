import React, { useState, useEffect } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function App() {
  const [stories, setStories] = useState([]);
  const [newStory, setNewStory] = useState("");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchStories();
  }, []);

  // Fetch stories from Firestore
  async function fetchStories() {
    const querySnapshot = await getDocs(collection(db, "stories"));
    setStories(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  }

  // Add a new story
  async function addStory() {
    if (newStory.trim() === "") return;
    await addDoc(collection(db, "stories"), { text: newStory, timestamp: new Date() });
    setNewStory("");
    fetchStories();
  }

  // Delete a story
  async function removeStory(id) {
    await deleteDoc(doc(db, "stories", id));
    fetchStories();
  }

  // Handle login
  function login() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => setUser(userCredential.user))
      .catch((error) => alert(error.message));
  }

  // Handle logout
  function logout() {
    signOut(auth).then(() => setUser(null));
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Story Collection</h1>

      {user ? (
        <>
          <button onClick={logout}>Logout</button>
          <textarea
            placeholder="Write a new story..."
            value={newStory}
            onChange={(e) => setNewStory(e.target.value)}
          />
          <button onClick={addStory}>Add Story</button>
        </>
      ) : (
        <div>
          <h2>Admin Login</h2>
          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={login}>Login</button>
        </div>
      )}

      <h2>Stories</h2>
      {stories.map((story) => (
        <div key={story.id}>
          <p>{story.text}</p>
          {user && <button onClick={() => removeStory(story.id)}>Delete</button>}
        </div>
      ))}
    </div>
  );
}
