import { useState } from "react";
import { trpc } from "../../../lib/trpc";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Trash2, Check, X, Star, Film } from "lucide-react";

export function MovieWatchlist() {
  // Form state
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");

  // Filter state
  const [filterWatched, setFilterWatched] = useState<boolean | undefined>(
    undefined
  );

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  // 📖 Fetch movies with filters
  const moviesQuery = trpc.movie.getAll.useQuery(
    filterWatched !== undefined ? { watched: filterWatched } : undefined
  );

  // 📊 Fetch statistics
  const statsQuery = trpc.movie.getStats.useQuery();

  // ✏️ Create mutation
  const createMutation = trpc.movie.create.useMutation({
    onSuccess: () => {
      moviesQuery.refetch();
      statsQuery.refetch();
      resetForm();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // 🔄 Update mutation
  const updateMutation = trpc.movie.update.useMutation({
    onSuccess: () => {
      moviesQuery.refetch();
      statsQuery.refetch();
      setEditingId(null);
      resetForm();
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // 🗑️ Delete mutation
  const deleteMutation = trpc.movie.delete.useMutation({
    onSuccess: () => {
      moviesQuery.refetch();
      statsQuery.refetch();
    },
  });

  // 🎯 Toggle watched mutation
  const toggleWatchedMutation = trpc.movie.toggleWatched.useMutation({
    onSuccess: () => {
      moviesQuery.refetch();
      statsQuery.refetch();
    },
  });

  const resetForm = () => {
    setTitle("");
    setYear("");
    setGenre("");
    setRating("");
    setNotes("");
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    const movieData = {
      title,
      year: year ? parseInt(year) : undefined,
      genre: genre || undefined,
      rating: rating ? parseInt(rating) : undefined,
      notes: notes || undefined,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...movieData });
    } else {
      createMutation.mutate(movieData);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (movie: any) => {
    setEditingId(movie.id);
    setTitle(movie.title);
    setYear(movie.year?.toString() || "");
    setGenre(movie.genre || "");
    setRating(movie.rating?.toString() || "");
    setNotes(movie.notes || "");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-gray-800 flex items-center justify-center gap-3">
            <Film className="w-12 h-12 text-purple-600" />
            Movie Watchlist
          </h1>
          <p className="text-gray-600">
            Track your favorite movies and what you want to watch
          </p>
        </div>

        {/* Statistics */}
        {statsQuery.data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Movies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {statsQuery.data.total}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Watched</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {statsQuery.data.watched}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">To Watch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {statsQuery.data.unwatched}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {statsQuery.data.averageRating?.toFixed(1)}/10
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add/Edit Movie Form */}
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Movie" : "Add New Movie"}</CardTitle>
            <CardDescription>
              {editingId
                ? "Update movie details"
                : "Add a movie to your watchlist"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    placeholder="The Shawshank Redemption"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Year</label>
                  <Input
                    type="number"
                    placeholder="1994"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Genre</label>
                  <Input
                    placeholder="Drama"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Rating (1-10)</label>
                  <Input
                    type="number"
                    placeholder="9"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Your thoughts about this movie..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {editingId ? "Update Movie" : "Add Movie"}
                </Button>

                {editingId && (
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={filterWatched === undefined ? "default" : "outline"}
                onClick={() => setFilterWatched(undefined)}
              >
                All Movies
              </Button>
              <Button
                variant={filterWatched === true ? "default" : "outline"}
                onClick={() => setFilterWatched(true)}
              >
                Watched
              </Button>
              <Button
                variant={filterWatched === false ? "default" : "outline"}
                onClick={() => setFilterWatched(false)}
              >
                To Watch
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Movie List */}
        <div className="space-y-4">
          {moviesQuery.isLoading && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">Loading movies...</p>
              </CardContent>
            </Card>
          )}

          {moviesQuery.data?.length === 0 && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-gray-500">
                  No movies yet. Add your first movie above!
                </p>
              </CardContent>
            </Card>
          )}

          {moviesQuery.data?.map((movie) => (
            <Card
              key={movie.id}
              className={`transition-all hover:shadow-lg ${
                movie.watched ? "bg-green-50 border-green-200" : ""
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {movie.title}
                      </h3>
                      {movie.year && (
                        <span className="text-gray-500 text-lg">
                          ({movie.year})
                        </span>
                      )}
                      {movie.watched && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Watched
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {movie.genre && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {movie.genre}
                        </span>
                      )}
                      {movie.rating && (
                        <span className="flex items-center gap-1 font-semibold text-yellow-600">
                          <Star className="w-4 h-4 fill-yellow-400" />
                          {movie.rating}/10
                        </span>
                      )}
                    </div>

                    {movie.notes && (
                      <p className="text-gray-600 mt-2 italic">
                        "{movie.notes}"
                      </p>
                    )}

                    <p className="text-xs text-gray-400">
                      Added {new Date(movie.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        toggleWatchedMutation.mutate({ id: movie.id })
                      }
                      disabled={toggleWatchedMutation.isPending}
                      title={
                        movie.watched ? "Mark as unwatched" : "Mark as watched"
                      }
                    >
                      {movie.watched ? (
                        <X className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(movie)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm(`Delete "${movie.title}"?`)) {
                          deleteMutation.mutate({ id: movie.id });
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
