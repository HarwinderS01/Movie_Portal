/**
 * Movies API Routes
 
 * Description:
 * This file contains API route handlers for managing movies in the IMR Movie Portal.
 * It provides CRUD operations to interact with the MongoDB database using Prisma.
 * 
 * Supported Operations:
 * - **GET**: Fetch all movies from the database.
 * - **POST**: Add a new movie to the database.
 * - **PUT**: Update an existing movie by its ID.
 * - **DELETE**: Remove a movie by its ID.
 * 
 * Technologies Used:
 * - **Prisma**: ORM for interacting with the MongoDB database.
 * - **NextResponse**: Utility to handle API responses in Next.js.
 * - **Next.js API Routes**: For server-side logic.
 * 
 * Major Functions:
 * - `GET`: Retrieves all movies and returns them as JSON.
 * - `POST`: Validates and adds a new movie to the database.
 * - `PUT`: Updates an existing movie's details based on its ID.
 * - `DELETE`: Deletes a movie from the database using its ID.
 * 
 * Error Handling:
 * - Returns meaningful error messages and appropriate HTTP status codes (e.g., 400 for validation errors, 500 for server errors).
 */

import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// Fetch all movies (GET)
export async function GET() {
  try {
    const movies = await prisma.movie.findMany();
    console.log('Fetched movies:', movies); // Debugging to confirm response
    return NextResponse.json(movies); // Ensure movies is an array
  } catch (err: unknown) {
    console.error('Error fetching movies:', err);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

// Add a new movie (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, actors, year } = body;

    if (!title || !actors || !year) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newMovie = await prisma.movie.create({
      data: {
        title,
        actors: typeof actors === 'string' ? actors.split(',').map((actor: string) => actor.trim()) : actors,
        year: parseInt(year, 10),
      },
    });

    return NextResponse.json(newMovie, { status: 201 });
  } catch (err: unknown) {
    console.error('Error adding movie:', err);
    return NextResponse.json(
      { error: 'Failed to add movie' },
      { status: 500 }
    );
  }
}

// Update an existing movie (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, actors, year } = body;

    if (!id || !title || !actors || !year) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        title,
        actors: typeof actors === 'string' ? actors.split(',').map((actor: string) => actor.trim()) : actors,
        year: parseInt(year, 10),
      },
    });

    return NextResponse.json(updatedMovie, { status: 200 });
  } catch (err: unknown) {
    console.error('Error updating movie:', err);
    return NextResponse.json(
      { error: 'Failed to update movie' },
      { status: 500 }
    );
  }
}

// Delete a movie (DELETE)
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing movie ID' },
        { status: 400 }
      );
    }

    await prisma.movie.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Movie deleted successfully' },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error('Error deleting movie:', err);
    return NextResponse.json(
      { error: 'Failed to delete movie' },
      { status: 500 }
    );
  }
}
