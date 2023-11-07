import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate the request method and body
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!req.body.command) {
    return res.status(400).json({ error: "Command is required" });
  }

  try {
    // Call the HuggingFace AI model API to generate the response
    const url = "https://api-inference.huggingface.co/models/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5";
    const data = { 
      inputs: req.body.command,
      options: {
        wait_for_model: true, // this will make the request wait until the model is ready
        max_length: 500, // Set your maximum desired length
        min_length: 50,
      }
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${req.headers.authorization}`
      }
    };
    const response = await axios.post(url, data, config);
    const answer = response.data[0].generated_text; // get the first element of the response.data array
 // match the part of the string after the newline character and get the first capture group
    console.log(answer); 
    // Return the stream URL from the response
    return res.status(200).json({ stream_url: answer.split("\n\n")[1] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
