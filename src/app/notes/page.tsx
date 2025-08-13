'use client'; // ضروري للـ client components

// import { useRouter } from 'next/navigation';

// export default function Notes() {
//     const data = [
//         { id: '1', title: "note1", descrption: 'desc1' },
//         { id: '2', title: "note2", descrption: 'desc2' },
//         { id: '3', title: "note3", descrption: 'desc3' },
//     ];

//     const router = useRouter();

//     function gotoDesc(item: any) {
//         const query = `?id=${item.id}&title=${encodeURIComponent(item.title)}&descrption=${encodeURIComponent(item.descrption)}`;
//         router.push(`/desc${query}`);
//     }

//     return (
//         <>
//             {data.map((item) => (
//                 <div
//                     key={item.id}
//                     onClick={() => gotoDesc(item)}
//                     className="show"
//                     style={{
//                         cursor: 'pointer',
//                         border: '2px dashed black',
//                         display: 'flex',
//                         justifyContent: 'space-around',
//                         width: '80%',
//                         height: "30px",
//                         color: "red",
//                         backgroundColor: 'gray',
//                         marginLeft: '10%'
//                     }}
//                 >
//                     <h1>{item.title}</h1>
//                     <p>{item.descrption}</p>
//                 </div>
//             ))}
//         </>
//     );
// }


import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewNote() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();

  const handleSave = () => {
    if (!title.trim()) return alert("Title is required");

    const note = {
      id: crypto.randomUUID(),
      title,
      body,
      createdAt: new Date().toISOString(),
    };

    const existingNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    existingNotes.push(note);
    localStorage.setItem("notes", JSON.stringify(existingNotes));

    router.push("/notes");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Note</h1>
      <input
        className="w-full border p-2 mb-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full border p-2 mb-4 h-40"
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
}
