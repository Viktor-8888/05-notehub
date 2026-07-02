import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import { fetchNotes } from "../../services/noteService";
import css from "./App.module.css";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

export default function App() {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes(search, page),
    placeholderData: keepPreviousData,
  });
  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    handleSearch(value);
  };
  const totalPages = data?.totalPages ?? 0;

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load notes", {
        id: "fetch-error",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isFetching || !data) return;

    if (search !== inputValue) return;

    if (search.trim() === "") {
      toast.dismiss("no-notes");
      return;
    }

    if (data.notes.length > 0) {
      toast.dismiss("no-notes");
      return;
    }

    toast("No notes found for your request.", {
      id: "no-notes",
    });
  }, [isFetching, data, search, inputValue]);

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
            width: "100%",
          },
        }}
      />
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleInputChange} />
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
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
