import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService";
import type { CreateNoteRequest } from "../../types/note";
import css from "./App.module.css";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes(search, page),
    placeholderData: keepPreviousData,
  });
  const handleSearch = useDebouncedCallback((newNote: string) => {
    setSearch(newNote);
    setPage(1);
  }, 300);
  const totalPages = data?.totalPages ?? 0;

  const queryClient = useQueryClient();

  const mutationCreateNote = useMutation({
    mutationFn: (note: CreateNoteRequest) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
    },
  });
  const handleCreateNote = (note: CreateNoteRequest) => {
    mutationCreateNote.mutate(note);
  };
  const mutationDeleteNote = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
  const handleDelete = (id: string) => {
    mutationDeleteNote.mutate(id);
  };
  useEffect(() => {
    if (data && data.notes.length === 0) {
      toast("No notes found for your request.");
    }
  }, [data]);
  return (
    <div className={css.app}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#fb92a4ff",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
          },
        }}
      />
      <header className={css.toolbar}>
        <SearchBox search={search} onSearch={handleSearch} />
        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={handleDelete} />
      )}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onSubmit={handleCreateNote}
            onClose={() => setIsModalOpen(false)}
            isPending={mutationCreateNote.isPending}
          />
        </Modal>
      )}
    </div>
  );
}
