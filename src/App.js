import React, { useState, useEffect } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import Navbar from "./components/Navbar";

export default function App() {
  const [stories, setStories] = useState([]);
  const [newStory, setNewStory] = useState("");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Fetch stories from Firestore
  useEffect(() => {
    fetchStories();
  }, []);

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
    <div className={darkMode ? "bg-gray-900 text-white min-h-screen" : "bg-white text-black min-h-screen"}>
      {/* Navbar */}
      <Navbar user={user} setDarkMode={setDarkMode} darkMode={darkMode} />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">📖 Story Collection</h1>

        {/* Admin Section */}
        {user ? (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold">Add a New Story</h2>
            <textarea
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Write a new story..."
              value={newStory}
              onChange={(e) => setNewStory(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md mt-2"
              onClick={addStory}
            >
              ➕ Add Story
            </button>
            <button
              className="ml-4 text-red-500 underline"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold">🔒 Admin Login</h2>
            <input
              className="w-full p-2 border rounded-md my-2 dark:bg-gray-700 dark:text-white"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full p-2 border rounded-md my-2 dark:bg-gray-700 dark:text-white"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded-md" onClick={login}>
              🔑 Login
            </button>
          </div>
        )}

        {/* Story List */}
        <h2 className="text-2xl font-semibold mb-4">📚 Stories</h2>
        {stories.length === 0 ? (
          <p>No stories available.</p>
        ) : (
          stories.map((story) => (
            <div key={story.id} className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
              <p className="text-lg">{story.text}</p>
              {user && (
                <button
                  className="text-red-500 underline mt-2"
                  onClick={() => removeStory(story.id)}
                >
                  ❌ Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
