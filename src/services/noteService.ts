import axios from "axios";
import type { Note, CreateNoteRequest } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN as string;

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  perPage: number;
}

export async function fetchNotes(
  search: string,
  page: number,
): Promise<FetchNotesResponse> {
  const response = await axios.get<FetchNotesResponse>("/notes", {
    params: { search, page, perPage: 12 },
  });
  return response.data;
}

export async function createNote(note: CreateNoteRequest): Promise<Note> {
  const response = await axios.post<Note>("/notes", note);
  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await axios.delete(`/notes/${id}`);
  return response.data;
}
