"use client";
import { useState } from "react";

export default function Counter({ users }) {
  const [count, setCount] = useState(0);
  console.log(users);
  return (
    <div>
      <p>There are {users.length}</p>
      <button onClick={() => setCount((c) => c + 1)}>{count}</button>
    </div>
  );
}
