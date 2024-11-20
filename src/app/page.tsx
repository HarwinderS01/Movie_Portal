/**
 * HomePage Component
 
 * Description:
 * This component serves as the main page for the IMR Movie Portal.
 * It allows users to:
 * - View a list of movies fetched from the backend.
 * - Add new movies using a form.
 * - Edit existing movies by updating their details.
 * - Delete movies from the list.
 * 
 * Technologies Used:
 * - React for frontend rendering.
 * - Tailwind CSS for styling.
 * - Fetch API for communication with backend routes.
 * 
 * State Management:
 * - `movies`: Stores the list of movies.
 * - `newMovie`: Manages the form input for adding/editing movies.
 * - `editingMovie`: Tracks the movie currently being edited.
 * 
 * Major Functions:
 * - `fetchMovies`: Fetches the list of movies from the backend (GET request).
 * - `handleSubmit`: Handles both adding and updating movies (POST/PUT requests).
 * - `handleEdit`: Prepares a movie for editing by populating the form.
 * - `handleDelete`: Deletes a movie by sending a DELETE request to the backend.
 * 
 * UI Structure:
 * - Header: Displays the app title.
 * - Main: Contains the movie list and the form for adding/editing movies.
 * - Footer: Displays company contact information.
 */

'use client';

import { useState, useEffect } from 'react';

// Define the structure for the Movie object
type Movie = {
  id: string; // Unique identifier for each movie
  title: string; // Title of the movie
  actors: string[]; // List of actors
  year: number; // Release year of the movie
};

export default function HomePage() {
  // State to store the list of movies fetched from the backend
  const [movies, setMovies] = useState<Movie[]>([]);

  // State to store new movie form input or editing data
  const [newMovie, setNewMovie] = useState({ title: '', actors: '', year: '' });

  // State to track the movie being edited (if any)
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  // Fetch the list of movies when the component mounts
  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch('/api/movies'); // API call to fetch movies
        const data = await res.json();
        console.log(data); // Log the returned data to inspect its structure
        setMovies(Array.isArray(data) ? data : []); // Ensure movies is an array
      } catch (error) {
        console.error('Failed to fetch movies', error); // Log the error
      }
    }
    fetchMovies();
  }, []);
  
  // Handle form submission for adding or updating a movie
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = editingMovie ? 'PUT' : 'POST'; // Determine the API method

    const response = await fetch('/api/movies', {
      method, // Use POST to add or PUT to update
      headers: {
        'Content-Type': 'application/json', // Send data as JSON
      },
      body: JSON.stringify(
        editingMovie
          ? {
              id: editingMovie.id, // Include ID for updating a movie
              title: newMovie.title,
              actors: newMovie.actors.split(',').map((actor) => actor.trim()),
              year: parseInt(newMovie.year, 10),
            }
          : {
              title: newMovie.title, // Add new movie fields
              actors: newMovie.actors.split(',').map((actor) => actor.trim()),
              year: parseInt(newMovie.year, 10),
            }
      ),
    });

    if (response.ok) {
      const movie = await response.json();
      setMovies(
        editingMovie
          ? movies.map((m) => (m.id === movie.id ? movie : m)) // Update the movie list
          : [...movies, movie] // Add the new movie
      );
      setEditingMovie(null); // Clear editing state
      setNewMovie({ title: '', actors: '', year: '' }); // Reset form fields
    } else {
      alert('Failed to save movie'); // Show an error if API call fails
    }
  };

  // Populate form with movie data for editing
  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie); // Set the movie to be edited
    setNewMovie({
      title: movie.title,
      actors: movie.actors.join(', '), // Convert array to comma-separated string
      year: movie.year.toString(),
    });
  };

  // Handle movie deletion
  const handleDelete = async (id: string) => {
    const response = await fetch('/api/movies', {
      method: 'DELETE', // Call DELETE API route
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }), // Send the movie ID
    });

    if (response.ok) {
      setMovies(movies.filter((movie) => movie.id !== id)); // Remove the movie from state
    } else {
      alert('Failed to delete movie'); // Show an error if API call fails
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header Section */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <nav className="container mx-auto">
          <h1 className="text-3xl font-bold"> Movie Portal</h1>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        {/* Movie List Section */}
        <h2 className="text-2xl font-semibold mb-4">Movie List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-white p-4 rounded shadow-lg">
              <h3 className="text-xl font-bold">
                {movie.title} ({movie.year})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Actors: {movie.actors.join(', ')}
              </p>
              <div className="mt-4 flex justify-between">
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                  onClick={() => handleEdit(movie)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleDelete(movie.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Movie Form */}
        <h2 className="text-2xl font-semibold mt-8">
          {editingMovie ? 'Edit Movie' : 'Add New Movie'}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mt-4"
        >
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 border rounded mb-2"
            value={newMovie.title}
            onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Actors (comma-separated)"
            className="w-full p-2 border rounded mb-2"
            value={newMovie.actors}
            onChange={(e) =>
              setNewMovie({ ...newMovie, actors: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Year"
            className="w-full p-2 border rounded mb-2"
            value={newMovie.year}
            onChange={(e) =>
              setNewMovie({ ...newMovie, year: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {editingMovie ? 'Update Movie' : 'Add Movie'}
          </button>
        </form>
      </main>

      {/* Footer Section */}
      <footer className="bg-blue-600 text-white py-4 text-center">
        <p>© 2024 Portal. Contact us at info@CPRG-306.com</p>
      </footer>
    </div>
  );
}
