import React, { useState } from "react";
import { Navigate } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState([]);
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();

    const formData = new FormData();
    formData.append('title', title);

    // Append each file to FormData with the correct field name matching your backend configuration
    files.forEach((file, index) => {
      formData.append('files', file); // Adjust the field name if different
    });

    const response = await fetch('http://localhost:4000/post', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (response.ok) {
      setRedirect(true);
    } else {
      // Handle errors here
      console.error('Error creating post:', response.statusText);
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <form onSubmit={createNewPost} className="create-post-form">
      <input
        type="title"
        placeholder={'Title'}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="file"
        onChange={(ev) => setFiles([...ev.target.files])}
        multiple // Allow selecting multiple files
      />
      <button style={{ marginTop: '1rem' }}>Create post</button>
    </form>
  );
}
