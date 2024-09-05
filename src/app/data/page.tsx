'use client'
import { supabaseClient } from "@/utils/supabaseClient";
import { useSession, useAuth } from "@clerk/nextjs";
import React from "react";

const DataComponent = () => {
  const { session } = useSession();
  const { userId } = useAuth();

  const handleInsertData = async () => {
    if (!session || !userId) {
      console.error("User not authenticated");
      return;
    }

    const token = await session.getToken({ template: "supabase" });
    const supabase = await supabaseClient(token);

    const { error } = await supabase.from("2Secure").insert({ user_id: userId });
    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully");
    }
  };

  return (
    <div>
      <button onClick={handleInsertData}>Insert Data</button>
      {userId && <p>User ID: {userId}</p>}
    </div>
  );
};

export default DataComponent;