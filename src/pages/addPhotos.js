import React, { useState } from "react";

import { Navigate } from "react-router-dom";

import Editor from "../Editor";



export default function CreatePost() {

  const [title, setTitle] = useState('');

  const [files, setFiles] = useState([]);

  const [redirect, setRedirect] = useState(false);



  async function createNewPost(ev) {

    ev.preventDefault();



    const data = new FormData();

    data.set('title', title);



    // Append each file to FormData

    files.forEach((file) => {

      data.append('files', file);

    });



    const response = await fetch('https://certgen-backend.vercel.app/post', {

      method: 'POST',

      body: data,

      credentials: 'include',

    });



    if (response.ok) {

      setRedirect(true);

    }

  }



  if (redirect) {

    return <Navigate to={'/'} />

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

        multiple  // Allow selecting multiple files

        name="files"  // Change the name to match backend expectation

      />

      {/* <Editor value={content} onChange={setContent} className="editor-border" /> */}

      <button style={{ marginTop: '1rem' }}>Create post</button>

    </form>

  );

}
